"use client";

import { useEffect, useRef, useState } from "react";

const POLL_INTERVAL_MS = 2500;
const LIVE_CHAT_ENABLED = process.env.NEXT_PUBLIC_LIVE_CHAT_ENABLED === "true";
const CHATBOT_AVATAR = "/chatbot-main-face.jpeg";
const GREETING = {
  id: "local-greeting",
  senderType: "SYSTEM",
  body: "Hello, welcome to Amigos Maler. Send us a message and our team will reply here live.",
  createdAt: new Date().toISOString()
};

function messageClassName(message) {
  if (message.senderType === "VISITOR") return "chatbot-message user";

  return "chatbot-message bot";
}

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  async function loadMessages() {
    if (!LIVE_CHAT_ENABLED) return;

    try {
      const response = await fetch("/api/chat/messages", { cache: "no-store" });
      const result = await response.json();

      if (response.ok) {
        setMessages([GREETING, ...result.messages]);
        setError("");
      }
    } catch {
      setError("Live chat is reconnecting...");
    }
  }

  useEffect(() => {
    if (!LIVE_CHAT_ENABLED) return undefined;

    loadMessages();
    const timer = window.setInterval(loadMessages, POLL_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSubmit(event) {
    event.preventDefault();

    const message = draft.trim();

    if (!message || sending) return;

    if (!LIVE_CHAT_ENABLED) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `local-visitor-${Date.now()}`,
          senderType: "VISITOR",
          body: message,
          createdAt: new Date().toISOString()
        },
        {
          id: `local-offline-${Date.now()}`,
          senderType: "SYSTEM",
          body: "Live chat is temporarily closed. Please use WhatsApp or the enquiry form and we will get back to you.",
          createdAt: new Date().toISOString()
        }
      ]);
      setDraft("");
      return;
    }

    setSending(true);
    setError("");
    setDraft("");

    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to send your message.");
        setDraft(message);
        return;
      }

      setMessages((currentMessages) => [...currentMessages, result.message]);
      await loadMessages();
    } catch {
      setError("Unable to send right now. Please try again.");
      setDraft(message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`chatbot-widget ${open ? "open" : ""}`} id="chatbotWidget">
      <div className="chatbot-panel" id="chatbotPanel">
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <img src={CHATBOT_AVATAR} alt="Assistant" className="chatbot-header-avatar" />
            <div>
              <h4>Amigos Maler</h4>
              <span className="chatbot-status">
                <i className="chatbot-dot"></i> Live support
              </span>
            </div>
          </div>
          <button className="chatbot-close" type="button" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="chatbot-body" id="chatbotBody" ref={bodyRef}>
          {messages.map((message) => (
            <div className={messageClassName(message)} key={message.id}>
              {message.senderType !== "VISITOR" && (
                <img src={CHATBOT_AVATAR} alt="" className="chatbot-msg-avatar" />
              )}
              <div className="chatbot-bubble">{message.body}</div>
            </div>
          ))}
          {error && (
            <div className="chatbot-message bot">
              <img src={CHATBOT_AVATAR} alt="" className="chatbot-msg-avatar" />
              <div className="chatbot-bubble">{error}</div>
            </div>
          )}
        </div>

        <div className="chatbot-footer">
          <form className="chatbot-form" id="chatbotForm" onSubmit={handleSubmit}>
            <input
              type="text"
              id="chatbotInput"
              placeholder="Type a message..."
              autoComplete="off"
              maxLength={1200}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <button className="chatbot-send" type="submit" aria-label="Send message" disabled={sending}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <button
        className="chatbot-toggle"
        type="button"
        id="chatbotToggle"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <img src={CHATBOT_AVATAR} alt="Chat with us" className="chatbot-toggle-img" />
        <span className="chatbot-badge" title="Chat with us">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" />
          </svg>
        </span>
        <span className="chatbot-toggle-close-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
    </div>
  );
}
