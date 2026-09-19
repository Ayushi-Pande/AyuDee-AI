import { ImageIcon, PencilLine, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CaregiverLayout from "../../components/common/CaregiverLayout";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { demoMemories } from "../../data/demoData";
import { apiService } from "../../services/api";

const patientId = "patient-001";

export default function CaregiverMemories() {
  const [memories, setMemories] = useState(demoMemories);
  const [form, setForm] = useState({ title: "", description: "", person: "", relationship: "", date: "", label: "Familiar" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMemories = async () => {
      try {
        setLoading(true);
        const response = await apiService.getMemories(patientId).catch(() => ({ data: demoMemories }));
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.memories)
            ? response.data.memories
            : demoMemories;
        setMemories(list.length ? list : demoMemories);
      } finally {
        setLoading(false);
      }
    };

    loadMemories();
  }, []);

  const totalMemories = useMemo(() => memories.length, [memories]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const memoryPayload = { ...form, patient_id: patientId };

    if (editingId) {
      await apiService.updateMemory(editingId, memoryPayload).catch(() => undefined);
      setMemories((current) => current.map((memory) => (memory.id === editingId ? { ...memory, ...memoryPayload } : memory)));
      setEditingId(null);
    } else {
      const response = await apiService.createMemory(memoryPayload).catch(() => ({ data: { ...memoryPayload, id: Date.now() } }));
      setMemories((current) => [response?.data || { ...memoryPayload, id: Date.now() }, ...current]);
    }

    setForm({ title: "", description: "", person: "", relationship: "", date: "", label: "Familiar" });
  };

  const handleDelete = async (memoryId) => {
    await apiService.deleteMemory(memoryId).catch(() => undefined);
    setMemories((current) => current.filter((memory) => memory.id !== memoryId));
  };

  return (
    <CaregiverLayout title="Memory management" subtitle="Review and update personal memory cards with care.">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader title="Add or edit memory" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows="4" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.person} onChange={(event) => setForm({ ...form, person: event.target.value })} placeholder="Person or loved one" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
              <input value={form.relationship} onChange={(event) => setForm({ ...form, relationship: event.target.value })} placeholder="Relationship" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
              <select value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300">
                <option value="Familiar">Familiar</option>
                <option value="Joyful">Joyful</option>
                <option value="Comforting">Comforting</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 font-semibold text-white">
                <Plus size={18} />
                {editingId ? "Save changes" : "Add memory"}
              </button>
              {editingId ? (
                <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", description: "", person: "", relationship: "", date: "", label: "Familiar" }); }} className="rounded-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader title="Memory list" subtitle={`${totalMemories} memories saved`} />
          {loading ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">Loading memories…</div>
          ) : memories.length ? (
            <div className="space-y-4">
              {memories.map((memory) => (
                <div key={memory.id || memory.title} className="flex gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fdf6e8] to-[#f5f3ff] text-slate-500">
                    <ImageIcon size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{memory.title}</h3>
                        <p className="text-sm text-slate-500">{memory.person} • {memory.relationship}</p>
                      </div>
                      <StatusBadge status={memory.label || "Familiar"} variant="soft" />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{memory.description}</p>
                    <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span>{memory.date}</span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <button type="button" onClick={() => { setEditingId(memory.id); setForm({ title: memory.title, description: memory.description, person: memory.person, relationship: memory.relationship, date: memory.date, label: memory.label || "Familiar" }); }} className="rounded-full p-2 hover:bg-violet-100"><PencilLine size={16} /></button>
                        <button type="button" onClick={() => handleDelete(memory.id)} className="rounded-full p-2 hover:bg-rose-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">No memories found.</div>
          )}
        </section>
      </div>
    </CaregiverLayout>
  );
}
