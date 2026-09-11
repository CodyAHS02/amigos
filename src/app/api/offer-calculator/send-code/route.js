import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/offerCalculator/email";
import { attachVerificationCode, createVerificationCode } from "@/lib/offerCalculator/store";
import { validateEmailPayload } from "@/lib/offerCalculator/validation";

export async function POST(request) {
  const payload = await request.json().catch(() => ({}));
  const sessionId = String(payload.sessionId || "");
  const validation = validateEmailPayload(payload);

  if (!sessionId) {
    return NextResponse.json({ error: "Calculation session is required." }, { status: 400 });
  }

  if (!validation.valid) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const code = createVerificationCode();
  const session = await attachVerificationCode({ sessionId, email: validation.values.email, code });

  if (!session) {
    return NextResponse.json({ error: "Calculation session not found." }, { status: 404 });
  }

  const delivery = await sendVerificationEmail({ email: validation.values.email, code });

  return NextResponse.json({
    ok: true,
    delivered: delivery.delivered,
    developmentCode: delivery.developmentCode
  });
}
