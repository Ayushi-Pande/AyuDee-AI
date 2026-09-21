import { Bell, Eye, Type, Zap, Accessibility } from "lucide-react";
import { useAppSettings } from "../../context/AppSettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { useState } from "react";

export default function AccessibilityPanel() {
  const { largeText, setLargeText, highContrast, setHighContrast, reducedMotion, setReducedMotion, simpleMode, setSimpleMode } = useAppSettings();
  const { language, setLanguage, t } = useLanguage();
  const [notificationState, setNotificationState] = useState(() => typeof Notification === "undefined" ? "unsupported" : Notification.permission === "granted" ? "granted" : Notification.permission === "denied" ? "denied" : "default");

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      setNotificationState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
  };

  return (
    <div className="rounded-[24px] border border-violet-200 bg-[#f8f5ff] p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
        <Eye size={16} />
        {t("accessibility")}
      </div>

      <div className="space-y-3">
        <button type="button" onClick={enableNotifications} className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700">
          <span className="inline-flex items-center gap-2"><Bell size={16} /> Notifications</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${notificationState === "granted" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>{notificationState === "granted" ? "On" : notificationState === "denied" ? "Blocked" : notificationState === "unsupported" ? "Unavailable" : "Enable"}</span>
        </button>
        <div className="flex items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
          <span>{t("language")}</span>
          <div className="inline-flex rounded-full bg-slate-100 p-1" aria-label={t("language")}>
            {[{ value: "en", label: t("english") }, { value: "hi", label: t("hindi") }].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLanguage(option.value)}
                aria-pressed={language === option.value}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition ${language === option.value ? "bg-violet-600 text-white" : "text-slate-600"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setLargeText((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Type size={16} /> {t("largeText")}</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${largeText ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {largeText ? t("on") : t("off")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSimpleMode((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Accessibility size={16} /> {t("easyView")}</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${simpleMode ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {simpleMode ? t("on") : t("off")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setHighContrast((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Zap size={16} /> {t("highContrast")}</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${highContrast ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {highContrast ? t("on") : t("off")}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setReducedMotion((value) => !value)}
          className="flex w-full items-center justify-between rounded-2xl border border-violet-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700"
        >
          <span className="inline-flex items-center gap-2"><Zap size={16} /> {t("reducedMotion")}</span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${reducedMotion ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"}`}>
            {reducedMotion ? t("on") : t("off")}
          </span>
        </button>
      </div>
    </div>
  );
}
