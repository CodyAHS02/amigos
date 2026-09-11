const SESSION_COOKIE = "amigos_customer_session";
const ADMIN_SESSION_COOKIE = "amigos_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

function base64UrlEncode(value) {
  const bytes = value instanceof Uint8Array ? value : new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function signPayload(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));

  return base64UrlEncode(new Uint8Array(signature));
}

function getSessionSecret() {
  return process.env.CUSTOMER_PORTAL_SESSION_SECRET || "";
}

export { ADMIN_SESSION_COOKIE, SESSION_COOKIE, SESSION_DURATION_SECONDS };

export function hasSessionSecret() {
  return Boolean(getSessionSecret());
}

export async function createCustomerSession(email) {
  return createSignedSession({ email, role: "customer" });
}

export async function createAdminSession(email) {
  return createSignedSession({ email, role: "admin" });
}

async function createSignedSession(data) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("CUSTOMER_PORTAL_SESSION_SECRET is required.");
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      ...data,
      iat: now,
      exp: now + SESSION_DURATION_SECONDS
    })
  );
  const signature = await signPayload(payload, secret);

  return `${payload}.${signature}`;
}

export async function verifyCustomerSession(token) {
  const secret = getSessionSecret();

  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");

  if (!payload || !signature) return null;

  const expectedSignature = await signPayload(payload, secret);

  if (signature !== expectedSignature) return null;

  try {
    const session = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    const now = Math.floor(Date.now() / 1000);

    if (!session.exp || session.exp < now) return null;

    return session;
  } catch {
    return null;
  }
}

export async function verifyAdminSession(token) {
  const session = await verifyCustomerSession(token);

  if (session?.role !== "admin") return null;

  return session;
}
