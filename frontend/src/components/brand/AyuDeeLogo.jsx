import { useNavigate } from "react-router-dom";

export default function AyuDeeLogo({ variant = "full", className = "", compact = false }) {
  const navigate = useNavigate();
  const isLight = variant === "light";
  const showWordmark = variant === "full" || variant === "dark" || variant === "light";
  const wordColor = isLight ? "#ffffff" : "#082F49";
  const mutedColor = isLight ? "rgba(255,255,255,0.68)" : "#64748B";

  return (
    <div className={`flex cursor-pointer items-center gap-3 ${className}`} aria-label="AyuDee AI home" role="link" tabIndex={0} onClick={() => navigate("/")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") navigate("/"); }}>
      <svg width={compact ? 40 : 56} height={compact ? 40 : 56} viewBox="0 0 40 40" role="img" aria-hidden="true">
        <defs><linearGradient id="ayudee-mark" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#087EA4" /><stop offset="1" stopColor="#14B8A6" /></linearGradient></defs>
        <rect width="40" height="40" rx="12" fill={isLight ? "url(#ayudee-mark)" : "#DDF7F5"} />
        <path d="M7 28 12.2 11h2.2L19.5 28M9.2 22h8.2" fill="none" stroke={isLight ? "#fff" : "#0369A1"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 11h3.2c4.5 0 7.1 3.2 7.1 8.5S29.7 28 25.2 28H22V11Z" fill="none" stroke={isLight ? "#fff" : "#0369A1"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 20h3.5" fill="none" stroke="#06B6D4" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="7" cy="28" r="2.2" fill="#14B8A6" />
        <circle cx="32.3" cy="28" r="2.2" fill="#06B6D4" />
        <circle cx="13.3" cy="11" r="2.2" fill="#14B8A6" />
      </svg>
      {showWordmark ? (
        <span className="leading-none">
          <strong className="block text-[19px] font-black tracking-tight" style={{ color: wordColor }}>AyuDee <span className="text-[#06B6D4]">AI</span></strong>
          <small className="mt-1 block text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: mutedColor }}>Cognitive care platform</small>
        </span>
      ) : null}
    </div>
  );
}
