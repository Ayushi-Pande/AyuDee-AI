import { CheckCircle2, Filter, PencilLine, Plus, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { demoReminders } from "../../data/demoData";
import { apiService } from "../../services/api";

const patientId = "patient-001";

export default function PatientReminders() {
  const [reminders, setReminders] = useState(() => JSON.parse(localStorage.getItem("ayudee-patient-reminders") || "null") || demoReminders);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [form, setForm] = useState({ title: "", type: "activity", time: "09:00", status: "upcoming" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const fallback = JSON.parse(localStorage.getItem("ayudee-patient-reminders") || "null") || demoReminders;
        const response = await apiService.getReminders(patientId).catch(() => ({ data: fallback }));
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.reminders)
            ? response.data.reminders
            : demoReminders;
        const nextReminders = items.length ? items : fallback;
        setReminders(nextReminders);
        localStorage.setItem("ayudee-patient-reminders", JSON.stringify(nextReminders));
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  const resetEditor = () => { setForm({ title: "", type: "activity", time: "09:00", status: "upcoming" }); setEditingId(null); setIsEditorOpen(false); };
  const openEditor = (reminder = null) => { if (reminder) { setEditingId(reminder.id); setForm({ title: reminder.title || "", type: reminder.type || "activity", time: reminder.time || "09:00", status: reminder.status || "upcoming" }); } setIsEditorOpen(true); };
  const saveReminder = async (event) => {
    event.preventDefault();
    const payload = { ...form, patient_id: patientId };
    if (editingId) {
      await apiService.updateReminder(editingId, payload).catch(() => undefined);
      setReminders((current) => { const next = current.map((item) => item.id === editingId ? { ...item, ...payload } : item); localStorage.setItem("ayudee-patient-reminders", JSON.stringify(next)); return next; });
    } else {
      const fallback = { ...payload, id: Date.now() };
      const response = await apiService.createReminder(payload).catch(() => ({ data: fallback }));
      setReminders((current) => { const next = [response?.data || fallback, ...current]; localStorage.setItem("ayudee-patient-reminders", JSON.stringify(next)); return next; });
    }
    resetEditor();
  };
  const deleteReminder = async (id) => { await apiService.deleteReminder(id).catch(() => undefined); setReminders((current) => { const next = current.filter((item) => item.id !== id); localStorage.setItem("ayudee-patient-reminders", JSON.stringify(next)); return next; }); };

  const filteredReminders = useMemo(() => {
    return reminders.filter((reminder) => {
      const typeOk = typeFilter === "all" || reminder.type === typeFilter;
      const statusOk = statusFilter === "all" || reminder.status === statusFilter;
      return typeOk && statusOk;
    });
  }, [reminders, typeFilter, statusFilter]);

  return (
    <PatientLayout title="Reminders" subtitle="Gentle nudges to support a calm routine.">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader
            title="My reminders"
            action={
              <button type="button" onClick={() => setIsEditorOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-[#082F49] px-4 py-2 text-sm font-semibold text-white">
                <Plus size={16} /> Add reminder
              </button>
            }
          />

          <div className="mb-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <Filter size={16} />
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="bg-transparent outline-none">
                <option value="all">All types</option>
                <option value="medication">Medication</option>
                <option value="appointment">Appointment</option>
                <option value="meal">Meal</option>
                <option value="activity">Activity</option>
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="bg-transparent outline-none">
                <option value="all">All statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="pending">Pending</option>
                <option value="today">Today</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">Loading reminders…</div>
          ) : filteredReminders.length ? (
            <div className="space-y-3">
              {filteredReminders.map((reminder) => (
                <div key={reminder.id || reminder.title} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-slate-800">{reminder.title}</p>
                      <StatusBadge status={reminder.status || "upcoming"} variant={reminder.status === "completed" ? "success" : reminder.status === "pending" ? "warning" : "soft"} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{reminder.time || "Flexible time"} • {reminder.type || "daily"}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => openEditor(reminder)} aria-label={`Edit reminder ${reminder.title}`} className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-cyan-50"><PencilLine size={16} /></button>
                    <button type="button" onClick={() => deleteReminder(reminder.id)} aria-label={`Delete reminder ${reminder.title}`} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600"><Trash2 size={16} /></button>
                    <button
                      type="button"
                      onClick={() => setReminders((current) => { const next = current.map((item) => item.id === reminder.id ? { ...item, status: item.status === "completed" ? "upcoming" : "completed" } : item); localStorage.setItem("ayudee-patient-reminders", JSON.stringify(next)); return next; })}
                      className="inline-flex items-center gap-2 rounded-full bg-[#082F49] px-4 py-2 text-sm font-semibold text-white"
                    >
                      <CheckCircle2 size={16} />
                      Mark complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">No reminders match your current filter.</div>
          )}
        </div>

        {isEditorOpen ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F49]/50 p-4" role="dialog" aria-modal="true" aria-label="Reminder editor"><form onSubmit={saveReminder} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0369A1]">Daily routine</p><h2 className="mt-1 text-2xl font-black text-[#082F49]">{editingId ? "Edit reminder" : "Add a reminder"}</h2></div><button type="button" onClick={resetEditor} aria-label="Close reminder editor" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div><div className="mt-5 space-y-4"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Reminder title" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /><div className="grid gap-4 sm:grid-cols-2"><select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"><option value="medication">Medication</option><option value="appointment">Appointment</option><option value="meal">Meal</option><option value="activity">Activity</option><option value="other">Other</option></select><input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400" /></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={resetEditor} className="rounded-xl border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button><button className="rounded-xl bg-[#082F49] px-5 py-3 font-bold text-white">{editingId ? "Save changes" : "Add reminder"}</button></div></form></div> : null}
      </div>
    </PatientLayout>
  );
}
