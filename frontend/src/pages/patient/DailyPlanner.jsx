import { CalendarClock, CheckCircle2, Circle, PencilLine, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import { demoReminders } from "../../data/demoData";
import { useLanguage } from "../../context/LanguageContext";

const STORAGE_KEY = "ayudee-daily-plan";
const categories = ["medication", "meal", "exercise", "appointment", "memory", "social", "personal", "other"];
const categoryLabels = {
  en: { medication: "Medication", meal: "Meal", exercise: "Exercise", appointment: "Appointment", memory: "Memory", social: "Social", personal: "Personal", other: "Other" },
  hi: { medication: "दवा", meal: "भोजन", exercise: "व्यायाम", appointment: "अपॉइंटमेंट", memory: "याद", social: "सामाजिक", personal: "व्यक्तिगत", other: "अन्य" },
};

function readPlan() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (Array.isArray(stored)) return stored;
  } catch {
    return [];
  }
  return demoReminders.map((item) => ({ ...item, type: item.type === "activity" ? "exercise" : item.type, description: item.notes || "", date: "" }));
}

export default function DailyPlanner() {
  const { language } = useLanguage();
  const labels = categoryLabels[language];
  const [items, setItems] = useState(readPlan);
  const [editingId, setEditingId] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", time: "09:00", type: "personal", date: "" });
  const done = items.filter((item) => item.status === "completed").length;
  const progress = items.length ? Math.round((done / items.length) * 100) : 0;
  const date = new Date().toLocaleDateString(language === "hi" ? "hi-IN" : "en-IN", { weekday: "long", month: "long", day: "numeric" });
  const sorted = useMemo(() => [...items].sort((a, b) => toMinutes(a.time) - toMinutes(b.time)), [items]);

  const persist = (next) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };
  const openEditor = (item = null) => {
    setEditingId(item?.id || null);
    setForm(item ? { title: item.title || "", description: item.description || item.notes || "", time: normalizeTime(item.time), type: item.type || "personal", date: item.date || "" } : { title: "", description: "", time: "09:00", type: "personal", date: "" });
    setIsEditorOpen(true);
  };
  const saveActivity = (event) => {
    event.preventDefault();
    const payload = { ...form, id: editingId || Date.now(), status: editingId ? items.find((item) => item.id === editingId)?.status || "upcoming" : "upcoming" };
    persist(editingId ? items.map((item) => item.id === editingId ? { ...item, ...payload } : item) : [payload, ...items]);
    setIsEditorOpen(false);
  };
  const toggleComplete = (id) => persist(items.map((item) => item.id === id ? { ...item, status: item.status === "completed" ? "upcoming" : "completed" } : item));
  const deleteActivity = (id) => persist(items.filter((item) => item.id !== id));

  return (
    <PatientLayout title={language === "hi" ? "आज की योजना" : "Today's Journey"} subtitle={`${date} · ${language === "hi" ? "अपने दिन को अपनी गति से तय करें" : "shape your day at your own pace"}`}>
      <div className="space-y-6">
        <section className="rounded-2xl bg-[#082F49] p-6 text-white"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">{language === "hi" ? "आज की प्रगति" : "Today's Progress"}</p><p className="mt-2 text-4xl font-black">{progress}%</p><p className="mt-1 text-sky-100">{done} {language === "hi" ? "में से" : "of"} {items.length} {language === "hi" ? "गतिविधियां पूरी" : "activities complete"}</p></div><div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-white/15"><div className="absolute inset-0 rounded-full border-8 border-cyan-400" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} /><span className="text-xl font-black">{done}/{items.length}</span></div></div></section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(8,47,73,0.06)]"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#0369A1]">{language === "hi" ? "दैनिक प्लानर" : "Daily planner"}</p><h2 className="mt-1 text-2xl font-black text-[#082F49]">{language === "hi" ? "आज अपनी गतिविधियां तय करें" : "Plan your day"}</h2></div><button type="button" onClick={() => openEditor()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#082F49] px-4 py-2.5 font-bold text-white"><Plus size={17} /> {language === "hi" ? "गतिविधि जोड़ें" : "Add activity"}</button></div>
          {sorted.length ? <div className="space-y-3">{sorted.map((item) => { const completeState = item.status === "completed"; return <div key={item.id} className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${completeState ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}><button type="button" onClick={() => toggleComplete(item.id)} aria-label={completeState ? "Mark incomplete" : "Mark complete"} className={`shrink-0 ${completeState ? "text-emerald-600" : "text-slate-400"}`}>{completeState ? <CheckCircle2 size={25} /> : <Circle size={25} />}</button><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-[#0369A1]"><CalendarClock className="mr-1 inline" size={14} />{normalizeTime(item.time)}</span><span className="rounded-full bg-white px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">{labels[item.type] || labels.other}</span></div><p className={`mt-1 font-bold ${completeState ? "text-emerald-800 line-through" : "text-slate-800"}`}>{item.title}</p>{item.description ? <p className="mt-1 text-sm text-slate-500">{item.description}</p> : null}</div><div className="flex items-center gap-2 sm:shrink-0"><button type="button" onClick={() => openEditor(item)} aria-label="Edit activity" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-cyan-50"><PencilLine size={17} /></button><button type="button" onClick={() => deleteActivity(item.id)} aria-label="Delete activity" className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 size={17} /></button></div></div>; })}</div> : <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">{language === "hi" ? "आपका दिन खुला है। पहली गतिविधि जोड़ें।" : "Your day is open. Add your first activity."}</div>}
        </section>
        {isEditorOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F49]/50 p-4" role="dialog" aria-modal="true" aria-label="Activity editor"><form onSubmit={saveActivity} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0369A1]">{language === "hi" ? "दैनिक प्लान" : "Daily plan"}</p><h2 className="mt-1 text-2xl font-black text-[#082F49]">{editingId ? (language === "hi" ? "गतिविधि संपादित करें" : "Edit activity") : (language === "hi" ? "गतिविधि जोड़ें" : "Add activity")}</h2></div><button type="button" onClick={() => setIsEditorOpen(false)} aria-label="Close activity editor" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div><div className="mt-5 space-y-4"><label className="block text-sm font-bold text-slate-700">{language === "hi" ? "शीर्षक" : "Activity title"}<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></label><label className="block text-sm font-bold text-slate-700">{language === "hi" ? "विवरण" : "Description"}<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="3" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></label><div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-bold text-slate-700">{language === "hi" ? "समय" : "Time"}<input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-cyan-400" /></label><label className="text-sm font-bold text-slate-700 sm:col-span-2">{language === "hi" ? "श्रेणी" : "Category"}<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-cyan-400">{categories.map((category) => <option key={category} value={category}>{labels[category]}</option>)}</select></label></div><label className="block text-sm font-bold text-slate-700">{language === "hi" ? "तारीख (वैकल्पिक)" : "Date (optional)"}<input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setIsEditorOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">{language === "hi" ? "रद्द करें" : "Cancel"}</button><button className="rounded-xl bg-[#082F49] px-5 py-3 font-bold text-white">{language === "hi" ? "सेव करें" : "Save activity"}</button></div></form></div> : null}
      </div>
    </PatientLayout>
  );
}

function normalizeTime(value) {
  const match = String(value || "09:00").match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return "09:00";
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (match[3]?.toUpperCase() === "PM" && hours < 12) hours += 12;
  if (match[3]?.toUpperCase() === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function toMinutes(value) {
  const [hours, minutes] = normalizeTime(value).split(":").map(Number);
  return hours * 60 + minutes;
}
