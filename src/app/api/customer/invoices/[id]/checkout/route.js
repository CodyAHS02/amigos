import { NextResponse } from "next/server";
import { getCustomerInvoiceForPayment } from "@/lib/customerStore";
import { createStripeCheckoutSession } from "@/lib/integrations";
import { SESSION_COOKIE, verifyCustomerSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  const session = await verifyCustomerSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const invoice = await getCustomerInvoiceForPayment({
    email: session.email,
    invoiceNo: id
  });

  if (!invoice) {
    return NextResponse.json({ error: "Invoice is not payable." }, { status: 404 });
  }

  const checkout = await createStripeCheckoutSession(invoice);

  if (checkout.error) {
    return NextResponse.json({ error: checkout.error }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: checkout.url });
}
