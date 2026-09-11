import { NextResponse } from "next/server";
import { submitOfferRequest } from "@/lib/offerCalculator/store";
import { validateCustomerInfo } from "@/lib/offerCalculator/validation";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const sessionId = String(payload.sessionId || "");
  const validation = validateCustomerInfo(payload.customerInfo || {});

  if (!sessionId) {
    return NextResponse.json({ error: "Calculation session is required." }, { status: 400 });
  }

  if (!validation.valid) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const result = await submitOfferRequest({ sessionId, customerInfo: validation.values });

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    projectId: result.projectId,
    consultationId: result.consultationId
  });
}
