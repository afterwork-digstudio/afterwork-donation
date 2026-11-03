import { NextRequest, NextResponse } from "next/server";
import { claimDonationsForUsers, getQueueSummary } from "@/lib/donationQueue";

export async function GET() {
  const summary = getQueueSummary();
  return NextResponse.json({
    status: "active",
    message: "AW Donation Cash Roblox Claim API is live and operational.",
    queue: summary,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const universeId: string = body.universeId || "";

    // Support both batch usernames array and single username string
    let targets: string[] = [];
    if (Array.isArray(body.usernames)) {
      targets = body.usernames.filter((u: unknown): u is string => typeof u === "string" && u.trim().length > 0);
    } else if (typeof body.robloxUsername === "string" && body.robloxUsername.trim().length > 0) {
      targets = [body.robloxUsername.trim()];
    }

    if (targets.length === 0) {
      return NextResponse.json({
        success: true,
        donations: [],
        message: "No online players provided for claim check.",
      });
    }

    // Look up real pending donations from queue
    const claimedRewards = claimDonationsForUsers(targets, universeId);

    return NextResponse.json({
      success: true,
      universeId,
      checkedCount: targets.length,
      claimedCount: claimedRewards.length,
      donations: claimedRewards.map((d) => ({
        transactionId: d.id,
        donator: d.donator,
        robloxUsername: d.robloxUsername,
        amount: d.amount,
        cashReward: d.cashReward,
        message: d.message,
        timestamp: d.timestamp,
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid claim request payload" },
      { status: 400 }
    );
  }
}
