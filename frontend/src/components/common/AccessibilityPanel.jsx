import { Eye, Type, Zap, Accessibility } from "lucide-react";
import { useAppSettings } from "../../context/AppSettingsContext";

export default function AccessibilityPanel() {
  const { largeText, setLargeText, highContrast, setHighContrast, reducedMotion, setReducedMotion, simpleMode, setSimpleMode } = useAppSettings();

  return (
    <div className="rounded-[24px] border border-violet-200 bg-[#f8f5ff] p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
        <Eye size={16} />
        Accessibility
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setLargeText((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Type size={16} /> Large Text</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${largeText ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {largeText ? "On" : "Off"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSimpleMode((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Accessibility size={16} /> Easy View</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${simpleMode ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {simpleMode ? "On" : "Off"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setHighContrast((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Zap size={16} /> High Contrast</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${highContrast ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {highContrast ? "On" : "Off"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setReducedMotion((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Zap size={16} /> Reduced Motion</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${reducedMotion ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {reducedMotion ? "On" : "Off"}
          </span>
        </button>
      </div>
    </div>
  );
}
