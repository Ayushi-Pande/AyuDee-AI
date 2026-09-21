import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "ayudee-language";

const translations = {
  en: {
    language: "Language",
    english: "English",
    hindi: "Hindi",
    accessibility: "Accessibility",
    largeText: "Large Text",
    easyView: "Easy View",
    highContrast: "High Contrast",
    reducedMotion: "Reduced Motion",
    on: "On",
    off: "Off",
    patientSpace: "Patient space",
    caregiverConsole: "Caregiver console",
    support: "Support",
    supportMessage: "A reassuring check-in is always within reach for you and your caregiver.",
    patientOverview: "Patient overview",
    caregiverOverviewMessage: "Support patterns look steady and engagement is improving this week.",
    updates: "updates",
    alerts: "alerts",
    needHelp: "Need help?",
    newNote: "New note",
    profile: "Profile",
    logOut: "Log out",
    patient: "Patient",
    caregiver: "Caregiver",
    dashboard: "Dashboard",
    memoryVault: "Memory Vault",
    brainStudio: "Brain Studio",
    today: "Today",
    reminders: "Reminders",
    aiCompanion: "AI Companion",
    helpSafety: "Help & Safety",
    mood: "Mood",
    familyCircle: "Family Circle",
    consultations: "Consultations",
    overview: "Overview",
    memoryLibrary: "Memory Library",
    carePlan: "Care Plan",
    brainActivity: "Brain Activity",
    insights: "Insights",
    connection: "Connection",
  },
  hi: {
    language: "भाषा",
    english: "English",
    hindi: "हिंदी",
    accessibility: "सुलभता",
    largeText: "बड़ा अक्षर",
    easyView: "आसान दृश्य",
    highContrast: "उच्च कंट्रास्ट",
    reducedMotion: "कम गति",
    on: "चालू",
    off: "बंद",
    patientSpace: "मरीज़ स्थान",
    caregiverConsole: "देखभालकर्ता कंसोल",
    support: "सहायता",
    supportMessage: "आप और आपके देखभालकर्ता के लिए भरोसेमंद सहायता हमेशा पास है।",
    patientOverview: "मरीज़ का विवरण",
    caregiverOverviewMessage: "सहायता की दिनचर्या स्थिर है और इस सप्ताह जुड़ाव बेहतर हो रहा है।",
    updates: "अपडेट",
    alerts: "अलर्ट",
    needHelp: "मदद चाहिए?",
    newNote: "नोट जोड़ें",
    profile: "प्रोफ़ाइल",
    logOut: "लॉग आउट",
    patient: "मरीज़",
    caregiver: "देखभालकर्ता",
    dashboard: "डैशबोर्ड",
    memoryVault: "यादों का संग्रह",
    brainStudio: "ब्रेन स्टूडियो",
    today: "आज",
    reminders: "रिमाइंडर",
    aiCompanion: "एआई साथी",
    helpSafety: "मदद और सुरक्षा",
    mood: "मूड",
    familyCircle: "फैमिली सर्कल",
    consultations: "परामर्श",
    overview: "अवलोकन",
    memoryLibrary: "यादों की लाइब्रेरी",
    carePlan: "देखभाल योजना",
    brainActivity: "ब्रेन गतिविधि",
    insights: "जानकारियां",
    connection: "कनेक्शन",
  },
};

const LanguageContext = createContext(null);

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "hi" ? "hi" : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  const changeLanguage = (nextLanguage) => {
    const normalized = nextLanguage === "hi" ? "hi" : "en";
    setLanguage(normalized);
    localStorage.setItem(STORAGE_KEY, normalized);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      locale: language === "hi" ? "hi-IN" : "en-IN",
      t: (key) => translations[language][key] || translations.en[key] || key,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
