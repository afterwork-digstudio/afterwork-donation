import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[BagiBagi Webhook Received]:", body);

    return NextResponse.json({
      status: "success",
      message: "BagiBagi donation event processed successfully",
      transaction_id: body.transaction_id || `bb_${Date.now()}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse webhook JSON" },
      { status: 400 }
    );
  }
}
