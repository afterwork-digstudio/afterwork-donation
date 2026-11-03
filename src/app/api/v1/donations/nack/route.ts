import { NextRequest, NextResponse } from "next/server";
import { nackTransaction } from "@/lib/donationQueue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const transactionId = String(body.transactionId || body.id || "");
    const reason = String(body.reason || "Unknown reason");

    if (transactionId) {
      nackTransaction(transactionId);
    }

    return NextResponse.json({
      success: true,
      status: "NACKED",
      transactionId,
      reason,
      timestamp: Math.floor(Date.now() / 1000),
    });
  } catch {
    return NextResponse.json({ error: "Failed to NACK transaction" }, { status: 400 });
  }
}
