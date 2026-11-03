import { NextRequest, NextResponse } from "next/server";

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
