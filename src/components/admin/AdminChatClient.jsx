"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import InitialAvatar from "@/components/InitialAvatar";
import styles from "@/components/admin/Admin.module.css";

const POLL_INTERVAL_MS = 2500;

function formatTime(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export default function AdminChatClient({ initialConversations }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0]?.id || "");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [sending, setSending] = useState(false);
  const timelineRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId),
    [activeId, conversations]
  );

  async function loadConversations() {
    const response = await fetch("/api/admin/chat/conversations", { cache: "no-store" });
    const result = await response.json();

    if (response.ok) {
      setConversations(result.conversations);
      if (!activeId && result.conversations[0]) {
        setActiveId(result.conversations[0].id);
      }
    }
  }

  async function loadMessages(conversationId = activeId) {
    if (!conversationId) return;

    const response = await fetch(`/api/admin/chat/conversations/${conversationId}/messages`, { cache: "no-store" });
    const result = await response.json();

    if (response.ok) {
      setMessages(result.messages);
      setNotice("");
    }
  }

  useEffect(() => {
    loadConversations();
    const timer = window.setInterval(() => {
      loadConversations();
      loadMessages();
    }, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [activeId]);

  useEffect(() => {
    loadMessages(activeId);
  }, [activeId]);

  useEffect(() => {
    timelineRef.current?.scrollTo({ top: timelineRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleReply(event) {
    event.preventDefault();

    const message = draft.trim();

    if (!message || !activeId || sending) return;

    setSending(true);
    setDraft("");

    try {
      const response = await fetch(`/api/admin/chat/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const result = await response.json();

      if (!response.ok) {
        setNotice(result.error || "Reply could not be sent.");
        setDraft(message);
        return;
      }

      setMessages((currentMessages) => [...currentMessages, result.message]);
      await loadConversations();
    } catch {
      setNotice("Reply could not be sent right now.");
      setDraft(message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={styles.chatDesk}>
      <aside className={styles.chatList}>
        <div className={styles.chatListHeader}>
          <span>Live Inbox</span>
          <strong>{conversations.length}</strong>
        </div>

        {conversations.length === 0 ? (
          <p className={styles.emptyState}>No live conversations yet.</p>
        ) : (
          conversations.map((conversation) => (
            <button
              className={`${styles.chatListItem} ${conversation.id === activeId ? styles.chatListItemActive : ""}`}
              type="button"
              key={conversation.id}
              onClick={() => setActiveId(conversation.id)}
            >
              <div className={styles.chatListItemHeader}>
                <InitialAvatar className={styles.avatar} name={conversation.visitorName} />
                <div className={styles.chatListMeta}>
                  <span>
                    <strong>{conversation.visitorName}</strong>
                    <small>{formatTime(conversation.lastMessageAt)}</small>
                  </span>
                  <p>{conversation.preview}</p>
                </div>
              </div>
              {conversation.unreadCount > 0 && <em>{conversation.unreadCount}</em>}
            </button>
          ))
        )}
      </aside>

      <div className={styles.chatPanel}>
        {activeConversation ? (
          <>
            <header className={styles.chatPanelHeader}>
              <div className={styles.chatPanelTitle}>
                <InitialAvatar className={styles.avatar} name={activeConversation.visitorName} />
                <div>
                  <span>Conversation</span>
                  <h2>{activeConversation.visitorName}</h2>
                </div>
              </div>
              <strong>{activeConversation.status}</strong>
            </header>

            <div className={styles.chatTimeline} ref={timelineRef}>
              {messages.map((message) => (
                <article
                  className={`${styles.chatBubbleRow} ${
                    message.senderType === "ADMIN" ? styles.chatBubbleRowAdmin : ""
                  }`}
                  key={message.id}
                >
                  <div className={styles.chatBubble}>
                    <span>{message.senderType === "ADMIN" ? "Amigos" : "Visitor"}</span>
                    <p>{message.body}</p>
                    <small>{formatTime(message.createdAt)}</small>
                  </div>
                </article>
              ))}
            </div>

            {notice && <p className={styles.chatNotice}>{notice}</p>}

            <form className={styles.chatComposer} onSubmit={handleReply}>
              <textarea
                maxLength={1200}
                placeholder="Write a live reply..."
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
              />
              <button className={styles.primaryButton} type="submit" disabled={sending}>
                Send Reply
              </button>
            </form>
          </>
        ) : (
          <div className={styles.chatEmptyPanel}>
            <span>LIVE CHAT</span>
            <h2>No active conversation selected.</h2>
            <p>When a visitor writes from the website chat widget, the thread will appear here.</p>
          </div>
        )}
      </div>

      <aside className={styles.chatSide}>
        <div className={styles.chatInfoPanel}>
          <span>Visitor Profile</span>
          {activeConversation ? (
            <>
              <InitialAvatar className={styles.avatar} name={activeConversation.visitorName} />
              <h3>{activeConversation.visitorName}</h3>
              <p>{activeConversation.visitorEmail || "No email captured yet"}</p>
              <ul>
                <li>
                  <span>Status</span>
                  <strong>{activeConversation.status}</strong>
                </li>
                <li>
                  <span>Unread</span>
                  <strong>{activeConversation.unreadCount}</strong>
                </li>
                <li>
                  <span>Last Active</span>
                  <strong>{formatTime(activeConversation.lastMessageAt)}</strong>
                </li>
              </ul>
            </>
          ) : (
            <p>Select a conversation to see live customer context.</p>
          )}
        </div>
      </aside>
    </section>
  );
}
