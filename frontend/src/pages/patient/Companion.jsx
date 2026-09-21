import { MessageCircleHeart, Mic, SendHorizonal, Sparkles, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import { useLanguage } from "../../context/LanguageContext";
import { apiService } from "../../services/api";

const initialMessages = [
  { role: "assistant", text: "Hi there. I can help you reflect on memories, routines, and small check-ins for today." },
  { role: "user", text: "Tell me about my family lunch memories." },
  { role: "assistant", text: "I remember your Sunday family lunch with warm soup and laughter. Would you like a gentle reminder about who was there?" },
];

export default function PatientCompanion() {
  const { language, locale } = useLanguage();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const recognitionRef = useRef(null);
  const suggestedPrompts = language === "hi"
    ? ["आज मुझे क्या करना चाहिए?", "मुझे मेरी प्यारी यादें दिखाएं", "आइए शांत गतिविधि करें", "देखभालकर्ता को कॉल करें"]
    : ["What should I do today?", "Show me a happy memory", "Let's do a calming activity", "Call my caregiver"];

  useEffect(() => () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
  }, []);

  const startListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage(language === "hi" ? "इस ब्राउज़र में आवाज़ इनपुट उपलब्ध नहीं है। आप टेक्स्ट का उपयोग जारी रख सकते हैं।" : "Voice input is not supported on this browser. You can continue using text.");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = locale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => { setListening(true); setVoiceMessage(""); };
    recognition.onresult = (event) => setInput(event.results[0][0].transcript);
    recognition.onerror = (event) => {
      setListening(false);
      setVoiceMessage(event.error === "not-allowed"
        ? (language === "hi" ? "माइक्रोफ़ोन की अनुमति नहीं मिली। आप टेक्स्ट का उपयोग कर सकते हैं।" : "Microphone permission was not granted. You can continue using text.")
        : (language === "hi" ? "आवाज़ सुनने में समस्या हुई। कृपया फिर प्रयास करें।" : "We could not hear that. Please try again."));
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const speakMessage = (text) => {
    if (!window.speechSynthesis) {
      setVoiceMessage(language === "hi" ? "इस ब्राउज़र में आवाज़ सुनाना उपलब्ध नहीं है।" : "Spoken responses are not supported on this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const nextUserMessage = { role: "user", text: trimmed };
    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await apiService.postChat({ message: trimmed, patient_id: "patient-001", language }).catch(() => ({
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

        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-500" role="status">
          <span className={`h-2.5 w-2.5 rounded-full ${listening ? "animate-pulse bg-rose-500" : speaking ? "bg-emerald-500" : loading ? "bg-amber-500" : "bg-slate-300"}`} />
          {listening ? (language === "hi" ? "सुन रहा है..." : "Listening...") : loading ? (language === "hi" ? "सोच रहा है..." : "Processing...") : speaking ? (language === "hi" ? "बोल रहा है..." : "Speaking...") : (language === "hi" ? "तैयार" : "Ready")}
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
                <div className="flex items-center gap-2">{message.text}{message.role === "assistant" ? <button type="button" onClick={() => speakMessage(message.text)} aria-label="Read response aloud" className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-[#087EA4]"><Volume2 size={15} /></button> : null}</div>
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

        {voiceMessage ? <p role="status" className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{voiceMessage}</p> : null}

        <div className="mt-5 flex flex-wrap gap-3">
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
          <button type="button" onClick={listening ? () => recognitionRef.current?.stop() : startListening} aria-label={listening ? "Stop listening" : "Start voice input"} className={`inline-flex items-center justify-center rounded-full px-4 py-3 font-semibold ${listening ? "animate-pulse bg-rose-500 text-white" : "border border-violet-200 bg-violet-50 text-violet-700"}`}>
            {listening ? <Square size={18} /> : <Mic size={18} />}
          </button>
          {speaking ? <button type="button" onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); }} aria-label="Stop speaking" className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"><Square size={18} /></button> : null}
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
