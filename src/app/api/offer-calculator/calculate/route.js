import { NextResponse } from "next/server";
import { createOrUpdateCalculation } from "@/lib/offerCalculator/store";
import { validateCalculatorProject } from "@/lib/offerCalculator/validation";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const validation = validateCalculatorProject(payload);

  if (!validation.valid) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const result = await createOrUpdateCalculation(validation.values);

  return NextResponse.json({
    sessionId: result.sessionId,
    status: result.status,
    currency: result.currency,
    lockedPrice: true,
    priceLabel: "CHF ••••.–"
  });
}
