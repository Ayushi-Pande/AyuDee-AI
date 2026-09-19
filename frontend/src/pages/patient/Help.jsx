import { AlertTriangle, BriefcaseMedical, MapPin, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import PatientLayout from "../../components/common/PatientLayout";

const supportActions = [
  { label: "Call caregiver", icon: PhoneCall, detail: "A gentle check-in with your support person." },
  { label: "Emergency contact", icon: AlertTriangle, detail: "Use safe local emergency numbers if needed." },
  { label: "I feel confused", icon: Sparkles, detail: "Grounding steps to slow down and reorient." },
];

export default function PatientHelp() {
  return (
    <PatientLayout title="Help & support" subtitle="Simple, clear options when you need reassurance or a quick reset.">
      <div className="space-y-6">
        <div className="grid gap-5 md:grid-cols-3">
          {supportActions.map(({ label, icon: Icon, detail }) => (
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
      </div>
    </PatientLayout>
  );
}
