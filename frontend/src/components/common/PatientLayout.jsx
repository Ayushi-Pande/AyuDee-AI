import {
  BellRing,
  Brain,
  CalendarClock,
  HeartHandshake,
  House,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import AccessibilityPanel from "./AccessibilityPanel";
import { useAppSettings } from "../../context/AppSettingsContext";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AyuDeeLogo from "../brand/AyuDeeLogo";
import ReminderMonitor from "./ReminderMonitor";
import ConnectionStatus from "./ConnectionStatus";

const navItems = [
  { to: "/patient", label: "dashboard", icon: House },
  { to: "/patient/memories", label: "memoryVault", icon: Sparkles },
  { to: "/patient/games", label: "brainStudio", icon: Brain },
  { to: "/patient/today", label: "today", icon: CalendarClock },
  { to: "/patient/mood", label: "mood", icon: HeartHandshake },
  { to: "/patient/family", label: "familyCircle", icon: Users },
  { to: "/patient/consultations", label: "consultations", icon: CalendarClock },
  { to: "/patient/reminders", label: "reminders", icon: CalendarClock },
  { to: "/patient/companion", label: "aiCompanion", icon: MessageSquareText },
  { to: "/patient/help", label: "helpSafety", icon: ShieldAlert },
];

const mobileNavItems = [
  navItems[0],
  navItems[2],
  navItems[5],
  navItems[1],
  { to: "/patient/profile", label: "profile", icon: UserRound },
];

export default function PatientLayout({ children, title, subtitle }) {
  const { largeText, highContrast } = useAppSettings();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "Friend";

  return (
    <div className={`${largeText ? "large-text" : ""} ${highContrast ? "high-contrast" : ""} app-page text-slate-800`}>
      <div className="flex min-h-screen gap-0">
        <aside className="patient-sidebar-visual hidden w-80 shrink-0 p-7 text-white shadow-[12px_0_35px_rgba(4,31,51,0.16)] lg:flex lg:flex-col">
          <div className="mb-8">
            <AyuDeeLogo variant="light" />
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-[18px] px-4 py-3 text-base font-medium transition ${
                    isActive
                      ? "bg-[#20B7D8] text-[#041F33] shadow-[0_8px_20px_rgba(32,183,216,0.22)]"
                      : "text-sky-100/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {t(label)}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 space-y-4">
            <div className="rounded-xl bg-white/10 p-4 ring-1 ring-white/10">
              <div className="mb-2 flex items-center gap-2 text-sky-100">
                <HeartHandshake size={18} />
                <span className="font-semibold">{t("support")}</span>
              </div>
              <p className="text-sm text-sky-100/80">{t("supportMessage")}</p>
            </div>
            <AccessibilityPanel />
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/6 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-[#0b3b66]">
                  <UserRound size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{firstName}</p>
                  <p className="text-[11px] text-sky-100/70">{t("patient")}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <NavLink to="/patient/profile" className="text-xs font-semibold text-sky-100">{t("profile")}</NavLink>
                <button type="button" onClick={() => { logout(); navigate("/"); }} className="text-xs font-semibold text-sky-100">{t("logOut")}</button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="border-b border-[#d6edf3] bg-white/75 px-5 py-6 backdrop-blur-sm lg:px-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#087EA4]">{t("patientSpace")} / {title}</p>
                <h1 className="mt-2 text-4xl font-black tracking-tight text-[#062A45]">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ConnectionStatus />
                <div className="inline-flex items-center gap-2 rounded-full bg-[#edf7ff] px-3 py-2 text-sm font-medium text-[#146c94]">
                  <BellRing size={16} />
                  3 {t("updates")}
                </div>
                <NavLink to="/patient/help" className="inline-flex items-center gap-2 rounded-full bg-[#0b3b66] px-3 py-2 text-sm font-semibold text-white shadow-sm">
                  <ShieldAlert size={16} /> {t("needHelp")}
                </NavLink>
              </div>
            </div>
          </header>

          <div className="app-content">{children}</div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dceeff] bg-white/90 px-2 py-2 shadow-[0_-10px_30px_rgba(11,59,102,0.08)] backdrop-blur-sm lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mobileNavItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold ${
                  isActive ? "bg-[#eef7ff] text-[#0b3b66]" : "text-slate-500"
                }`
              }
            >
              <Icon size={18} />
                {t(label)}
            </NavLink>
          ))}
        </div>
      </nav>
      <ReminderMonitor />
    </div>
  );
}
