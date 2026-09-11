export async function sendVerificationEmail({ email, code }) {
  if (process.env.RESEND_API_KEY && process.env.OFFER_EMAIL_FROM) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.OFFER_EMAIL_FROM,
        to: email,
        subject: "Your AMIGOS MALER verification code",
        html: `<p>Your AMIGOS MALER verification code is <strong>${code}</strong>.</p><p>This code expires in 15 minutes.</p>`
      })
    });

    if (!response.ok) {
      throw new Error("Verification e-mail could not be sent.");
    }

    return { delivered: true };
  }

  console.log(`[AMIGOS offer calculator] Verification code for ${email}: ${code}`);

  return {
    delivered: false,
    developmentCode: process.env.NODE_ENV === "production" ? undefined : code
  };
}
