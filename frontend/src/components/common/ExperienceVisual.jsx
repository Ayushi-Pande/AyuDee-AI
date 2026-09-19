import { Brain, HeartHandshake, Sparkles, UsersRound } from "lucide-react";

const localAssets = import.meta.glob("../../assets/*", { eager: true, query: "?url", import: "default" });

export default function ExperienceVisual({ variant = "patient" }) {
  const patient = variant === "patient";
  const photoKey = patient ? "../../assets/patient-care.jpg" : "../../assets/caregiver-care.jpg";
  const photoUrl = localAssets[photoKey];

  return (
    <div className={`relative h-60 overflow-hidden rounded-[22px] ${patient ? "bg-[linear-gradient(135deg,#087EA4,#062A45)]" : "bg-[linear-gradient(135deg,#0F766E,#087EA4)]"}`} aria-hidden="true">
      {photoUrl ? <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
      {photoUrl ? <div className="absolute inset-0 bg-gradient-to-t from-[#041F33]/80 via-[#041F33]/10 to-transparent" /> : null}
      {!photoUrl ? <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} /> : null}
      {!photoUrl ? <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[28px] border-white/15" /> : null}
      {!photoUrl ? <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-[#20B7D8]/25 blur-2xl" /> : null}
      {!photoUrl ? <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M65 190C130 130 188 143 245 92C310 34 370 95 424 55C472 20 518 61 560 29" stroke="rgba(255,255,255,.35)" strokeWidth="2" strokeDasharray="7 10" />
        <circle cx="65" cy="190" r="8" fill="#A7F3D0" /><circle cx="245" cy="92" r="8" fill="#20B7D8" /><circle cx="424" cy="55" r="8" fill="#A7F3D0" />
      </svg> : null}
      <div className="absolute bottom-5 left-7 flex items-end gap-3 text-white">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/50 bg-white/20 backdrop-blur-sm">{patient ? <Brain size={42} /> : <HeartHandshake size={42} />}</div>
        <div className="mb-2"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#DDF7F5]">{patient ? "Moments matter ♡" : "Together stronger ♡"}</p><p className="mt-1 text-sm font-semibold text-white/75">{patient ? "A familiar space for every day" : "A clearer circle of support"}</p></div>
      </div>
      <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#087EA4] shadow-lg">{patient ? <Sparkles size={23} /> : <UsersRound size={23} />}</div>
    </div>
  );
}
