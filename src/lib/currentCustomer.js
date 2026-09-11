import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCustomerPortalData } from "@/lib/customerStore";
import { SESSION_COOKIE, verifyCustomerSession } from "@/lib/session";

export async function getCurrentCustomerPortalData() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = await verifyCustomerSession(token);

  if (!session?.email) {
    redirect("/customer/login");
  }

  const portalData = await getCustomerPortalData(session.email);

  if (!portalData) {
    redirect("/customer/login");
  }

  return portalData;
}
