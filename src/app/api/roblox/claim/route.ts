import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { universeId, robloxUsername } = body;

    // Simulate looking up pending donations in DataStore queue
    const pendingRewards = [
      {
        transactionId: `tx_${Date.now().toString(36)}`,
        donator: "PlayerSultan_ID",
        amount: 25000,
        cashReward: 25000,
        message: "Semangat mainnya!",
        timestamp: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      universeId: universeId || "10765129159",
      username: robloxUsername,
      pendingCount: pendingRewards.length,
      donations: pendingRewards,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid claim request payload" },
      { status: 400 }
    );
  }
}
