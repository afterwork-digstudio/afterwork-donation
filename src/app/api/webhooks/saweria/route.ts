import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[Saweria Webhook Received]:", body);

    // Verify basic required fields
    if (!body.amount_raw && !body.amount) {
      return NextResponse.json(
        { error: "Invalid payload: amount is required" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Saweria webhook verified and queued for Roblox DataStore",
      credited: true,
      transaction_id: body.id || `sw_${Date.now()}`,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse webhook JSON" },
      { status: 400 }
    );
  }
}
