import { ArrowRight, Brain, CalendarDays, Eye, EyeOff, Heart, LogIn, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AyuDeeLogo from "../components/brand/AyuDeeLogo";
import ExperienceVisual from "../components/common/ExperienceVisual";
import { useAuth } from "../context/AuthContext";

const benefits = [[Brain, "Stay Engaged", "Cognitive games & activities"], [CalendarDays, "Stay Organized", "Smart reminders & routines"], [Users, "Stay Connected", "Caregiver support & insights"], [ShieldCheck, "Stay Safe", "Privacy-first design"]];
const experiences = [
  { role: "PATIENT", title: "Continue as Patient", description: "Your calm space for memories, routines and brain activities.", visual: "patient", accent: "#087EA4", features: [[Sparkles, "Memory Vault", "Capture and revisit special moments"], [Brain, "Brain Studio", "Fun games to keep your mind active"], [CalendarDays, "Daily Reminders", "Stay on track with your routine"], [Heart, "AI Companion", "Get gentle support anytime"]] },
  { role: "CAREGIVER", title: "Continue as Caregiver", description: "Stay connected and provide thoughtful everyday support.", visual: "caregiver", accent: "#0AA89E", features: [[Users, "Routine Overview", "View daily activity and progress"], [Heart, "Memory Support", "Help preserve precious moments"], [Sparkles, "Activity Insights", "Track engagement and trends"], [CalendarDays, "Reminder Management", "Create and manage reminders"]] },
];

export default function ChooseRole() {
  const navigate = useNavigate();
  const { user, loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const continueAsRole = (role) => {
    const patient = role === "PATIENT";
    if (user?.role === role) {
      navigate(patient ? "/patient" : "/caregiver");
      return;
    }
    navigate(`/login?role=${patient ? "patient" : "caregiver"}`);
  };

  const demoLogin = (role) => {
    const patient = role === "PATIENT";
    loginUser({ email: patient ? "patient@example.com" : "caregiver@example.com", password: patient ? "patient123" : "caregiver123" }).catch(() => undefined);
    navigate(patient ? "/patient" : "/caregiver");
  };

  const signIn = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const authenticatedUser = await loginUser(form);
      navigate(authenticatedUser.role === "PATIENT" ? "/patient" : "/caregiver");
    } catch (signInError) {
      setError(signInError.message || "We could not sign you in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#EAF7FC] text-[#0B2945] lg:grid lg:grid-cols-[30%_70%]">
      <section className="relative flex min-h-[560px] flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#041F33,#073B66_66%,#087EA4)] px-7 py-9 text-white sm:px-12 lg:min-h-screen lg:px-12 lg:py-12">
        <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full border-[38px] border-[#20B7D8]/20" /><div className="absolute right-[-110px] top-[42%] h-64 w-64 rounded-full bg-[#14B8A6]/15 blur-3xl" /><div className="neural-grid absolute inset-0 opacity-30" />
        <div className="relative"><AyuDeeLogo variant="light" /><div className="mt-16 max-w-sm lg:mt-24"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#38C6C4]">Cognitive Care Platform</p><h1 className="mt-5 text-5xl font-black leading-[1.03] sm:text-6xl">Care that <span className="text-[#38C6C4]">remembers</span> with you.</h1><p className="mt-6 text-base leading-7 text-sky-100/75">A compassionate AI-powered platform to support memory, routines, independence, and meaningful connections.</p></div><div className="mt-12 space-y-4">{benefits.map(([Icon, title, copy]) => <div key={title} className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#38C6C4] ring-1 ring-white/10"><Icon size={20} /></span><span><strong className="block text-sm">{title}</strong><small className="text-xs text-sky-100/60">{copy}</small></span></div>)}</div></div><div className="relative flex items-end justify-between gap-3"><p className="text-sm font-semibold italic text-sky-100/70">Smarter Days,<br />Brighter Tomorrows ♡</p><div className="h-24 w-20 rounded-t-full bg-[#14B8A6]/25 blur-sm" /></div>
      </section>
      <section className="app-page min-w-0 px-5 py-8 sm:px-8 lg:px-14 lg:py-10"><header className="flex items-start justify-between gap-4"><div className="text-center sm:text-left"><p className="text-xs font-black uppercase tracking-[0.24em] text-[#087EA4]">AyuDee AI</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Choose Your <span className="text-[#087EA4]">Journey</span></h2><p className="mt-3 text-base text-[#64748B]">Two connected experiences. One thoughtful platform.</p><div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-[#087EA4] to-[#0AA89E] sm:mx-0" /></div><div className="hidden items-center gap-3 sm:flex"><span className="text-sm font-semibold text-[#64748B]">Need help?</span><Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#073B66] shadow-sm transition hover:border-[#38C6C4]"><LogIn size={16} /> Sign In</Link></div></header><div className="mt-9 grid gap-6 xl:grid-cols-2">{experiences.map((experience) => <article key={experience.role} className="premium-card overflow-hidden bg-[#FBFDFC] p-3"><ExperienceVisual variant={experience.visual} /><div className="p-4 sm:p-5"><p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: experience.accent }}>{experience.role}</p><h3 className="mt-2 text-2xl font-black text-[#0B2945]">{experience.title}</h3><p className="mt-2 text-sm leading-6 text-[#64748B]">{experience.description}</p><div className="mt-5 space-y-3">{experience.features.map(([Icon, title, copy]) => <div key={title} className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7FC]" style={{ color: experience.accent }}><Icon size={17} /></span><span><strong className="block text-sm text-[#0B2945]">{title}</strong><small className="text-xs text-[#64748B]">{copy}</small></span></div>)}</div><button type="button" onClick={() => continueAsRole(experience.role)} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-black text-white transition hover:-translate-y-0.5" style={{ background: experience.role === "PATIENT" ? "linear-gradient(90deg,#087EA4,#078DD8)" : "linear-gradient(90deg,#0AA89E,#087EA4)" }}>{experience.title} <ArrowRight size={18} /></button></div></article>)}</div><div className="mt-7 flex items-center gap-3"><span className="h-px flex-1 bg-[#c5dfe8]" /><span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#64748B]">or sign in to your account</span><span className="h-px flex-1 bg-[#c5dfe8]" /></div><form onSubmit={signIn} className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]"><input aria-label="Email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Enter your email" className="min-h-12 rounded-xl border border-[#c9dfe8] bg-white px-4 text-sm outline-none transition focus:border-[#20B7D8]" /><div className="relative"><input aria-label="Password" type={showPassword ? "text" : "password"} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" className="min-h-12 w-full rounded-xl border border-[#c9dfe8] bg-white px-4 pr-12 text-sm outline-none transition focus:border-[#20B7D8]" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Show or hide password" className="absolute right-3 top-3 text-[#64748B]">{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div><button disabled={loading} className="min-h-12 rounded-xl bg-[#073B66] px-7 font-black text-white transition hover:bg-[#087EA4] disabled:opacity-60">{loading ? "Signing in..." : "Sign In"}</button></form>{error ? <p className="mt-3 text-center text-sm font-semibold text-rose-700">{error}</p> : null}<div className="mt-3 flex justify-center gap-4 text-xs font-bold text-[#087EA4]"><Link to="/register">Create a new account</Link><span className="text-[#c5dfe8]">|</span><button type="button" onClick={() => setError("Password recovery requires a connected backend account.")} className="hover:underline">Forgot password?</button></div><section className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#c9e8ed] bg-[linear-gradient(90deg,#F2F0FF,#EAF7FC)] p-4 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-sm font-black text-[#0B2945]">Hackathon Demo</p><p className="mt-1 text-xs text-[#64748B]">Explore with sample data</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => demoLogin("PATIENT")} className="rounded-xl bg-[#DDF7F5] px-4 py-3 text-xs font-black text-[#087EA4] transition hover:bg-[#b9eee8]">Quick Patient Demo</button><button type="button" onClick={() => demoLogin("CAREGIVER")} className="rounded-xl bg-[#0AA89E] px-4 py-3 text-xs font-black text-white transition hover:bg-[#087EA4]">Quick Caregiver Demo</button></div></section><footer className="mt-6 grid gap-3 border-t border-[#d4e8ee] pt-5 text-center text-xs font-bold text-[#64748B] sm:grid-cols-4"><span>◈ Privacy First</span><span>◉ Accessible for All</span><span>♥ Caregiver Connected</span><span>◇ Non-Diagnostic Support</span></footer></section>
    </main>
  );
}
