import { Link } from "react-router-dom";
import { Link2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import CaregiverLayout from "../../components/common/CaregiverLayout";
import { useAuth } from "../../context/AuthContext";

export default function Connect() {
  const { user, connectCaregiverToPatient } = useAuth();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => { event.preventDefault(); setError(""); setMessage(""); try { const result = connectCaregiverToPatient(user.id, code.trim().toUpperCase()); setMessage(`Connected to ${result.patient.name}.`); } catch (connectError) { setError(connectError.message); } };
  return <CaregiverLayout title="Connection" subtitle="Connect to a patient with a private, shareable code."><div className="grid max-w-4xl gap-6 md:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(8,47,73,0.06)]"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-[#0369A1]"><Link2 /></div><h2 className="mt-5 text-2xl font-black text-[#082F49]">Connect to a patient</h2><p className="mt-2 text-slate-500">Enter the code shared by the patient. AyuDee only reveals care information after a connection is made.</p><form onSubmit={submit} className="mt-6 space-y-4"><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="AYU-7K2P" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-bold uppercase tracking-[0.18em] outline-none focus:border-cyan-400" required />{error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}{message ? <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}<button className="min-h-11 rounded-xl bg-[#082F49] px-5 py-3 font-bold text-white">Connect securely</button></form></section><section className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6"><ShieldCheck className="text-[#0369A1]" size={28} /><h2 className="mt-5 text-xl font-black text-[#082F49]">Privacy by design</h2><p className="mt-2 text-sm leading-6 text-slate-600">Connection codes are intended for your care circle. Do not share them publicly. This demo keeps connection data in the browser; a production deployment should enforce server-side access controls.</p><Link to="/caregiver/profile" className="mt-6 inline-block font-bold text-[#0369A1]">Review caregiver profile</Link></section></div></CaregiverLayout>;
}
