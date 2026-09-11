import AdminChatClient from "@/components/admin/AdminChatClient";
import AdminShell from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getAdminChatConversations } from "@/lib/chatStore";

export const runtime = "nodejs";

export default async function AdminChatPage() {
  const admin = await getCurrentAdmin();
  const conversations = await getAdminChatConversations();

  return (
    <AdminShell activePath="/admin/chat" admin={admin} eyebrow="Live Support" title="Chat">
      <AdminChatClient initialConversations={conversations} />
    </AdminShell>
  );
}
