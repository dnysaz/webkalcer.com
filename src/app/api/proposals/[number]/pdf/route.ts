import React from "react";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import ProposalPDF from "./ProposalPDF";

export async function GET(_req: Request, { params }: { params: Promise<{ number: string }> }) {
  const { number } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("proposal_number", number)
    .single();

  if (!proposal) {
    return new NextResponse("Proposal not found", { status: 404 });
  }

  const { data: items } = await supabase
    .from("proposal_items")
    .select("*")
    .eq("proposal_id", proposal.id)
    .order("id", { ascending: true });

  const { data: seo } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("page", "home")
    .single();

  const fullProposal = { ...proposal, items: items ?? [] };

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfStream = await (renderToStream as any)(
      React.createElement(ProposalPDF, { proposal: fullProposal, seo }),
    );

    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.from(chunk as Uint8Array));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="proposal-${number}.pdf"`,
      },
    });
  } catch (e) {
    console.error("PDF render error:", e);
    return new NextResponse("Failed to generate PDF", { status: 500 });
  }
}
