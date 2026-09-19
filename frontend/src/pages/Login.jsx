import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import AyuDeeLogo from "../components/brand/AyuDeeLogo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await loginUser(form);
      navigate(user.role === "PATIENT" ? "/patient" : "/caregiver");
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7fafc] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_16px_40px_rgba(8,47,73,0.1)]">
        <AyuDeeLogo />
        <div className="mt-10"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0369A1]">Welcome back</p><h1 className="mt-2 text-3xl font-black text-[#082F49]">Sign in to your care space</h1><p className="mt-2 text-slate-500">Your memories, routines, and connections are ready when you are.</p></div>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block text-sm font-semibold text-slate-700">Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-[#06B6D4]" /></label>
          <label className="block text-sm font-semibold text-slate-700">Password<div className="relative mt-2"><input type={showPassword ? "text" : "password"} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-[#06B6D4]" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button></div></label>
          {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
          <button disabled={loading} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white transition hover:bg-[#0369A1] disabled:opacity-60"><LogIn size={18} />{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">New to AyuDee? <Link to="/register" className="font-bold text-[#0369A1]">Create an account</Link></p>
        <p className="mt-3 text-center text-xs text-slate-400">Hackathon demo: patient@example.com / patient123</p>
      </section>
    </main>
  );
}
