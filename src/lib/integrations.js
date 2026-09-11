export async function createStripeCheckoutSession(invoice) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: "Stripe is not configured." };
  }

  const params = new URLSearchParams({
    mode: "payment",
    success_url: process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/customer/invoices?payment=success",
    cancel_url: process.env.STRIPE_CANCEL_URL || "http://localhost:3000/customer/invoices?payment=cancelled",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": invoice.currency.toLowerCase(),
    "line_items[0][price_data][unit_amount]": String(invoice.amountCents),
    "line_items[0][price_data][product_data][name]": invoice.service
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });
  const data = await response.json();

  if (!response.ok) {
    return { error: data.error?.message || "Unable to create Stripe checkout session." };
  }

  return { url: data.url };
}

export async function sendWhatsAppAppointmentMessage({ phone, customerName, scheduledText }) {
  if (!phone) return { skipped: true, reason: "No phone number available." };

  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return { skipped: true, reason: "WhatsApp is not configured." };
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: process.env.WHATSAPP_TEMPLATE_NAME || "appointment_scheduled",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: customerName },
              { type: "text", text: scheduledText }
            ]
          }
        ]
      }
    })
  });
  const data = await response.json();

  if (!response.ok) {
    return { error: data.error?.message || "Unable to send WhatsApp message." };
  }

  return { ok: true, data };
}
