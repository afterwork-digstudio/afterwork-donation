import { NextRequest, NextResponse } from "next/server";
import { claimBatch } from "@/lib/donationQueue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const limit = Number(body.limit || 10);
    const universeId = body.universeId ? String(body.universeId) : undefined;

    const claimResult = claimBatch(limit, universeId);

    return NextResponse.json(claimResult);
  } catch {
    return NextResponse.json(
      { error: "Failed to process claim lease" },
      { status: 500 }
    );
  }
}
