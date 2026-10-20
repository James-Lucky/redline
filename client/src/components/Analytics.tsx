"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ChevronUp,
  ChevronDown,
  X,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const quickPrompts = [
  "Why did MagStand Pro 1 grow 32%?",
  "Analyze April peak vs Target",
  "Compare UK vs Indonesia sales",
  "Which time slot has highest orders?",
];

const mockKnowledgeBase: Record<string, string> = {
  magstand:
    "MagStand Pro 1 generated **$24,500** across 846 units with 32% MoM growth. The growth was primarily driven by high conversion rates (3.2%) and prominent traffic from the UK market (6.3K products).",
  april:
    "In April 2025, Total Sales reached **4,790 units**, exceeding the target of **3,830 units** by +25.1%. This was the strongest performing month in Q2.",
  uk:
    "The United Kingdom is your top global territory with **6.3K Products sold**, followed closely by Indonesia at **5.2K Products** and Malaysia at **4.7K Products**.",
  time:
    "Order density peaks significantly between **11:00 am and 1:00 pm**, especially on Thursdays and Fridays with over **2,000+ orders/hour** during the midday rush.",
};

export function Analytics() {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-1",
      role: "assistant",
      content:
        "Hello! I'm your Metric Flow AI Analyst. Ask me anything about your revenue, sales trends, top products, or regional performance.",
      timestamp: "Just now",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsExpanded(true);

    // Generate context-aware assistant response
    setTimeout(() => {
      let reply =
        "Based on your June 2024 data: Total Revenue is **$24,500** (+12.5%), Total Orders are **1,240** (+8.2%), and conversion rate remains healthy at **3.2%**. MagStand Pro 1 is your primary driver.";
      const lower = text.toLowerCase();
      if (lower.includes("magstand") || lower.includes("pro 1") || lower.includes("growth")) {
        reply = mockKnowledgeBase.magstand;
      } else if (lower.includes("april") || lower.includes("peak") || lower.includes("target")) {
        reply = mockKnowledgeBase.april;
      } else if (lower.includes("uk") || lower.includes("indonesia") || lower.includes("country") || lower.includes("region")) {
        reply = mockKnowledgeBase.uk;
      } else if (lower.includes("time") || lower.includes("slot") || lower.includes("order density") || lower.includes("hour")) {
        reply = mockKnowledgeBase.time;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSend();
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pointer-events-none md:left-[230px]">
      <div className="pointer-events-auto w-full max-w-[1200px] px-4 pb-4">
        {/* Expanded Chat Drawer */}
        {isExpanded && (
          <div className="mb-3 flex max-h-[460px] flex-col overflow-hidden rounded-2xl border border-[#2b303c] bg-[#16181d]/95 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#232731] px-5 py-3.5 bg-[#121417]/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff5530]/15 text-[#ff5530]">
                  <Sparkles size={15} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-white">
                    Metric Flow AI Assistant
                  </h4>
                  <p className="text-[10px] text-[#6d7482]">
                    Grounded in live sales and orders telemetry
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="rounded-lg p-1.5 text-[#8d939e] transition-colors hover:bg-white/[0.05] hover:text-white"
                  aria-label="Collapse assistant"
                >
                  <ChevronDown size={17} />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[200px] max-h-[320px]">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 text-[12px] leading-relaxed ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#ff5530]/15 text-[#ff5530] mt-0.5">
                      <Bot size={13} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 ${
                      m.role === "user"
                        ? "bg-[#ff5530] text-white rounded-br-none shadow-md shadow-[#ff5530]/20"
                        : "bg-[#1f222a] text-[#d6dae2] border border-[#282c37] rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                    <span
                      className={`block mt-1 text-[9px] ${
                        m.role === "user"
                          ? "text-white/70 text-right"
                          : "text-[#676e7d]"
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                  {m.role === "user" && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#2a2e38] text-white mt-0.5">
                      <User size={13} />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills in Expanded Mode */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[#232731] bg-[#121417]/50 px-4 py-2">
              <span className="text-[10px] font-semibold text-[#6d7482] shrink-0">
                Suggestions:
              </span>
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="shrink-0 rounded-lg border border-[#232731] bg-[#1a1c22] px-2.5 py-1 text-[10px] text-[#8d939e] transition hover:border-[#ff5530]/40 hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Floating Chat Input Bar */}
        <div className="flex flex-col gap-2 rounded-2xl border border-[#2a2e38] bg-[#16181d]/95 p-2 shadow-2xl backdrop-blur-xl transition-all focus-within:border-[#ff5530]/60">
          {/* Quick chips (visible when collapsed) */}
          {!isExpanded && (
            <div className="flex items-center gap-2 overflow-x-auto px-2 pt-1 pb-0.5 scrollbar-none">
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#ff5530] shrink-0">
                <Sparkles size={12} />
                <span>AI Insights:</span>
              </div>
              {quickPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="flex items-center gap-1 shrink-0 rounded-lg border border-[#232731] bg-[#1a1d24] px-2.5 py-0.5 text-[10px] text-[#8c92a0] transition hover:border-[#ff5530]/40 hover:text-white"
                >
                  <span>{prompt}</span>
                  <ArrowUpRight size={10} />
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="ml-auto flex items-center gap-1 text-[10px] font-medium text-[#737a89] hover:text-white shrink-0"
              >
                <span>History</span>
                <ChevronUp size={12} />
              </button>
            </div>
          )}

          {/* Form with Input and Action Button */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-1"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff5530]/15 text-[#ff5530]">
              <Sparkles size={16} />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Metric Flow AI about sales trends, products, or revenue..."
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[12px] text-white placeholder-[#686f7d] focus:outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff5530] text-white shadow-md shadow-[#ff5530]/25 transition hover:bg-[#ff6845] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send query"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Backwards compatibility alias
export const AiAnalyst = Analytics;
export default Analytics;
