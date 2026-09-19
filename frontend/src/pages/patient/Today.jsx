import { CheckCircle2, Circle, Clock3, Pill, Stethoscope, Utensils, Brain, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import { demoReminders } from "../../data/demoData";

const icons = { medication: Pill, appointment: Stethoscope, meal: Utensils, activity: Brain, personal: Heart };
export default function Today() {
  const [items, setItems] = useState(() => demoReminders.map((item) => ({ ...item, status: item.status === "completed" ? "completed" : "upcoming" })));
  const complete = (id) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: item.status === "completed" ? "upcoming" : "completed" } : item));
  const done = items.filter((item) => item.status === "completed").length;
  const progress = Math.round((done / items.length) * 100);
  const date = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const sorted = useMemo(() => [...items].sort((a, b) => toMinutes(a.time) - toMinutes(b.time)), [items]);
  return <PatientLayout title="Today's Journey" subtitle={`${date} · a gentle plan for your day`}><div className="space-y-6"><section className="rounded-2xl bg-[#082F49] p-6 text-white"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Today's Progress</p><p className="mt-2 text-4xl font-black">{progress}%</p><p className="mt-1 text-sky-100">{done} of {items.length} activities complete</p></div><div className="relative flex h-24 w-24 items-center justify-center rounded-full border-8 border-white/15"><div className="absolute inset-0 rounded-full border-8 border-cyan-400" style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }} /><span className="text-xl font-black">{done}/{items.length}</span></div></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(8,47,73,0.06)]"><div className="mb-5"><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#0369A1]">Timeline</p><h2 className="mt-1 text-2xl font-black text-[#082F49]">Move through today at your pace</h2></div><div className="space-y-3">{sorted.map((item) => { const Icon = icons[item.type] || Circle; const completeState = item.status === "completed"; return <div key={item.id} className={`flex items-center gap-4 rounded-xl border p-4 ${completeState ? "border-emerald-200 bg-emerald-50/60" : "border-slate-200 bg-slate-50"}`}><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0369A1] shadow-sm"><Icon size={20} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-bold text-[#0369A1]"><Clock3 className="mr-1 inline" size={14} />{item.time}</span><span className="text-xs font-bold uppercase tracking-wider text-slate-400">{item.type}</span></div><p className={`mt-1 font-bold ${completeState ? "text-emerald-800 line-through" : "text-slate-800"}`}>{item.title}</p><p className="mt-1 text-sm text-slate-500">{item.notes || "A small step in your day."}</p></div><button type="button" onClick={() => complete(item.id)} className={`flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold ${completeState ? "bg-emerald-700 text-white" : "bg-[#082F49] text-white"}`}>{completeState ? <CheckCircle2 size={17} /> : <Circle size={17} />}{completeState ? "Done" : "Complete"}</button></div>; })}</div></section></div></PatientLayout>;
}

function toMinutes(value) {
  const match = String(value).match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}
