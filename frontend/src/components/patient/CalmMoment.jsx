import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSettings } from "../../context/AppSettingsContext";
import { useLanguage } from "../../context/LanguageContext";

const phases = [
  { en: "Breathe in", hi: "सांस अंदर लें", seconds: 4 },
  { en: "Hold", hi: "रोकें", seconds: 2 },
  { en: "Breathe out", hi: "सांस बाहर छोड़ें", seconds: 6 },
];

export default function CalmMoment() {
  const { language } = useLanguage();
  const { reducedMotion } = useAppSettings();
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(phases[0].seconds);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) setRunning(false);
        return Math.max(0, value - 1);
      });
      setPhaseSeconds((value) => {
        if (value > 1) return value - 1;
        setPhaseIndex((index) => (index + 1) % phases.length);
        return phases[(phaseIndex + 1) % phases.length].seconds;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, phaseIndex]);

  const restart = () => { setRunning(false); setSecondsLeft(60); setPhaseIndex(0); setPhaseSeconds(phases[0].seconds); };
  const phase = phases[phaseIndex];

  return <section className="rounded-[28px] border border-teal-100 bg-[#f2fffc] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">{language === "hi" ? "शांत पल" : "Calm Moment"}</p><h2 className="mt-1 text-2xl font-black text-[#062A45]">{language === "hi" ? "एक मिनट अपने लिए" : "One quiet minute"}</h2><p className="mt-1 text-sm text-slate-500">{language === "hi" ? "यह एक वैकल्पिक विश्राम गतिविधि है।" : "An optional breathing activity for a gentle reset."}</p></div><span className="text-2xl font-black text-teal-700">{secondsLeft}s</span></div><div className="mt-5 flex flex-col items-center gap-4"><div className={`flex h-36 w-36 items-center justify-center rounded-full bg-teal-200 text-center text-lg font-black text-teal-900 shadow-inner ${running && !reducedMotion ? "animate-pulse" : ""}`}><span>{language === "hi" ? phase.hi : phase.en}<br /><small className="text-sm font-semibold">{phaseSeconds}s</small></span></div><div className="flex flex-wrap justify-center gap-2"><button type="button" onClick={() => setRunning((value) => !value)} className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 font-bold text-white">{running ? <Pause size={17} /> : <Play size={17} />}{running ? (language === "hi" ? "रोकें" : "Pause") : (language === "hi" ? "शुरू करें" : "Start")}</button><button type="button" onClick={restart} className="inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-white px-4 py-2.5 font-bold text-teal-800"><RotateCcw size={17} /> {language === "hi" ? "फिर शुरू करें" : "Restart"}</button></div></div></section>;
}
