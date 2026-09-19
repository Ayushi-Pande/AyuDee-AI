import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffdf7] px-6 py-12">
      <div className="max-w-lg rounded-[32px] border border-violet-100 bg-white p-10 text-center shadow-[0_18px_60px_rgba(109,40,217,0.08)]">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <SearchX size={36} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">Page not found</p>
        <h1 className="mt-4 text-4xl font-black text-slate-800">This page is off-route.</h1>
        <p className="mt-3 text-base text-slate-600">
          The page you requested isn’t available in AyuDee AI right now. Let’s bring you back to a safe place.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
        >
          <Home size={18} />
          Back home
        </Link>
      </div>
    </div>
  );
}
