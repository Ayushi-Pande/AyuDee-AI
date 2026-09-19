import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ayudee-accessibility";

const defaultState = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  simpleMode: false,
};

const AppSettingsContext = createContext(null);

export function AppSettingsProvider({ children }) {
  const [largeText, setLargeText] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored).largeText : defaultState.largeText;
  });
  const [highContrast, setHighContrast] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored).highContrast : defaultState.highContrast;
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored).reducedMotion : defaultState.reducedMotion;
  });
  const [simpleMode, setSimpleMode] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored).simpleMode || defaultState.simpleMode : defaultState.simpleMode;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ largeText, highContrast, reducedMotion, simpleMode }));
    document.body.classList.toggle("large-text", largeText);
    document.body.classList.toggle("high-contrast", highContrast);
    document.body.classList.toggle("reduced-motion", reducedMotion);
    document.body.classList.toggle("simple-mode", simpleMode);
  }, [largeText, highContrast, reducedMotion, simpleMode]);

  const value = useMemo(
    () => ({
      largeText,
      setLargeText,
      highContrast,
      setHighContrast,
      reducedMotion,
      setReducedMotion,
      simpleMode,
      setSimpleMode,
    }),
    [largeText, highContrast, reducedMotion, simpleMode],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }

  return context;
}
