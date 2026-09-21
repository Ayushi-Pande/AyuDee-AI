import { Cloud, CloudOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function ConnectionStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); };
  }, []);

  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${online ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`} role="status">{online ? <Cloud size={15} /> : <CloudOff size={15} />}{online ? "Online" : "Offline · local features available"}</span>;
}
