"use client";

import { useState } from "react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message) return;

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setReply(data.reply || "No response received");
    } catch (error) {
      setReply("Something went wrong while fetching response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>
        AI Agronomist Assistant
      </h1>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Ask questions about crop diseases, pests, and treatments.
      </p>

      <textarea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your question here..."
        style={{ width: "100%", marginTop: "1rem" }}
      />

      <button
        onClick={sendMessage}
        disabled={!message || loading}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {reply && (
        <div style={{ marginTop: "2rem" }}>
          <h3>AI Response</h3>
          <p style={{ whiteSpace: "pre-line" }}>{reply}</p>
        </div>
      )}
    </main>
  );
}
