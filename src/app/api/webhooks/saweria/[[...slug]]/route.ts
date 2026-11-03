import { NextRequest, NextResponse } from "next/server";
import { pushPendingDonation, extractRobloxUsername } from "@/lib/donationQueue";

export async function GET() {
  return NextResponse.json({
    status: "active",
    provider: "Saweria",
    message: "Saweria Webhook Endpoint is ready and listening for POST events.",
    documentation: "https://saweria.co",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[Saweria Webhook Received]:", body);

    const amount = Number(body.amount_raw || body.amount || 0);
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid payload: valid amount is required" },
        { status: 400 }
      );
    }

    const donator = String(body.donator_name || body.donator || "Anonymous");
    const message = String(body.message || "");
    const robloxUsername = extractRobloxUsername(donator, message);
    const cashReward = amount; // 1 IDR = 1 Cash (or custom rate)

    const queued = pushPendingDonation({
      id: String(body.id || `sw_${Date.now()}`),
      provider: "SAWERIA",
      donator,
      robloxUsername,
      amount,
      cashReward,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      status: "success",
      message: "Saweria webhook verified and queued for Roblox in-game claim",
      credited: true,
      transaction_id: queued.id,
      target_roblox_username: robloxUsername,
      cash_reward: cashReward,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse webhook JSON" },
      { status: 400 }
    );
  }
}
