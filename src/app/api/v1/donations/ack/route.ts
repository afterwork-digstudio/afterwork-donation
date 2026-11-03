import { NextRequest, NextResponse } from "next/server";
import { ackTransaction } from "@/lib/donationQueue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const transactionId = String(body.transactionId || body.id || "");

    if (transactionId) {
      ackTransaction(transactionId);
    }

    return NextResponse.json({
      success: true,
      status: "ACKED",
      transactionId,
      timestamp: Math.floor(Date.now() / 1000),
    });
  } catch {
    return NextResponse.json({ error: "Failed to ACK transaction" }, { status: 400 });
  }
}
