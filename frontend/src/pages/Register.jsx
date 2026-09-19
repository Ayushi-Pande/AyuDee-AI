import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AyuDeeLogo from "../components/brand/AyuDeeLogo";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { registerUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "PATIENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Use at least 8 characters for your password.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    try { const user = await registerUser(form); navigate(user.role === "PATIENT" ? "/patient" : "/caregiver"); } catch (registerError) { setError(registerError.message); } finally { setLoading(false); }
  };
  return <main className="flex min-h-screen items-center justify-center bg-[#f7fafc] px-4 py-10"><section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(8,47,73,0.1)]"><AyuDeeLogo /><div className="mt-8"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0369A1]">Start simply</p><h1 className="mt-2 text-3xl font-black text-[#082F49]">Create your AyuDee space</h1><p className="mt-2 text-slate-500">A calm place for support, routines, and connection.</p></div><form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-semibold text-slate-700">Full name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#06B6D4]" /></label><label className="block text-sm font-semibold text-slate-700">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#06B6D4]" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Password<input required type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#06B6D4]" /></label><label className="block text-sm font-semibold text-slate-700">Confirm password<input required type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#06B6D4]" /></label></div><fieldset><legend className="text-sm font-semibold text-slate-700">I am joining as</legend><div className="mt-2 grid grid-cols-2 gap-3">{[{ value: "PATIENT", label: "Patient" }, { value: "CAREGIVER", label: "Caregiver" }].map((option) => <button key={option.value} type="button" onClick={() => setForm({ ...form, role: option.value })} className={`rounded-xl border px-4 py-3 text-sm font-bold ${form.role === option.value ? "border-[#06B6D4] bg-cyan-50 text-[#0369A1]" : "border-slate-200 text-slate-600"}`}>{option.label}</button>)}</div></fieldset>{error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}<button disabled={loading} className="min-h-11 w-full rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white transition hover:bg-[#0369A1] disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</button></form><p className="mt-6 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-bold text-[#0369A1]">Sign in</Link></p></section></main>;
}
