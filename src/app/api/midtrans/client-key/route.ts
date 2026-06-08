import { NextResponse } from "next/server";
import { getMidtransConfig } from "@/lib/midtrans";

export async function GET() {
  try {
    const config = await getMidtransConfig();
    return NextResponse.json({
      clientKey: config.clientKey,
      isProduction: config.isProduction,
    });
  } catch {
    return NextResponse.json({ clientKey: "", isProduction: false });
  }
}
