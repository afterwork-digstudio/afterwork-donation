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

export function getQueueSummary() {
  const total = queue.length;
  const pending = queue.filter((i) => i.status === "PENDING").length;
  const claimed = queue.filter((i) => i.status === "CLAIMED").length;
  return { total, pending, claimed, items: queue.slice(-20) };
}
