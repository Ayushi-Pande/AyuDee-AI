import { BellRing, Check, Clock3, X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISSED_KEY = "ayudee-dismissed-reminders";

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function toMinutes(value) {
  const match = String(value || "").match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return null;
  let hours = Number(match[1]);
  if (match[3]?.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (match[3]?.toUpperCase() === "AM" && hours === 12) hours = 0;
  return hours * 60 + Number(match[2]);
}

function currentReminder() {
  const today = new Date();
  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const dateKey = today.toISOString().slice(0, 10);
  const sources = [
    ...readJson("ayudee-daily-plan", []),
    ...readJson("ayudee-patient-reminders", []),
  ];
  const dismissed = readJson(DISMISSED_KEY, {});
  return sources.find((item) => item.status !== "completed" && toMinutes(item.time) === currentMinutes && (!item.date || item.date === dateKey) && dismissed[`${item.id}-${dateKey}`] !== true) || null;
}

export default function ReminderMonitor() {
  const [reminder, setReminder] = useState(null);
  const [snoozedUntil, setSnoozedUntil] = useState(0);

  useEffect(() => {
    const check = () => {
      if (Date.now() < snoozedUntil) return;
      const due = currentReminder();
      if (!due || reminder?.id === due.id) return;
      setReminder(due);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification("AyuDee reminder", { body: due.title || "It is time for your scheduled reminder." });
    };
    check();
    const timer = window.setInterval(check, 15000);
    return () => window.clearInterval(timer);
  }, [reminder, snoozedUntil]);

  if (!reminder) return null;
  const dismiss = () => {
    const dateKey = new Date().toISOString().slice(0, 10);
    const dismissed = readJson(DISMISSED_KEY, {});
    localStorage.setItem(DISMISSED_KEY, JSON.stringify({ ...dismissed, [`${reminder.id}-${dateKey}`]: true }));
    setReminder(null);
  };

  return <div className="fixed inset-x-4 bottom-24 z-50 mx-auto max-w-md rounded-[24px] border border-cyan-200 bg-white p-5 shadow-[0_20px_60px_rgba(4,31,51,0.22)]" role="dialog" aria-live="polite" aria-label="Reminder notification"><div className="flex items-start gap-3"><div className="rounded-2xl bg-cyan-50 p-3 text-[#087EA4]"><BellRing size={24} /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#087EA4]">Reminder</p><h2 className="mt-1 text-xl font-black text-[#062A45]">{reminder.title}</h2></div><button type="button" onClick={dismiss} aria-label="Dismiss reminder" className="rounded-full p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><p className="mt-2 text-sm text-slate-600">{reminder.description || reminder.notes || "It is time for your scheduled reminder."}</p><div className="mt-4 flex gap-2"><button type="button" onClick={dismiss} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white"><Check size={16} /> Done</button><button type="button" onClick={() => { setSnoozedUntil(Date.now() + 5 * 60 * 1000); setReminder(null); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700"><Clock3 size={16} /> Snooze 5 min</button></div></div></div></div>;
}
