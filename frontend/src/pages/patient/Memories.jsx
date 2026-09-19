import { Heart, ImageIcon, PencilLine, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { demoMemories } from "../../data/demoData";
import { apiService } from "../../services/api";

const patientId = "patient-001";

export default function PatientMemories() {
  const [memories, setMemories] = useState(() => JSON.parse(localStorage.getItem("ayudee-patient-memories") || "null") || demoMemories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", person: "", relationship: "", date: "", label: "Familiar" });
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem("ayudee-memory-favorites") || "[]"));

  useEffect(() => {
    const loadMemories = async () => {
      try {
        setLoading(true);
        const fallback = JSON.parse(localStorage.getItem("ayudee-patient-memories") || "null") || demoMemories;
        const response = await apiService.getMemories(patientId).catch(() => ({ data: fallback }));
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.memories)
            ? response.data.memories
            : demoMemories;
        const nextMemories = list.length ? list : fallback;
        setMemories(nextMemories);
        localStorage.setItem("ayudee-patient-memories", JSON.stringify(nextMemories));
        setError("");
      } catch {
        const fallback = JSON.parse(localStorage.getItem("ayudee-patient-memories") || "null") || demoMemories;
        setMemories(fallback);
        setError("We could not load the latest memories. Showing a safe example set instead.");
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, []);

  const resetEditor = () => {
    setForm({ title: "", description: "", person: "", relationship: "", date: "", label: "Familiar" });
    setEditingId(null);
    setIsEditorOpen(false);
  };

  const openEditor = (memory = null) => {
    if (memory) {
      setEditingId(memory.id);
      setForm({ title: memory.title || "", description: memory.description || "", person: memory.person || "", relationship: memory.relationship || "", date: memory.date || "", label: memory.label || "Familiar" });
    }
    setIsEditorOpen(true);
  };

  const saveMemory = async (event) => {
    event.preventDefault();
    const payload = { ...form, patient_id: patientId };
    if (editingId) {
      await apiService.updateMemory(editingId, payload).catch(() => undefined);
      setMemories((current) => { const next = current.map((memory) => memory.id === editingId ? { ...memory, ...payload } : memory); localStorage.setItem("ayudee-patient-memories", JSON.stringify(next)); return next; });
    } else {
      const fallback = { ...payload, id: Date.now() };
      const response = await apiService.createMemory(payload).catch(() => ({ data: fallback }));
      setMemories((current) => { const next = [response?.data || fallback, ...current]; localStorage.setItem("ayudee-patient-memories", JSON.stringify(next)); return next; });
    }
    resetEditor();
  };

  const deleteMemory = async (memoryId) => {
    await apiService.deleteMemory(memoryId).catch(() => undefined);
    setMemories((current) => { const next = current.filter((memory) => memory.id !== memoryId); localStorage.setItem("ayudee-patient-memories", JSON.stringify(next)); return next; });
  };

  const toggleFavorite = (memoryId) => {
    const next = favorites.includes(memoryId) ? favorites.filter((id) => id !== memoryId) : [...favorites, memoryId];
    setFavorites(next);
    localStorage.setItem("ayudee-memory-favorites", JSON.stringify(next));
  };

  const visibleMemories = memories.filter((memory) => `${memory.title} ${memory.description} ${memory.person} ${memory.relationship}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <PatientLayout title="Memories" subtitle="Warm moments and people you can revisit any time.">
      <div className="space-y-6">
        {error ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</div> : null}

        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader title="Personal memories" action={<div className="flex flex-wrap gap-2"><label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"><Search size={15} /><input aria-label="Search memories" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="w-24 bg-transparent outline-none" /></label><button type="button" onClick={() => openEditor()} className="inline-flex items-center gap-2 rounded-full bg-[#082F49] px-4 py-2 text-sm font-semibold text-white"><Plus size={16} /> Save a memory</button></div>} />
          {loading ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">Loading memories…</div>
          ) : memories.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleMemories.map((memory) => (
                <article key={memory.id || memory.title} className="overflow-hidden rounded-[28px] border border-violet-100 bg-[#fffdf7] shadow-sm">
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#fdf6e8] via-[#f5f3ff] to-[#fff] text-slate-500">
                    <ImageIcon size={36} />
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-bold text-slate-800">{memory.title}</h3>
                      <StatusBadge status={memory.label || "Familiar"} variant="soft" />
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{memory.description}</p>
                    <div className="text-sm text-slate-500">
                      <p><span className="font-semibold text-slate-700">Person:</span> {memory.person || "Family member"}</p>
                      <p><span className="font-semibold text-slate-700">Relationship:</span> {memory.relationship || "Loved one"}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                      <span>{memory.date || "Recent"}</span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <button type="button" onClick={() => toggleFavorite(memory.id)} aria-label={`Favorite memory ${memory.title}`} className={`rounded-full p-2 ${favorites.includes(memory.id) ? "bg-rose-100 text-rose-600" : "hover:bg-rose-50"}`}><Heart size={16} fill={favorites.includes(memory.id) ? "currentColor" : "none"} /></button>
                        <button type="button" onClick={() => openEditor(memory)} aria-label={`Edit memory ${memory.title}`} className="rounded-full p-2 hover:bg-cyan-100"><PencilLine size={16} /></button>
                        <button type="button" onClick={() => deleteMemory(memory.id)} aria-label={`Delete memory ${memory.title}`} className="rounded-full p-2 hover:bg-rose-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">No memories yet. Add a story to help create comfort and familiarity.</div>
          )}
        </div>

        {isEditorOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F49]/50 p-4" role="dialog" aria-modal="true" aria-label="Memory editor">
            <form onSubmit={saveMemory} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0369A1]">Memory Vault</p><h2 className="mt-1 text-2xl font-black text-[#082F49]">{editingId ? "Edit memory" : "Add a memory"}</h2></div><button type="button" onClick={resetEditor} aria-label="Close memory editor" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>
              <div className="mt-5 space-y-4">
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Memory title" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" />
                <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What makes this moment meaningful?" rows="4" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" />
                <div className="grid gap-4 sm:grid-cols-2"><input required value={form.person} onChange={(event) => setForm({ ...form, person: event.target.value })} placeholder="Person or place" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /><input required value={form.relationship} onChange={(event) => setForm({ ...form, relationship: event.target.value })} placeholder="Category or relationship" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></div>
                <div className="grid gap-4 sm:grid-cols-2"><input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /><select value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"><option>Familiar</option><option>Joyful</option><option>Comforting</option></select></div>
              </div>
              <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={resetEditor} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button><button className="rounded-xl bg-[#082F49] px-5 py-3 font-bold text-white">{editingId ? "Save changes" : "Add memory"}</button></div>
            </form>
          </div>
        ) : null}
      </div>
    </PatientLayout>
  );
}
