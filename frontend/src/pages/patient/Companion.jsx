import { MessageCircleHeart, SendHorizonal, Sparkles } from "lucide-react";
import { useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import { apiService } from "../../services/api";

const initialMessages = [
  { role: "assistant", text: "Hi there. I can help you reflect on memories, routines, and small check-ins for today." },
  { role: "user", text: "Tell me about my family lunch memories." },
  { role: "assistant", text: "I remember your Sunday family lunch with warm soup and laughter. Would you like a gentle reminder about who was there?" },
];

const suggestedPrompts = [
  "What should I do this morning?",
  "Remind me about my family memories.",
  "Help me feel calmer before lunch.",
];

export default function PatientCompanion() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextUserMessage = { role: "user", text: trimmed };
    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiService.postChat({ message: trimmed, patient_id: "patient-001" }).catch(() => ({
        data: {
          reply: "I can help with gentle routines and memory prompts. Try asking about a memory, reminder, or a calming activity.",
        },
      }));

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: response?.data?.reply || "I can help with gentle routines and memory prompts.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", text: "I’m here to help with a calm, supportive prompt. Would you like a memory reminder or a daily routine check-in?" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout title="AI companion" subtitle="A reassuring conversation for memory, routine, and calm support.">
      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
        <div className="mb-5 flex items-center gap-3 text-violet-700">
          <MessageCircleHeart size={22} />
          <h2 className="text-2xl font-black text-slate-800">Companion chat</h2>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setInput(prompt)}
              className="rounded-full border border-violet-100 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="space-y-3 rounded-[24px] border border-slate-200 bg-[#fffdf7] p-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "bg-violet-600 text-white"
                    : "bg-white text-slate-700 ring-1 ring-slate-200"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm text-slate-500 ring-1 ring-slate-200">
              <Sparkles size={16} className="animate-pulse" />
              Thinking…
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex gap-3">
          <input
            aria-label="Type your message"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSend();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-base text-slate-700 outline-none focus:border-violet-300"
          />
          <button
            type="button"
            onClick={handleSend}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 font-semibold text-white"
          >
            <SendHorizonal size={18} />
            Send
          </button>
        </div>
      </div>
    </PatientLayout>
  );
}
