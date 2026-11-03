import { NextRequest, NextResponse } from "next/server";
import { pushPendingDonation, extractRobloxUsername } from "@/lib/donationQueue";

export async function GET() {
  return new NextResponse("OK - SociaBuzz Webhook Endpoint Ready", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[SociaBuzz Webhook Received]:", body);

    const amount = Number(body.amount || 0);
    const donator = String(body.supporter_name || body.name || body.donator || "Anonymous");
    const message = String(body.message || body.comment || "");
    const robloxUsername = extractRobloxUsername(donator, message);
    const cashReward = amount > 0 ? amount : 10000;

    if (amount > 0) {
      pushPendingDonation({
        id: String(body.transaction_id || `sb_${Date.now()}`),
        provider: "SOCIABUZZ",
        donator,
        robloxUsername,
        amount,
        cashReward,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    // SociaBuzz expects plain text "OK" to acknowledge delivery
    return new NextResponse("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch {
    return new NextResponse("OK", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
