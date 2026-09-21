import { LockKeyhole, LogOut, Save, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientLayout from "../components/common/PatientLayout";
import CaregiverLayout from "../components/common/CaregiverLayout";
import { useAppLock } from "../context/AppLockContext";
import { useAuth } from "../context/AuthContext";

export default function Profile({ role = "PATIENT" }) {
  const { user, updateUser, logout } = useAuth();
  const { enabled, setPin, disable } = useAppLock();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [pin, setPinValue] = useState("");
  const [message, setMessage] = useState("");
  const Shell = role === "PATIENT" ? PatientLayout : CaregiverLayout;

  const saveProfile = (event) => {
    event.preventDefault();
    updateUser({ ...user, name: name.trim() });
    setMessage("Profile saved.");
  };

  const saveLock = async () => {
    try {
      await setPin(pin);
      setPinValue("");
      setMessage("App Lock enabled.");
    } catch (error) {
      setMessage(error.message);
    }
  };

  const clearLocalData = () => {
    if (!window.confirm("Clear local demo data? This cannot be undone.")) return;
    ["ayudee-daily-plan", "ayudee-patient-reminders", "ayudee-patient-memories", "ayudee-memory-favorites", "ayudee-mood-history", "ayudee-family-circle", "ayudee-consultations", "ayudee-dismissed-reminders"].forEach((key) => localStorage.removeItem(key));
    setMessage("Local demo data cleared.");
  };

  return <Shell title="Profile & settings" subtitle="Keep your AyuDee space personal, private, and comfortable."><div className="grid max-w-5xl gap-6 xl:grid-cols-[1.05fr_0.95fr]"><section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-4 border-b border-slate-100 pb-6"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-2xl font-black text-[#0369A1]">{name.charAt(0).toUpperCase()}</div><div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#0369A1]">{role === "PATIENT" ? "Patient profile" : "Caregiver profile"}</p><h2 className="text-2xl font-black text-[#082F49]">{user?.email}</h2></div></div><form onSubmit={saveProfile} className="mt-6 space-y-5"><label className="block text-sm font-bold text-slate-700">Full name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></label><div className="rounded-xl bg-cyan-50 p-4 text-sm text-[#0369A1]"><strong>{role === "PATIENT" ? "Caregiver connection" : "Linked patient"}</strong><p className="mt-1">{role === "PATIENT" ? (user?.linkedCaregiverId ? "A caregiver is connected to your space." : "No caregiver connected yet.") : (user?.linkedPatientId ? "A patient is connected to your care space." : "No patient connected yet.")}</p></div><div className="flex flex-wrap gap-3"><button className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white"><Save size={17} /> Save profile</button><button type="button" onClick={() => { logout(); navigate("/login"); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-rose-200 px-4 py-3 font-bold text-rose-700"><LogOut size={17} /> Log out</button></div></form></section><section className="space-y-6"><div className="rounded-[28px] border border-cyan-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><ShieldCheck className="text-[#087EA4]" size={24} /><div><h2 className="text-xl font-black text-[#082F49]">Privacy Center</h2><p className="text-sm text-slate-500">Local device controls for this demo.</p></div></div><div className="mt-5 rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-3"><LockKeyhole className="text-[#087EA4]" size={20} /><div className="flex-1"><p className="font-bold text-slate-800">App Lock</p><p className="text-xs text-slate-500">{enabled ? "Enabled for caregiver sections." : "Protect caregiver and private settings."}</p></div>{enabled ? <button type="button" onClick={() => { disable(); setMessage("App Lock disabled."); }} className="rounded-xl border border-rose-200 px-3 py-2 text-sm font-bold text-rose-700">Disable</button> : null}</div>{!enabled ? <div className="mt-4 flex gap-2"><input inputMode="numeric" maxLength={6} value={pin} onChange={(event) => setPinValue(event.target.value.replace(/\D/g, ""))} placeholder="4–6 digit PIN" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-400" /><button type="button" onClick={saveLock} className="rounded-xl bg-[#082F49] px-3 py-2 text-sm font-bold text-white">Enable</button></div> : null}</div><p className="mt-3 text-xs leading-5 text-slate-400">App Lock provides local device privacy and is not a replacement for device-level security. PIN verification is hashed with Web Crypto and never displayed.</p></div><div className="rounded-[28px] border border-rose-100 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><Trash2 className="text-rose-600" size={22} /><div><h2 className="text-xl font-black text-slate-800">Stored demo data</h2><p className="text-sm text-slate-500">Remove locally stored planner, mood, memory, contact, and appointment data.</p></div></div><button type="button" onClick={clearLocalData} className="mt-4 rounded-xl border border-rose-200 px-4 py-3 text-sm font-bold text-rose-700">Clear local demo data</button></div>{message ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{message}</p> : null}</section></div></Shell>;
}
