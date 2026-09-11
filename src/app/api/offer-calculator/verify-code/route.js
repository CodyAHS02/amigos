import { NextResponse } from "next/server";
import { verifySessionCode } from "@/lib/offerCalculator/store";
import { validateCodePayload } from "@/lib/offerCalculator/validation";

function formatChfRange(session) {
  const formatter = new Intl.NumberFormat("de-CH");
  return `CHF ${formatter.format(Math.round(session.minCents / 100))}.– – ${formatter.format(Math.round(session.maxCents / 100))}.–`;
}

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const sessionId = String(payload.sessionId || "");
  const validation = validateCodePayload(payload);

  if (!sessionId) {
    return NextResponse.json({ error: "Calculation session is required." }, { status: 400 });
  }

  if (!validation.valid) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const result = await verifySessionCode({ sessionId, code: validation.values.code });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    priceRange: formatChfRange(result.session),
    currency: result.session.currency
  });
}
