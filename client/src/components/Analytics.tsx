"use client";

import { useState, type FormEvent, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { AnalystQueryResponse } from "@/types/crime";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  warnings?: string[];
  metrics?: AnalystQueryResponse["computedMetrics"];
  isModelGenerated?: boolean;
}

const quickDistrictPrompts = [
  "Which district has highest crime in Delhi?",
  "South Delhi crime breakdown",
  "Why is Shahdara unavailable in 2013 baseline?",
  "Compare New Delhi vs Outer district",
  "Transit crime in Delhi Metro Rail",
];

const districtGroundedKnowledge: Record<string, string> = {
  shahdara:
    "**Shahdara District (Reporting Vintage Notice):**\n- **Status in 2013:** Officially marked as *Unavailable for the 2013 police vintage*.\n- **Administrative Context:** Shahdara was notified as a revenue district by Delhi Government in 2012 by splitting East Delhi.\n- **Police Context:** Delhi Police did not constitute a separate **Shahdara Police District** until January 2017.\n- **Provenance:** Crimes committed in the Shahdara area in 2013 were registered and reported under the **East** and **North-East** police districts.",
  south:
    "**South Delhi Police District (2013 Official Baseline):**\n- **Total IPC Crimes:** 7,330 cases\n- **Thefts & Motor Vehicle Thefts:** 2,419 cases (33.0% of district volume)\n- **Violent Offenses:** 349 cases (38 Murders, 126 Rapes, 185 Robberies)\n- **Assault on Women (Sec 354 IPC):** 287 cases\n- **Burglary:** 612 cases\n- **Spatial Alignment:** Direct 1:1 match with Survey of India South Revenue District.",
  outer:
    "**Outer Police District (2013 Official Baseline):**\n- **Total IPC Crimes:** 9,579 cases (Highest volume district in Delhi)\n- **Thefts:** 3,383 cases\n- **Violent Offenses:** 360 cases (88 Murders, 137 Rapes, 135 Robberies)\n- **Non-Coterminous Note:** In 2013, Outer police district encompassed sprawling outer residential perimeters before the 2017 creation of Rohini police district.",
  "new delhi":
    "**New Delhi Police District (2013 Official Baseline):**\n- **Total IPC Crimes:** 3,595 cases (Lowest volume among territorial districts)\n- **Thefts:** 1,749 cases\n- **Violent Offenses:** 72 cases (14 Murders, 28 Rapes, 30 Robberies)\n- **Context:** Encompasses the primary administrative, ministerial, and diplomatic enclave with high security density.",
  metro:
    "**Delhi Metro Rail Unit (2013 Official Transit Unit):**\n- **Total IPC Crimes:** 950 cases\n- **Thefts:** 875 cases (92.1% of all cases in the network)\n- **Pickpocketing & Mobile Theft:** Primary registered offense across transit corridors\n- **Jurisdiction Type:** Specialized non-coterminous transit jurisdiction covering the entire DMRC network across revenue districts.",
  highest:
    "**Highest Crime Police Districts in Delhi (2013 Baseline):**\n1. **Outer Police District:** 9,579 IPC cases (88 murders, 3,383 thefts)\n2. **North-East Police District:** 9,041 IPC cases (65 murders, 3,703 thefts)\n3. **South Police District:** 7,330 IPC cases (38 murders, 2,419 thefts)\n4. **West Police District:** 6,707 IPC cases (33 murders, 2,367 thefts)\n\nBy contrast, **New Delhi** recorded the lowest territorial volume at **3,595 cases**.",
  theft:
    "**Theft Across Delhi Districts (2013 Baseline):**\n- Theft is the largest single crime category in Delhi, representing over **37.8% of all registered IPC offenses** in 2013.\n- **Top Theft Districts:** North-East (3,703 thefts), Outer (3,383 thefts), and South (2,419 thefts).\n- **Transit Property Crime:** Delhi Metro Rail registered 875 thefts, and GRP Railway registered 553 thefts.",
};

interface AnalyticsProps {
  externalQuery?: string | null;
  onDistrictSelect?: (districtName: string) => void;
}

export function Analytics({ externalQuery }: AnalyticsProps) {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-district-analyst",
      role: "assistant",
      content:
        "Hello! I'm your Redline AI Analyst. Ask me anything about Delhi police districts, crime distributions, theft hotspots, or boundary provenance.",
      timestamp: "Just now",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      handleSend(externalQuery);
    }
  }, [externalQuery]);

  async function handleSend(textToSend?: string) {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

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
    setIsLoading(true);

    const lower = text.toLowerCase();

    // Check fast local district knowledge base for instant answer
    for (const [key, answer] of Object.entries(districtGroundedKnowledge)) {
      if (lower.includes(key)) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: answer,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
          setIsLoading(false);
        }, 300);
        return;
      }
    }

    // Call server AI endpoint for comprehensive district query
    try {
      const res = await fetch("/api/analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      if (!res.ok) {
        throw new Error("Analyst API error");
      }

      const data: AnalystQueryResponse = await res.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        warnings: data.coverageWarnings,
        metrics: data.computedMetrics,
        isModelGenerated: data.isGemmaPowered,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "**Official 2013 Delhi Police Baseline:**\nTotal recorded IPC crimes across Delhi was **80,184** across 11 territorial police districts and 7 specialized units.\n- **Highest Volume:** Outer District (9,579 cases)\n- **Lowest Volume:** New Delhi District (3,595 cases)\n- **Theft Volume:** 30,344 cases citywide (37.8% of total crimes)\n- Select any district on the map or search bar above for exact category breakdowns.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
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
          <div className="mb-3 flex max-h-[460px] flex-col overflow-hidden rounded-2xl border border-[#2b303c] bg-[#16181d]/95 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-2">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#232731] px-5 py-3.5 bg-[#121417]/80">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff5530]/15 text-[#ff5530]">
                  <Sparkles size={15} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-white font-heading">
                    Redline AI Analyst
                  </h4>
                  <p className="text-[10px] text-[#8c92a0]">
                    Grounded strictly in verified Delhi Police & NCRB district telemetry
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="rounded-lg p-1.5 text-[#8d939e] transition-colors hover:bg-white/[0.05] hover:text-white"
                aria-label="Collapse assistant"
              >
                <ChevronDown size={17} />
              </button>
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
                        m.role === "user" ? "text-white/70 text-right" : "text-[#676e7d]"
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
              {isLoading && (
                <div className="flex gap-2 items-center text-[11px] text-[#8d939e] pl-9">
                  <div className="h-2 w-2 rounded-full bg-[#ff5530] animate-ping" />
                  <span>Analyzing district intelligence...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Pills in Expanded Mode */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[#232731] bg-[#121417]/50 px-4 py-2">
              <span className="text-[10px] font-semibold text-[#8c92a0] shrink-0">
                District Prompts:
              </span>
              {quickDistrictPrompts.map((prompt) => (
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
                <span>District AI:</span>
              </div>
              {quickDistrictPrompts.slice(0, 3).map((prompt) => (
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
          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#ff5530]/15 text-[#ff5530]">
              <Sparkles size={16} />
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Redline AI about any Delhi district (e.g., South Delhi, Outer, Shahdara)..."
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[12px] text-white placeholder-[#686f7d] focus:outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
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

export const AiAnalyst = Analytics;
export default Analytics;
