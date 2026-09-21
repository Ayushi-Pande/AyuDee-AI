import { Activity, BarChart3, BrainCircuit, CalendarClock, HeartPulse, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CaregiverLayout from "../../components/common/CaregiverLayout";

const engagementData = [
  { day: "Mon", engagement: 68, games: 42, reminders: 76 },
  { day: "Tue", engagement: 74, games: 48, reminders: 81 },
  { day: "Wed", engagement: 76, games: 55, reminders: 84 },
  { day: "Thu", engagement: 71, games: 52, reminders: 89 },
  { day: "Fri", engagement: 83, games: 61, reminders: 92 },
  { day: "Sat", engagement: 88, games: 69, reminders: 94 },
  { day: "Sun", engagement: 90, games: 72, reminders: 96 },
];

const insightCards = [
  { label: "Weekly Engagement", value: "92%", detail: "Up 11% from last week", icon: Activity },
  { label: "Game Performance", value: "81%", detail: "Consistent recall success", icon: BrainCircuit },
  { label: "Reminder Completion", value: "94%", detail: "Strong routine adherence", icon: CalendarClock },
  { label: "Memory Engagement", value: "87%", detail: "Family memories viewed often", icon: HeartPulse },
];

const timelineData = [
  { time: "9:04 AM", event: "Morning medicine completed" },
  { time: "10:18 AM", event: "Memory Match completed" },
  { time: "11:05 AM", event: "Viewed Family Picnic" },
  { time: "1:40 PM", event: "Reminder review completed" },
  { time: "3:15 PM", event: "Brain training session finished" },
];

export default function CaregiverInsights() {
  const [moodHistory] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("ayudee-mood-history") || "[]");
      return Array.isArray(stored) ? stored.slice(-7).reverse() : [];
    } catch {
      return [];
    }
  });

  return (
    <CaregiverLayout title="Insights" subtitle="Neutral activity summaries for support planning and routine monitoring.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {insightCards.map(({ label, value, detail, icon: Icon }) => (
            <div key={label} className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{label}</p>
                <div className="rounded-2xl bg-[#eef7ff] p-2 text-[#146c94]">
                  <Icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black text-[#102a43]">{value}</p>
              <p className="mt-2 text-sm text-slate-500">{detail}</p>
            </div>
          ))}
        </div>

        <section className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
          <div className="flex items-center gap-3"><HeartPulse className="text-[#146c94]" size={22} /><div><h2 className="text-2xl font-black text-[#102a43]">Mood history</h2><p className="text-sm text-slate-500">Recent check-ins shared from the patient device.</p></div></div>
          {moodHistory.length ? <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">{moodHistory.map((entry) => <div key={entry.date} className="rounded-2xl bg-[#f7fbff] p-3 text-center"><p className="text-2xl">{{ happy: "😊", good: "🙂", okay: "😐", low: "😔", anxious: "😟" }[entry.mood] || "•"}</p><p className="mt-2 text-xs font-bold capitalize text-[#146c94]">{entry.mood}</p><p className="mt-1 text-[10px] text-slate-400">{entry.date.slice(5)}</p></div>)}</div> : <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No mood check-ins have been recorded yet.</p>}
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <BarChart3 className="text-[#146c94]" size={22} />
              <h2 className="text-2xl font-black text-[#102a43]">Weekly engagement</h2>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="engagementFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#2f80ed" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2f80ed" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="engagement" stroke="#0b3b66" strokeWidth={3} fill="url(#engagementFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <Sparkles className="text-[#146c94]" size={22} />
              <h2 className="text-2xl font-black text-[#102a43]">Care insights</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-[#eef7ff] p-4 text-sm text-[#102a43]">
                “Morning routines have been completed consistently this week.”
              </div>
              <div className="rounded-2xl bg-[#eef7ff] p-4 text-sm text-[#102a43]">
                “Memory engagement is higher than last week.”
              </div>
              <div className="rounded-2xl bg-[#eef7ff] p-4 text-sm text-[#102a43]">
                “Brain training sessions show a stable upward trend.”
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <BrainCircuit className="text-[#146c94]" size={22} />
              <h2 className="text-2xl font-black text-[#102a43]">Game performance</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="games" stroke="#2f80ed" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
            <div className="mb-5 flex items-center gap-3">
              <CalendarClock className="text-[#146c94]" size={22} />
              <h2 className="text-2xl font-black text-[#102a43]">Reminder completion</h2>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="reminders" fill="#56b4e9" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="rounded-[28px] border border-[#d8ebff] bg-white p-5 shadow-[0_18px_40px_rgba(11,59,102,0.08)]">
          <div className="mb-5 flex items-center gap-3">
            <Activity className="text-[#146c94]" size={22} />
            <h2 className="text-2xl font-black text-[#102a43]">Activity timeline</h2>
          </div>
          <div className="space-y-4">
            {timelineData.map(({ time, event }) => (
              <div key={`${time}-${event}`} className="flex items-start gap-4 rounded-2xl bg-[#f7fbff] p-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-[#2f80ed]" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#146c94]">{time}</p>
                  <p className="mt-1 text-sm text-[#102a43]">{event}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-[28px] border border-[#d8ebff] bg-[#eef7ff] p-5 text-sm text-[#102a43]">
          These insights summarize app activity and are not medical assessments.
        </div>
      </div>
    </CaregiverLayout>
  );
}
