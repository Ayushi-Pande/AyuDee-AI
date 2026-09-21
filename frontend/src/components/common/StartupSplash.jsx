import { useEffect, useState } from "react";
import AyuDeeLogo from "../brand/AyuDeeLogo";

const SPLASH_KEY = "ayudee-splash-seen";

export default function StartupSplash({ children }) {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(SPLASH_KEY) !== "true");

  useEffect(() => {
    if (!visible) return undefined;
    const timer = window.setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, "true");
      setVisible(false);
    }, 1700);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <>
      <div className={`startup-splash ${visible ? "startup-splash-visible" : "startup-splash-hidden"}`} aria-hidden={!visible}>
        <div className="startup-splash-grid" />
        <div className="startup-splash-content">
          <div className="startup-splash-mark"><AyuDeeLogo variant="light" /></div>
          <p className="startup-splash-kicker">Cognitive Care</p>
          <h1>AyuDee AI</h1>
          <p>Where Help Meets Care</p>
        </div>
      </div>
      <div className={visible ? "startup-app-hidden" : "startup-app-visible"}>{children}</div>
    </>
  );
}
