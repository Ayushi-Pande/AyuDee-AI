import { AlertTriangle, BriefcaseMedical, MapPin, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";

export default function PatientHelp() {
  const [caregiverName, setCaregiverName] = useState(() => localStorage.getItem("ayudee-caregiver-name") || "");
  const [caregiverRelationship, setCaregiverRelationship] = useState(() => localStorage.getItem("ayudee-caregiver-relationship") || "");
  const [caregiverPhone, setCaregiverPhone] = useState(() => localStorage.getItem("ayudee-caregiver-phone") || "");
  const [nameDraft, setNameDraft] = useState(caregiverName);
  const [relationshipDraft, setRelationshipDraft] = useState(caregiverRelationship);
  const [phoneDraft, setPhoneDraft] = useState(caregiverPhone);
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [showSos, setShowSos] = useState(false);

  const savePhone = (event) => {
    event.preventDefault();
    const nextName = nameDraft.trim();
    const nextRelationship = relationshipDraft.trim();
    const nextPhone = phoneDraft.trim();
    setCaregiverName(nextName);
    setCaregiverRelationship(nextRelationship);
    setCaregiverPhone(nextPhone);
    localStorage.setItem("ayudee-caregiver-name", nextName);
    localStorage.setItem("ayudee-caregiver-relationship", nextRelationship);
    localStorage.setItem("ayudee-caregiver-phone", nextPhone);
  };

  const openDialer = () => {
    setShowCallConfirm(false);
    window.location.href = `tel:${caregiverPhone.replace(/[^\d+]/g, "")}`;
  };

  return (
    <PatientLayout title="Help & support" subtitle="Simple, clear options when you need reassurance or a quick reset.">
      <div className="space-y-6">
        <section className="rounded-[28px] border border-rose-200 bg-rose-50 p-5 shadow-[0_18px_45px_rgba(190,24,93,0.08)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-600 p-3 text-white"><AlertTriangle size={26} /></div>
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-rose-700">SOS / Help</p><h2 className="mt-1 text-2xl font-black text-rose-950">Need immediate support?</h2><p className="mt-1 max-w-xl text-sm text-rose-900/75">AyuDee is a support tool and does not replace professional or emergency medical services.</p></div>
            </div>
            <button type="button" onClick={() => setShowSos(true)} className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-base font-black text-white shadow-sm hover:bg-rose-700">Open help options</button>
          </div>
        </section>

        <section className="rounded-[28px] border border-cyan-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3"><PhoneCall className="text-[#087EA4]" size={22} /><div><h2 className="text-xl font-black text-slate-800">Caregiver contact</h2><p className="text-sm text-slate-500">Saved only on this device for the demo.</p></div></div>
          <form onSubmit={savePhone} className="mt-4 grid gap-3 sm:grid-cols-3"><input value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} aria-label="Caregiver name" placeholder="Name" className="min-h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-cyan-400" /><input value={relationshipDraft} onChange={(event) => setRelationshipDraft(event.target.value)} aria-label="Caregiver relationship" placeholder="Relationship" className="min-h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-cyan-400" /><input value={phoneDraft} onChange={(event) => setPhoneDraft(event.target.value)} aria-label="Caregiver phone number" placeholder="Phone number" className="min-h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-cyan-400" /><div className="flex flex-wrap gap-3 sm:col-span-3"><button type="submit" className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-700">Save contact</button>{caregiverPhone ? <button type="button" onClick={() => setShowCallConfirm(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white"><PhoneCall size={17} /> Call {caregiverName || "caregiver"}</button> : <span className="self-center text-sm text-slate-500">Add a caregiver contact first.</span>}</div></form>
        </section>

        <div className="grid gap-5 md:grid-cols-3">
          {[{ label: "Call caregiver", icon: PhoneCall, detail: "A gentle check-in with your support person." }, { label: "Emergency contact", icon: AlertTriangle, detail: "Use safe local emergency numbers if needed." }, { label: "I feel confused", icon: Sparkles, detail: "Grounding steps to slow down and reorient." }].map(({ label, icon: Icon, detail }) => (
            <div key={label} className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
              <div className="mb-4 inline-flex rounded-2xl bg-violet-100 p-3 text-violet-700">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800">{label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3 text-violet-700">
              <BriefcaseMedical size={22} />
              <h3 className="text-2xl font-black text-slate-800">Emergency contact</h3>
            </div>
            <div className="space-y-3 text-slate-600">
              <p className="rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-800">Caregiver:</span> +1 (555) 023-8810</p>
              <p className="rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-800">Local emergency:</span> 911</p>
              <p className="rounded-2xl bg-slate-50 p-4"><span className="font-semibold text-slate-800">Clinic:</span> Riverside Care Center</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
            <div className="mb-4 flex items-center gap-3 text-emerald-700">
              <ShieldCheck size={22} />
              <h3 className="text-2xl font-black text-slate-800">Grounding help</h3>
            </div>
            <ol className="space-y-3 text-sm leading-7 text-slate-600">
              <li className="rounded-2xl bg-emerald-50 p-3">1. Sit down and notice 5 things you can see.</li>
              <li className="rounded-2xl bg-emerald-50 p-3">2. Take 3 slow breaths and relax your shoulders.</li>
              <li className="rounded-2xl bg-emerald-50 p-3">3. Focus on one trusted memory or a comforting picture.</li>
              <li className="rounded-2xl bg-emerald-50 p-3">4. Ask for support from your caregiver or companion.</li>
            </ol>
          </section>
        </div>

        <div className="rounded-[28px] border border-amber-100 bg-[#fff8ef] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-3 text-amber-700">
            <MapPin size={22} />
            <h3 className="text-2xl font-black text-slate-800">When you feel confused</h3>
          </div>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Try to slow down, name the date, and focus on one simple next task. If needed, call your caregiver or use the companion chat for a calm check-in. This app supports routine and memory cues; it is not a medical diagnosis tool.
          </p>
        </div>

        {showCallConfirm ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F49]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="call-caregiver-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 id="call-caregiver-title" className="text-2xl font-black text-[#082F49]">Call your caregiver?</h2><p className="mt-2 text-slate-600">Your phone will open the dialer for {caregiverPhone}. You can review the call before placing it.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowCallConfirm(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button><button type="button" onClick={openDialer} className="rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white">Open dialer</button></div></div></div> : null}
        {showSos ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F49]/50 p-4" role="dialog" aria-modal="true" aria-labelledby="sos-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 id="sos-title" className="text-2xl font-black text-rose-950">Help options</h2><p className="mt-2 text-slate-600">Choose what you need. AyuDee will not automatically contact emergency services.</p><div className="mt-5 grid gap-3"><button type="button" onClick={() => { setShowSos(false); setShowCallConfirm(true); }} className="inline-flex items-center gap-2 rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white"><PhoneCall size={18} /> Call caregiver</button><a href="tel:911" onClick={() => setShowSos(false)} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white"><AlertTriangle size={18} /> Emergency help</a><button type="button" onClick={() => setShowSos(false)} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button></div></div></div> : null}
      </div>
    </PatientLayout>
  );
}
