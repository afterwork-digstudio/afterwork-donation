import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const requestedUniverse = url.searchParams.get("universeId") || "";

  return NextResponse.json({
    status: "ok",
    apiVersion: 1,
    version: 1,
    service: "AW Studio Donation Hub",
    workspace: {
      id: "aw_workspace_prod",
      name: "AW Studio Production",
      universeId: requestedUniverse,
      experienceId: requestedUniverse,
    },
    timestamp: Math.floor(Date.now() / 1000),
  });
}
