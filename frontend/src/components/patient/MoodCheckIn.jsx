import { Check, HeartPulse, MessageCircleHeart, PhoneCall, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

const MOODS = [
  { id: "happy", emoji: "😊", en: "Happy", hi: "खुश", color: "bg-amber-50 text-amber-800 ring-amber-200" },
  { id: "good", emoji: "🙂", en: "Good", hi: "अच्छा", color: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  { id: "okay", emoji: "😐", en: "Okay", hi: "ठीक", color: "bg-slate-50 text-slate-800 ring-slate-200" },
  { id: "low", emoji: "😔", en: "Low", hi: "उदास", color: "bg-sky-50 text-sky-800 ring-sky-200" },
  { id: "anxious", emoji: "😟", en: "Anxious", hi: "चिंतित", color: "bg-rose-50 text-rose-800 ring-rose-200" },
];

const STORAGE_KEY = "ayudee-mood-history";

const responses = {
  happy: {
    en: "Wonderful! It’s lovely to hear that you’re feeling happy today. Would you like to save a happy memory or start an activity?",
    hi: "बहुत अच्छा! यह सुनकर खुशी हुई कि आज आप खुश महसूस कर रहे हैं। क्या आप कोई प्यारी याद सहेजना या गतिविधि शुरू करना चाहेंगे?",
  },
  good: {
    en: "Glad to hear you're doing well. A small activity or favorite memory could make your day even brighter.",
    hi: "यह सुनकर अच्छा लगा कि आप ठीक महसूस कर रहे हैं। कोई छोटी गतिविधि या पसंदीदा याद आपका दिन और बेहतर बना सकती है।",
  },
  okay: {
    en: "That’s completely okay. How about a gentle activity, a favorite memory, or talking with Ayu?",
    hi: "यह बिल्कुल ठीक है। कोई हल्की गतिविधि, पसंदीदा याद या आयु से बात करना कैसा रहेगा?",
  },
  low: {
    en: "I’m sorry today feels difficult. You could try a gentle activity, look through a comforting memory, or connect with someone you trust.",
    hi: "मुझे अफसोस है कि आज का दिन कठिन लग रहा है। आप कोई हल्की गतिविधि, सुकून देने वाली याद या किसी भरोसेमंद व्यक्ति से जुड़ने की कोशिश कर सकते हैं।",
  },
  anxious: {
    en: "Try slowing things down for a moment. A calm breathing activity, a familiar memory, or talking to someone you trust may help.",
    hi: "एक पल के लिए धीरे होने की कोशिश करें। शांत सांसों की गतिविधि, कोई परिचित याद या किसी भरोसेमंद व्यक्ति से बात करना मददगार हो सकता है।",
  },
};

function readHistory() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export default function MoodCheckIn({ compact = false }) {
  const { language } = useLanguage();
  const [history, setHistory] = useState(readHistory);
  const todayEntry = history.find((entry) => entry.date === new Date().toISOString().slice(0, 10));
  const [selected, setSelected] = useState(todayEntry?.mood || "");
  const recentHistory = useMemo(() => history.slice(-7), [history]);

  const saveMood = (mood) => {
    const now = new Date();
    const entry = {
      mood,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    const next = [
      ...history.filter((item) => item.date !== entry.date),
      entry,
    ].slice(-30);
    setSelected(mood);
    setHistory(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <section className={`rounded-[28px] border border-cyan-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)] ${compact ? "p-5" : "p-6"}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-cyan-50 p-3 text-[#087EA4]"><HeartPulse size={22} /></div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#087EA4]">{language === "hi" ? "दैनिक चेक-इन" : "Daily check-in"}</p>
          <h2 className="mt-1 text-2xl font-black text-[#062A45]">{language === "hi" ? "आज आप कैसा महसूस कर रहे हैं?" : "How are you feeling today?"}</h2>
          <p className="mt-1 text-sm text-slate-500">{language === "hi" ? "यह आपकी सहायता के लिए एक निजी दिनचर्या नोट है।" : "A private routine note to help you and your caregiver."}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {MOODS.map((mood) => {
          const label = language === "hi" ? mood.hi : mood.en;
          const active = selected === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => saveMood(mood.id)}
              aria-pressed={active}
              className={`relative flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-sm font-bold ring-1 transition hover:-translate-y-0.5 ${mood.color} ${active ? "ring-2 ring-[#087EA4]" : ""}`}
            >
              {active ? <Check size={15} className="absolute right-2 top-2" /> : null}
              <span className="text-3xl" aria-hidden="true">{mood.emoji}</span>
              {label}
            </button>
          );
        })}
      </div>

      {selected ? (
        <div className="mt-4 rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-[#062A45]">
          <div className="flex items-start gap-3"><span className="text-3xl">{MOODS.find((mood) => mood.id === selected)?.emoji}</span><div><p className="text-sm font-black uppercase tracking-[0.12em] text-[#087EA4]">{language === "hi" ? "आपके लिए एक संदेश" : "A note for you"}</p><p className="mt-1 text-sm leading-6">{responses[selected][language]}</p></div></div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/patient/companion" className="inline-flex items-center gap-2 rounded-xl bg-[#082F49] px-3 py-2 text-sm font-bold text-white"><MessageCircleHeart size={16} /> {language === "hi" ? "आयु से बात करें" : "Talk to Ayu"}</Link>
            <Link to="/patient/memories" className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-bold text-[#087EA4]"><HeartPulse size={16} /> {language === "hi" ? "प्यारी यादें देखें" : "View happy memories"}</Link>
            <Link to="/patient/games" className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-3 py-2 text-sm font-bold text-[#087EA4]"><Sparkles size={16} /> {language === "hi" ? "शांत गतिविधि" : "Calm activity"}</Link>
            {(selected === "low" || selected === "anxious") ? <Link to="/patient/help" className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-bold text-rose-700"><PhoneCall size={16} /> {language === "hi" ? "देखभालकर्ता को कॉल करें" : "Call caregiver"}</Link> : null}
          </div>
        </div>
      ) : null}

      {recentHistory.length > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{language === "hi" ? "हाल का इतिहास" : "Recent history"}</p>
          <div className="mt-3 flex items-end gap-2">
            {recentHistory.map((entry) => {
              const mood = MOODS.find((item) => item.id === entry.mood) || MOODS[2];
              return <div key={entry.date} className="flex min-w-0 flex-1 flex-col items-center gap-1" title={`${entry.date} ${entry.time}`}><span className="text-xl">{mood.emoji}</span><div className="h-1.5 w-full rounded-full bg-cyan-100" /><span className="w-full truncate text-center text-[10px] text-slate-400">{entry.date.slice(5)}</span></div>;
            })}
          </div>
        </div>
      ) : null}
    </section>
  );
}
