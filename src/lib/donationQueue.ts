export interface PendingDonation {
  id: string;
  provider: "SAWERIA" | "SOCIABUZZ" | "BAGIBAGI" | "SIMULATOR";
  donator: string;
  robloxUsername: string;
  amount: number;
  cashReward: number;
  message: string;
  status: "PENDING" | "CLAIMED";
  timestamp: string;
  universeId?: string;
}

export interface LeasedClaim {
  apiVersion: number;
  claimToken: string;
  donations: Array<{
    transactionId: string;
    provider: string;
    providerTransactionId: string;
    name: string;
    userId?: number;
    amount: number;
    currency: string;
    message?: string;
    receivedAt: number;
    isTest: boolean;
  }>;
  policy: {
    claimTtlMs: number;
  };
}

// In-memory global queue for serverless runtime
declare global {
  // eslint-disable-next-line no-var
  var __AW_DONATION_QUEUE__: PendingDonation[] | undefined;
}

if (!globalThis.__AW_DONATION_QUEUE__) {
  globalThis.__AW_DONATION_QUEUE__ = [];
}

const queue = globalThis.__AW_DONATION_QUEUE__;

export function extractRobloxUsername(donatorName: string, message: string): string {
  // 1. Look for patterns like @Username in message
  const atMatch = message.match(/@([a-zA-Z0-9_]{3,20})/);
  if (atMatch) return atMatch[1];

  // 2. Look for "user: Username" or "roblox: Username" or "rblx: Username"
  const prefixMatch = message.match(/(?:user|roblox|rblx|nama)\s*[:=]\s*([a-zA-Z0-9_]{3,20})/i);
  if (prefixMatch) return prefixMatch[1];

  // 3. Check if donatorName itself is a valid Roblox username format (3-20 chars, alphanumeric + _)
  const cleanedDonator = donatorName.trim().replace(/^@/, "");
  if (/^[a-zA-Z0-9_]{3,20}$/.test(cleanedDonator)) {
    return cleanedDonator;
  }

  // Fallback to cleaned donator name
  return cleanedDonator || "Anonymous";
}

export function pushPendingDonation(donation: Omit<PendingDonation, "status">): PendingDonation {
  const item: PendingDonation = {
    ...donation,
    status: "PENDING",
  };
  queue.push(item);

  // Keep queue size manageable (last 200 items)
  if (queue.length > 200) {
    queue.shift();
  }

  return item;
}

export function claimDonationsForUsers(
  usernames: string[],
  universeId?: string
): PendingDonation[] {
  const normalizedTargets = usernames.map((u) => u.toLowerCase().trim());
  const claimed: PendingDonation[] = [];

  for (const item of queue) {
    if (item.status === "PENDING") {
      const matchUsername = normalizedTargets.includes(item.robloxUsername.toLowerCase().trim());
      const matchUniverse = !universeId || !item.universeId || item.universeId === universeId;

      if (matchUsername && matchUniverse) {
        item.status = "CLAIMED";
        claimed.push(item);
      }
    }
  }

  return claimed;
}

export function claimBatch(limit: number = 10, universeId?: string): LeasedClaim {
  const claimToken = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const claimed: PendingDonation[] = [];

  for (const item of queue) {
    if (claimed.length >= limit) break;
    if (item.status === "PENDING") {
      const matchUniverse = !universeId || !item.universeId || item.universeId === universeId;
      if (matchUniverse) {
        item.status = "CLAIMED";
        claimed.push(item);
      }
    }
  }

  return {
    apiVersion: 1,
    claimToken: claimed.length > 0 ? claimToken : "",
    donations: claimed.map((c) => ({
      transactionId: c.id,
      provider: c.provider.toLowerCase(),
      providerTransactionId: c.id,
      name: c.robloxUsername || c.donator,
      amount: c.amount,
      currency: "IDR",
      message: c.message,
      receivedAt: Math.floor(new Date(c.timestamp).getTime() / 1000) || Math.floor(Date.now() / 1000),
      isTest: c.provider === "SIMULATOR",
    })),
    policy: {
      claimTtlMs: 30000,
    },
  };
}

export function ackTransaction(transactionId: string): boolean {
  const found = queue.find((q) => q.id === transactionId);
  if (found) {
    found.status = "CLAIMED";
    return true;
  }
  return true;
}

export function nackTransaction(transactionId: string): boolean {
  const found = queue.find((q) => q.id === transactionId);
  if (found) {
    found.status = "PENDING";
    return true;
  }
  return false;
}

export function getQueueSummary() {
  const total = queue.length;
  const pending = queue.filter((i) => i.status === "PENDING").length;
  const claimed = queue.filter((i) => i.status === "CLAIMED").length;
  return { total, pending, claimed, items: queue.slice(-20) };
}
