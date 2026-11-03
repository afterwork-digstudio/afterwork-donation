import { NextRequest, NextResponse } from "next/server";
import { pushPendingDonation, extractRobloxUsername } from "@/lib/donationQueue";

export async function GET() {
  return NextResponse.json({
    status: "active",
    provider: "BagiBagi",
    message: "BagiBagi Webhook Endpoint is ready and listening for POST events.",
    documentation: "https://bagibagi.id",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[BagiBagi Webhook Received]:", body);

    const amount = Number(body.total || body.amount || 0);
    const donator = String(body.donor || body.donator || "Anonymous");
    const message = String(body.message || "");
    const robloxUsername = extractRobloxUsername(donator, message);
    const cashReward = amount > 0 ? amount : 10000;

    const queued = pushPendingDonation({
      id: String(body.transaction_id || `bb_${Date.now()}`),
      provider: "BAGIBAGI",
      donator,
      robloxUsername,
      amount,
      cashReward,
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      status: "success",
      message: "BagiBagi donation event processed and queued for Roblox",
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
