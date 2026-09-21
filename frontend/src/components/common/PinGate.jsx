import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useAppLock } from "../../context/AppLockContext";

export default function PinGate({ children }) {
  const { enabled, unlocked, unlock } = useAppLock();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  if (!enabled || unlocked) return children;

  const submit = async (event) => {
    event.preventDefault();
    const valid = await unlock(pin);
    if (!valid) setError("That PIN did not match. Please try again.");
  };

  return <div className="flex min-h-screen items-center justify-center bg-[#edf8fc] p-5"><form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-cyan-100 bg-white p-7 text-center shadow-[0_20px_55px_rgba(4,31,51,0.12)]"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-[#087EA4]"><LockKeyhole size={28} /></div><h1 className="mt-5 text-2xl font-black text-[#062A45]">Private space locked</h1><p className="mt-2 text-sm text-slate-500">Enter your local PIN to continue.</p><input autoFocus inputMode="numeric" pattern="[0-9]*" maxLength={6} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ""))} className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-cyan-400" aria-label="App lock PIN" />{error ? <p className="mt-3 text-sm text-rose-700">{error}</p> : null}<button className="mt-5 w-full rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white">Unlock</button><p className="mt-4 text-xs text-slate-400">App Lock provides local device privacy and is not a replacement for device-level security.</p></form></div>;
}
