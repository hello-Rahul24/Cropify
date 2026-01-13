"use client";

import { useState, useRef, useEffect } from "react";
import { Sprout, Send, Sparkles } from "lucide-react";

/* ================= TYPES ================= */

type ChatMessage = {
  type: "user" | "ai";
  content: string;
  isError?: boolean;
};

type ChatResponse = {
  reply?: string;
  error?: string;
  code?: "TIMEOUT" | "RATE_LIMIT" | string;
};

/* ================= COMPONENT ================= */

export default function ChatPage() {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (): Promise<void> => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");

    const newMessages: ChatMessage[] = [
      ...messages,
      { type: "user", content: userMessage },
    ];

    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: newMessages.slice(-6),
        }),
      });

      const data: ChatResponse = await response.json();

      if (!response.ok) {
        let errorMessage = "Something went wrong. Please try again.";

        if (data.code === "TIMEOUT") {
          errorMessage = "Request timeout. Please try again.";
        } else if (data.code === "RATE_LIMIT") {
          errorMessage =
            "Service is busy. Please wait a moment and try again.";
        } else if (data.error) {
          errorMessage = data.error;
        }

        setMessages((prev) => [
          ...prev,
          {
            type: "ai",
            content: errorMessage,
            isError: true,
          },
        ]);
        return;
      }

      const reply = data.reply ?? "No response received";

      setMessages((prev) => [
        ...prev,
        { type: "ai", content: reply },
      ]);
    } catch (error) {
      console.error("Frontend error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          content:
            "Network error. Please check your connection and try again.",
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[90vh] bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl mb-4">
                  <Sprout className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Welcome to AI Agronomist
                </h2>
                <p className="text-gray-600">
                  Ask me anything about crop diseases, pests, soil health, or
                  agricultural best practices.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.type === "user"
                      ? "justify-end"
                      : "justify-start"
                  } animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                      msg.type === "user"
                        ? "bg-green-700 text-white"
                        : msg.isError
                        ? "bg-red-50 border-2 border-red-200 text-red-800"
                        : "bg-white border-2 border-emerald-100 text-gray-800"
                    }`}
                  >
                    {msg.type === "ai" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles
                          className={`w-4 h-4 ${
                            msg.isError
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            msg.isError
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {msg.isError ? "Error" : "AI Expert"}
                        </span>
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-white border-2 border-emerald-100 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span className="text-gray-600">
                        Analyzing your question...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-100 backdrop-blur-sm border-t border-emerald-100 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-end">
            <textarea
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about crop diseases, pests, treatments..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none text-black placeholder-gray-800 max-h-32"
              style={{ minHeight: "48px" }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim() || loading}
              className="bg-black text-white font-semibold px-6 py-4 rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
