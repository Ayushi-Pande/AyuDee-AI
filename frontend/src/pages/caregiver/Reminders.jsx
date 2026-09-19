import { CheckCircle2, Filter, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CaregiverLayout from "../../components/common/CaregiverLayout";
import SectionHeader from "../../components/common/SectionHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { demoReminders } from "../../data/demoData";
import { apiService } from "../../services/api";

const patientId = "patient-001";

export default function CaregiverReminders() {
  const [reminders, setReminders] = useState(demoReminders);
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState({ title: "", type: "medication", time: "08:00", status: "upcoming" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReminders = async () => {
      try {
        setLoading(true);
        const response = await apiService.getReminders(patientId).catch(() => ({ data: demoReminders }));
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.reminders)
            ? response.data.reminders
            : demoReminders;
        setReminders(items.length ? items : demoReminders);
      } finally {
        setLoading(false);
      }
    };

    loadReminders();
  }, []);

  const filteredReminders = useMemo(() => {
    return reminders.filter((reminder) => {
      const typeOk = typeFilter === "all" || reminder.type === typeFilter;
      const statusOk = statusFilter === "all" || reminder.status === statusFilter;
      return typeOk && statusOk;
    });
  }, [reminders, statusFilter, typeFilter]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = { ...form, patient_id: patientId };

    if (editingId) {
      await apiService.updateReminder(editingId, payload).catch(() => undefined);
      setReminders((current) => current.map((reminder) => (reminder.id === editingId ? { ...reminder, ...payload } : reminder)));
      setEditingId(null);
    } else {
      const response = await apiService.createReminder(payload).catch(() => ({ data: { ...payload, id: Date.now() } }));
      setReminders((current) => [response?.data || { ...payload, id: Date.now() }, ...current]);
    }

    setForm({ title: "", type: "medication", time: "08:00", status: "upcoming" });
  };

  const handleDelete = async (reminderId) => {
    await apiService.deleteReminder(reminderId).catch(() => undefined);
    setReminders((current) => current.filter((reminder) => reminder.id !== reminderId));
  };

  return (
    <CaregiverLayout title="Reminder management" subtitle="Create, review, and update patient reminders with ease.">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader title="Add reminder" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Reminder title" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300">
                <option value="medication">Medication</option>
                <option value="appointment">Appointment</option>
                <option value="meal">Meal</option>
                <option value="activity">Activity</option>
              </select>
              <input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300" required />
            </div>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-violet-300">
              <option value="upcoming">Upcoming</option>
              <option value="pending">Pending</option>
              <option value="today">Today</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 font-semibold text-white">
                <Plus size={18} />
                {editingId ? "Save changes" : "Create reminder"}
              </button>
              {editingId ? (
                <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", type: "medication", time: "08:00", status: "upcoming" }); }} className="rounded-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700">
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </section>

        <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
          <SectionHeader title="Reminder list" />

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
                    <p className="mt-1 text-sm text-slate-500">{reminder.time || "08:00"} • {reminder.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setEditingId(reminder.id); setForm({ title: reminder.title, type: reminder.type, time: reminder.time, status: reminder.status || "upcoming" }); }} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">Edit</button>
                    <button type="button" onClick={() => setReminders((current) => current.map((item) => item.id === reminder.id ? { ...item, status: "completed" } : item))} className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white"><CheckCircle2 size={16} /> Done</button>
                    <button type="button" onClick={() => handleDelete(reminder.id)} className="rounded-full border border-rose-200 bg-rose-50 p-2 text-rose-600" aria-label={`Delete reminder ${reminder.title}`}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">No reminders match this filter.</div>
          )}
        </section>
      </div>
    </CaregiverLayout>
  );
}
