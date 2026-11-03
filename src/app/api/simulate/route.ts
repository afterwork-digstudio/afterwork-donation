import { NextRequest, NextResponse } from "next/server";
import { pushPendingDonation } from "@/lib/donationQueue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      provider = "SIMULATOR",
      donator = "SultanTester",
      robloxUsername = "RyanDev_Roblox",
      amount = 50000,
      cashReward = 50000,
      message = "Uji coba fake donation",
      universeId,
    } = body;

    const queued = pushPendingDonation({
      id: `sim_${Date.now()}`,
      provider: provider as "SIMULATOR",
      donator,
      robloxUsername,
      amount: Number(amount),
      cashReward: Number(cashReward),
      message,
      timestamp: new Date().toISOString(),
      universeId,
    });

    return NextResponse.json({
      success: true,
      message: "Fake donation queued successfully for in-game claim",
      item: queued,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to queue simulated donation" },
      { status: 400 }
    );
  }
}

