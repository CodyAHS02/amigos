import crypto from "node:crypto";
import { sql } from "@/lib/db";

export const CHAT_VISITOR_COOKIE = "amigos_chat_visitor";

const MAX_MESSAGE_LENGTH = 1200;
const VISITOR_RATE_LIMIT = 18;

function hashVisitorToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createVisitorToken() {
  return crypto.randomBytes(32).toString("hex");
}

function normalizeMessage(body) {
  return String(body || "").replace(/\s+/g, " ").trim();
}

function serializeMessage(message) {
  return {
    id: message.id,
    senderType: message.senderType,
    senderName: message.senderName,
    body: message.body,
    createdAt: message.createdAt
  };
}

function serializeConversation(conversation) {
  return {
    id: conversation.id,
    visitorName: conversation.visitorName || "Website visitor",
    visitorEmail: conversation.visitorEmail,
    status: conversation.status,
    lastMessageAt: conversation.lastMessageAt,
    preview: conversation.preview || "No messages yet",
    unreadCount: Number(conversation.unreadCount || 0)
  };
}

export function createChatVisitorToken() {
  return createVisitorToken();
}

export async function getOrCreateVisitorConversation(visitorToken) {
  const token = visitorToken || createVisitorToken();
  const visitorTokenHash = hashVisitorToken(token);

  const [conversation] = await sql`
    insert into chat_conversations (id, visitor_token_hash)
    values (${crypto.randomUUID()}, ${visitorTokenHash})
    on conflict (visitor_token_hash) do update set updated_at = now()
    returning id, status, created_at as "createdAt"
  `;

  return { conversation, visitorToken: token };
}

export async function getVisitorMessages(visitorToken) {
  if (!visitorToken) return { conversation: null, messages: [] };

  const visitorTokenHash = hashVisitorToken(visitorToken);
  const [conversation] = await sql`
    select id, status
    from chat_conversations
    where visitor_token_hash = ${visitorTokenHash}
  `;

  if (!conversation) return { conversation: null, messages: [] };

  const messages = await sql`
    update chat_messages
    set read_by_visitor_at = coalesce(read_by_visitor_at, now())
    where conversation_id = ${conversation.id}
      and sender_type = 'ADMIN'
    returning id
  `;
  void messages;

  const rows = await sql`
    select id, sender_type as "senderType", sender_name as "senderName", body, created_at as "createdAt"
    from chat_messages
    where conversation_id = ${conversation.id}
    order by created_at asc
  `;

  return { conversation, messages: rows.map(serializeMessage) };
}

export async function addVisitorMessage(visitorToken, body) {
  const messageBody = normalizeMessage(body);

  if (!messageBody) return { error: "Please type a message." };
  if (messageBody.length > MAX_MESSAGE_LENGTH) return { error: `Message must be under ${MAX_MESSAGE_LENGTH} characters.` };

  const { conversation, visitorToken: activeVisitorToken } = await getOrCreateVisitorConversation(visitorToken);
  const [{ recentCount }] = await sql`
    select count(*)::int as "recentCount"
    from chat_messages
    where conversation_id = ${conversation.id}
      and sender_type = 'VISITOR'
      and created_at > now() - interval '1 minute'
  `;

  if (recentCount >= VISITOR_RATE_LIMIT) {
    return { error: "Please wait a moment before sending more messages." };
  }

  const [message] = await sql.begin(async (transaction) => {
    const [createdMessage] = await transaction`
      insert into chat_messages (id, conversation_id, sender_type, sender_name, body)
      values (${crypto.randomUUID()}, ${conversation.id}, 'VISITOR', 'Website visitor', ${messageBody})
      returning id, sender_type as "senderType", sender_name as "senderName", body, created_at as "createdAt"
    `;

    await transaction`
      update chat_conversations
      set status = 'OPEN', last_message_at = now(), updated_at = now()
      where id = ${conversation.id}
    `;

    return [createdMessage];
  });

  return {
    conversation,
    message: serializeMessage(message),
    visitorToken: activeVisitorToken
  };
}

export async function getAdminChatConversations() {
  const conversations = await sql`
    select chat_conversations.id,
      chat_conversations.visitor_name as "visitorName",
      chat_conversations.visitor_email as "visitorEmail",
      chat_conversations.status,
      chat_conversations.last_message_at as "lastMessageAt",
      coalesce(latest_message.body, '') as preview,
      count(unread.id)::int as "unreadCount"
    from chat_conversations
    left join lateral (
      select body
      from chat_messages
      where chat_messages.conversation_id = chat_conversations.id
      order by created_at desc
      limit 1
    ) latest_message on true
    left join chat_messages unread on unread.conversation_id = chat_conversations.id
      and unread.sender_type = 'VISITOR'
      and unread.read_by_admin_at is null
    group by chat_conversations.id, latest_message.body
    order by chat_conversations.last_message_at desc
  `;

  return conversations.map(serializeConversation);
}

export async function getAdminChatMessages(conversationId) {
  await sql`
    update chat_messages
    set read_by_admin_at = coalesce(read_by_admin_at, now())
    where conversation_id = ${conversationId}
      and sender_type = 'VISITOR'
  `;

  const messages = await sql`
    select id, sender_type as "senderType", sender_name as "senderName", body, created_at as "createdAt"
    from chat_messages
    where conversation_id = ${conversationId}
    order by created_at asc
  `;

  return messages.map(serializeMessage);
}

export async function addAdminChatMessage({ conversationId, adminName, body }) {
  const messageBody = normalizeMessage(body);

  if (!messageBody) return { error: "Please type a reply." };
  if (messageBody.length > MAX_MESSAGE_LENGTH) return { error: `Reply must be under ${MAX_MESSAGE_LENGTH} characters.` };

  const [conversation] = await sql`
    select id
    from chat_conversations
    where id = ${conversationId}
  `;

  if (!conversation) return { error: "Conversation not found." };

  const [message] = await sql.begin(async (transaction) => {
    const [createdMessage] = await transaction`
      insert into chat_messages (id, conversation_id, sender_type, sender_name, body)
      values (${crypto.randomUUID()}, ${conversationId}, 'ADMIN', ${adminName || "Amigos Admin"}, ${messageBody})
      returning id, sender_type as "senderType", sender_name as "senderName", body, created_at as "createdAt"
    `;

    await transaction`
      update chat_conversations
      set status = 'OPEN', last_message_at = now(), updated_at = now()
      where id = ${conversationId}
    `;

    return [createdMessage];
  });

  return { message: serializeMessage(message) };
}
