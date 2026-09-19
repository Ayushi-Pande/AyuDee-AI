import { useState } from "react";
import { Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "../components/common/PatientLayout";
import CaregiverLayout from "../components/common/CaregiverLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile({ role = "PATIENT" }) {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const Shell = role === "PATIENT" ? PatientLayout : CaregiverLayout;
  const save = (event) => { event.preventDefault(); updateUser({ ...user, name }); setSaved(true); window.setTimeout(() => setSaved(false), 2000); };
  return <Shell title="Profile & settings" subtitle="Keep your AyuDee space personal and comfortable."><section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(8,47,73,0.06)]"><div className="flex items-center gap-4 border-b border-slate-100 pb-6"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-2xl font-black text-[#0369A1]">{name.charAt(0).toUpperCase()}</div><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#0369A1]">{role === "PATIENT" ? "Patient profile" : "Caregiver profile"}</p><h2 className="text-2xl font-black text-[#082F49]">{user?.email}</h2></div></div><form onSubmit={save} className="mt-6 space-y-5"><label className="block text-sm font-bold text-slate-700">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></label>{role === "PATIENT" ? <div className="rounded-xl bg-cyan-50 p-4 text-sm text-[#0369A1]"><strong>Caregiver connection</strong><p className="mt-1">{user?.linkedCaregiverId ? "A caregiver is connected to your space." : "No caregiver connected yet. You can share a connection code from the caregiver connection page."}</p></div> : <div className="rounded-xl bg-cyan-50 p-4 text-sm text-[#0369A1]"><strong>Linked patient</strong><p className="mt-1">{user?.linkedPatientId ? "A patient is connected to your care space." : "Connect to a patient using their private code."}</p></div>}<div className="flex flex-wrap gap-3"><button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white"><Save size={17} />{saved ? "Saved" : "Save profile"}</button><button type="button" onClick={() => { logout(); navigate("/login"); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-4 py-3 font-bold text-rose-700"><LogOut size={17} />Log out</button></div></form></section></Shell>;
}
