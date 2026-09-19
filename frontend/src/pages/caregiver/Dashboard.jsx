import { Activity, AlertCircle, BarChart3, BrainCircuit, CheckCheck, Heart, PencilLine, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
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
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { caregiverAlerts, caregiverChartData, demoActivity, demoMemories, demoReminders } from "../../data/demoData";
import { apiService } from "../../services/api";

const patientId = "patient-001";

export default function CaregiverDashboard() {
  const [dashboard, setDashboard] = useState({
    reminders: demoReminders,
    memories: demoMemories,
    activities: demoActivity,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [analyticsRes, activitiesRes] = await Promise.all([
          apiService.getAnalytics(patientId).catch(() => ({ data: {} })),
          apiService.getActivities(patientId).catch(() => ({ data: demoActivity })),
        ]);

        setDashboard({
          analytics: analyticsRes?.data || {},
          activities: Array.isArray(activitiesRes?.data)
            ? activitiesRes.data
            : Array.isArray(activitiesRes?.data?.activities)
              ? activitiesRes.data.activities
              : demoActivity,
          reminders: demoReminders,
          memories: demoMemories,
        });
      } catch {
        setError("The live analytics service is unavailable, so the dashboard is showing safe demo insights instead.");
      }
    };

    loadDashboard();
  }, []);

  const reminderCompletion = 78;
  const memoryEngagement = 86;

  return (
    <CaregiverLayout title="Overview" subtitle="Patient health and support rhythm at a glance.">
      <div className="space-y-6">
        {error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div> : null}

        <section className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#041F33,#087EA4)] p-7 text-white shadow-[0_22px_50px_rgba(4,31,51,0.18)]">
          <div className="absolute -right-14 -top-20 h-64 w-64 rounded-full border-[36px] border-[#14B8A6]/20" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#A7F3D0]">Connected patient</p><h2 className="mt-3 text-4xl font-black">Good morning, Sarah.</h2><p className="mt-3 text-sky-100/75">A clear snapshot of Alice Sharma’s everyday care rhythm.</p></div><div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#A7F3D0]">Patient status</p><p className="mt-2 text-2xl font-black">Alice Sharma</p><p className="mt-1 text-sm font-bold text-[#A7F3D0]">● Connected</p></div></div>
        </section>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Patient overview</p>
              <Heart className="text-violet-600" size={18} />
            </div>
            <p className="mt-4 text-3xl font-black text-slate-800">84%</p>
            <p className="mt-2 text-sm text-slate-500">overall support stability</p>
          </div>

          <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Today status</p>
              <CheckCheck className="text-emerald-600" size={18} />
            </div>
            <p className="mt-4 text-3xl font-black text-slate-800">On track</p>
            <p className="mt-2 text-sm text-slate-500">3 reminders completed</p>
          </div>

          <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Reminder completion</p>
              <Activity className="text-violet-600" size={18} />
            </div>
            <p className="mt-4 text-3xl font-black text-slate-800">{reminderCompletion}%</p>
            <p className="mt-2 text-sm text-slate-500">This week</p>
          </div>

          <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Memory engagement</p>
              <TrendingUp className="text-amber-600" size={18} />
            </div>
            <p className="mt-4 text-3xl font-black text-slate-800">{memoryEngagement}%</p>
            <p className="mt-2 text-sm text-slate-500">More familiar moments this month</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <SectionHeader title="Reminder completion" subtitle="Weekly routine progress" />
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caregiverChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#087EA4" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="reminders" fill="#20B7D8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <SectionHeader title="Alerts" />
            <div className="space-y-3">
              {caregiverAlerts.map((alert) => (
                <div key={alert} className="flex items-start gap-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-100">
                  <AlertCircle size={18} className="mt-0.5" />
                  <p>{alert}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <SectionHeader title="Cognitive-game performance" subtitle="Recent trend and confidence" />
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={caregiverChartData.map((point) => ({ ...point, performance: Math.round((point.completed / point.reminders) * 100) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="performance" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <SectionHeader title="Recent activity" />
            <div className="space-y-3">
              {dashboard.activities?.slice(0, 4).map((entry) => (
                <div key={entry.label || entry.title || entry.time} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <div>
                    <p className="font-semibold text-slate-800">{entry.label || entry.title || "Daily activity"}</p>
                    <p className="text-sm text-slate-500">{entry.minutes ? `${entry.minutes} minutes` : entry.time || "Recent"}</p>
                  </div>
                  <StatusBadge status={entry.status || "active"} variant={entry.status === "completed" ? "success" : "soft"} />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader title="Quick actions" action={<Link to="/caregiver/reminders" className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-[#0369A1]">Manage plan</Link>} />
          <div className="grid gap-4 md:grid-cols-3">
            <Link to="/caregiver/games" className="rounded-2xl bg-cyan-50 p-4 text-left ring-1 ring-cyan-100 hover:bg-cyan-100">
              <BarChart3 className="mb-3 text-violet-700" size={22} />
              <p className="font-bold text-slate-800">View analytics</p>
            </Link>
            <Link to="/caregiver/games" className="rounded-2xl bg-emerald-50 p-4 text-left ring-1 ring-emerald-100 hover:bg-emerald-100">
              <BrainCircuit className="mb-3 text-emerald-700" size={22} />
              <p className="font-bold text-slate-800">Review games</p>
            </Link>
            <Link to="/caregiver/reminders" className="rounded-2xl bg-amber-50 p-4 text-left ring-1 ring-amber-100 hover:bg-amber-100">
              <PencilLine className="mb-3 text-amber-700" size={22} />
              <p className="font-bold text-slate-800">Update support notes</p>
            </Link>
          </div>
        </div>
      </div>
    </CaregiverLayout>
  );
}
