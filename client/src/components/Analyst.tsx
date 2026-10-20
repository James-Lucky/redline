
"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Bot,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const suggestions = [
  "Which categories changed the most?",
  "Explain the historical trend",
  "What are the data limitations?",
];

type Message = {
  role: "user" | "assistant";
  text: string;
};

export function Analyst() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = input.trim();
    if (!value) return;

    setMessages((items) => [
      ...items,
      { role: "user", text: value },
      {
        role: "assistant",
        text: "Gemma is not connected yet. This panel will answer using verified crime statistics once the backend is integrated.",
      },
    ]);

    setInput("");
  }

  return (
    <article className="rounded-xl border border-white/[0.075] bg-[#171b19] p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#70c6b1]/10 text-[#83d7c0]">
          <Sparkles size={19} />
        </span>

        <div>
          <h2 className="text-sm font-semibold text-white/85">
            AI data analyst
          </h2>
          <p className="mt-1 text-[10px] text-white/35">
            Explore questions with evidence
          </p>
        </div>

        <span className="ml-auto rounded bg-amber-200/[0.08] px-2 py-1 text-[9px] font-semibold text-amber-200/75">
          Preview
        </span>
      </div>

      <div className="mt-5 rounded-lg border border-[#70c6b1]/10 bg-[#70c6b1]/[0.045] p-4">
        <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.06] bg-[#171b19] text-[#83d7c0]">
          <Bot size={17} />
        </span>

        <h3 className="mt-3 text-sm font-semibold text-white/85">
          Understand the numbers.
        </h3>

        <p className="mt-2 text-[11px] leading-5 text-white/45">
          Ask about reporting periods, comparisons and source limitations.
          Answers must be grounded in verified data.
        </p>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-[9px] font-bold tracking-[0.15em] text-white/30">
          SUGGESTED QUESTIONS
        </p>

        <div className="grid gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-3 text-left text-[10px] text-white/55 transition hover:border-[#70c6b1]/30 hover:bg-white/[0.025] hover:text-white/80"
            >
              <span className="flex-1">{suggestion}</span>
              <ArrowUpRight size={13} />
            </button>
          ))}
        </div>
      </div>

      {messages.length > 0 && (
        <div aria-live="polite" className="mt-4 grid gap-2">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`rounded-lg p-3 text-[10px] leading-5 ${
                message.role === "user"
                  ? "ml-5 bg-[#70c6b1]/10 text-[#bce8dc]"
                  : "bg-white/[0.035] text-white/55"
              }`}
            >
              {message.role === "assistant" && (
                <Sparkles
                  size={13}
                  className="mb-1 inline text-[#83d7c0]"
                />
              )}
              <p>{message.text}</p>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={submit}
        className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 bg-[#111513] p-1.5 focus-within:border-[#70c6b1]/40"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          aria-label="Ask the AI analyst"
          placeholder="Ask about crime statistics..."
          className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[11px] text-white outline-none placeholder:text-white/25"
        />

        <button
          type="submit"
          aria-label="Send question"
          disabled={!input.trim()}
          className="grid h-8 w-8 place-items-center rounded-md bg-[#70c6b1] text-[#10201c] transition hover:bg-[#93deca] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={15} />
        </button>
      </form>

      <p className="mt-3 flex items-center gap-1.5 text-[9px] text-white/30">
        <ShieldCheck size={13} />
        No live AI connection · API key must remain server-side
      </p>
    </article>
  );
}
