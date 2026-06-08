import midtransClient from "midtrans-client";
import crypto from "crypto";
import { createClient } from "@/lib/supabase/server";
import { decrypt } from "@/lib/encryption";

export async function getMidtransConfig() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("seo_settings")
    .select("midtrans_server_key_enc, midtrans_client_key_enc, midtrans_is_production")
    .eq("page", "home")
    .single();

  if (!data || !data.midtrans_server_key_enc || !data.midtrans_client_key_enc) {
    throw new Error("Midtrans not configured. Go to Settings > Midtrans.");
  }

  return {
    serverKey: decrypt(data.midtrans_server_key_enc),
    clientKey: decrypt(data.midtrans_client_key_enc),
    isProduction: data.midtrans_is_production ?? false,
  };
}

export async function getMidtransSnap() {
  const config = await getMidtransConfig();
  return new midtransClient.Snap({
    isProduction: config.isProduction,
    serverKey: config.serverKey,
    clientKey: config.clientKey,
  });
}

export async function getMidtransClientKey(): Promise<string> {
  const config = await getMidtransConfig();
  return config.clientKey;
}

export function verifyMidtransNotification(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string,
  serverKey: string,
): boolean {
  const hash = crypto
    .createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");
  return hash === signatureKey;
}
