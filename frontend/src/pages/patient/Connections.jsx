import { CalendarClock, ExternalLink, Heart, Phone, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import PatientLayout from "../../components/common/PatientLayout";
import { useLanguage } from "../../context/LanguageContext";

const CONTACTS_KEY = "ayudee-family-circle";
const APPOINTMENTS_KEY = "ayudee-consultations";

function readItems(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function Connections({ appointmentsOnly = false }) {
  const { language } = useLanguage();
  const hindi = language === "hi";
  const [tab, setTab] = useState(appointmentsOnly ? "appointments" : "family");
  const [contacts, setContacts] = useState(readItems(CONTACTS_KEY));
  const [appointments, setAppointments] = useState(readItems(APPOINTMENTS_KEY));
  const [formType, setFormType] = useState(null);
  const [contact, setContact] = useState({ name: "", relationship: "", phone: "", primary: false });
  const [appointment, setAppointment] = useState({ professional: "", specialty: "", clinic: "", phone: "", date: "", time: "", notes: "", url: "" });

  const saveContact = (event) => {
    event.preventDefault();
    if (!contact.name.trim()) return;
    const next = [...contacts, { ...contact, id: Date.now() }];
    setContacts(next);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
    setContact({ name: "", relationship: "", phone: "", primary: false });
    setFormType(null);
  };

  const removeContact = (id) => {
    if (!window.confirm(hindi ? "इस संपर्क को हटाएं?" : "Remove this contact?")) return;
    const next = contacts.filter((item) => item.id !== id);
    setContacts(next);
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(next));
  };

  const saveAppointment = (event) => {
    event.preventDefault();
    if (!appointment.professional.trim()) return;
    const next = [...appointments, { ...appointment, id: Date.now() }];
    setAppointments(next);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(next));
    setAppointment({ professional: "", specialty: "", clinic: "", phone: "", date: "", time: "", notes: "", url: "" });
    setFormType(null);
  };

  return (
    <PatientLayout title={appointmentsOnly || tab === "appointments" ? (hindi ? "परामर्श और अपॉइंटमेंट" : "Consultations") : (hindi ? "फैमिली सर्कल" : "Family Circle")} subtitle={hindi ? "भरोसेमंद लोगों और उपयोगकर्ता द्वारा जोड़ी गई जानकारी से जुड़े रहें।" : "Stay connected with trusted people and user-entered details."}>
      <div className="space-y-6">
        {!appointmentsOnly ? <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200"><Tab active={tab === "family"} onClick={() => setTab("family")} icon={Users}>{hindi ? "परिवार" : "Family"}</Tab><Tab active={tab === "appointments"} onClick={() => setTab("appointments")} icon={CalendarClock}>{hindi ? "अपॉइंटमेंट" : "Appointments"}</Tab></div> : null}
        {tab === "family" && !appointmentsOnly ? <section className="rounded-[28px] border border-cyan-100 bg-white p-5 shadow-sm"><Header eyebrow={hindi ? "भरोसेमंद संपर्क" : "Trusted contacts"} title={hindi ? "फैमिली सर्कल" : "Family Circle"} button={hindi ? "संपर्क जोड़ें" : "Add contact"} onClick={() => setFormType("contact")} />{contacts.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{contacts.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100 text-[#087EA4]"><Users size={22} /></div><div><h3 className="font-black text-slate-800">{item.name}</h3><p className="text-sm text-slate-500">{item.relationship}{item.primary ? ` · ${hindi ? "प्राथमिक" : "Primary"}` : ""}</p></div></div><button type="button" onClick={() => removeContact(item.id)} aria-label="Delete contact" className="rounded-full p-2 text-slate-400 hover:bg-rose-100 hover:text-rose-600"><X size={17} /></button></div><div className="mt-4 flex gap-2"><a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#087EA4] ring-1 ring-cyan-100"><Phone size={16} /> {hindi ? "कॉल" : "Call"}</a><a href="/patient/memories" className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-rose-700 ring-1 ring-rose-100"><Heart size={16} /> {hindi ? "यादें" : "Memories"}</a></div></article>)}</div> : <Empty text={hindi ? "जुड़े रहने के लिए एक भरोसेमंद संपर्क जोड़ें।" : "Add a trusted contact to stay connected."} />}</section> : null}
        {tab === "appointments" ? <section className="rounded-[28px] border border-cyan-100 bg-white p-5 shadow-sm"><Header eyebrow={hindi ? "उपयोगकर्ता द्वारा जोड़ी गई जानकारी" : "User-entered information"} title={hindi ? "परामर्श और अपॉइंटमेंट" : "Consultations & appointments"} button={hindi ? "अपॉइंटमेंट जोड़ें" : "Add appointment"} onClick={() => setFormType("appointment")} />{appointments.length ? <div className="mt-5 space-y-3">{appointments.map((item) => <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-lg font-black text-slate-800">{item.professional}</h3><p className="text-sm text-slate-500">{item.specialty} {item.clinic ? `· ${item.clinic}` : ""}</p></div><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#087EA4]">{item.date} {item.time}</span></div>{item.notes ? <p className="mt-3 text-sm text-slate-600">{item.notes}</p> : null}<div className="mt-4 flex flex-wrap gap-2">{item.phone ? <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#087EA4] ring-1 ring-cyan-100"><Phone size={16} /> {hindi ? "कॉल" : "Call"}</a> : null}{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#087EA4] ring-1 ring-cyan-100"><ExternalLink size={16} /> {hindi ? "लिंक खोलें" : "Open link"}</a> : null}</div></article>)}</div> : <Empty text={hindi ? "कोई आगामी परामर्श नहीं है।" : "No upcoming consultations."} />}<p className="mt-5 text-sm text-slate-500">{hindi ? "परामर्श की जानकारी उपयोगकर्ता या देखभालकर्ता द्वारा प्रबंधित की जाती है। आयुडी चिकित्सा निदान नहीं देता।" : "Consultation information is managed by the user or caregiver. AyuDee does not provide medical diagnosis."}</p></section> : null}
        {formType === "contact" ? <Modal title={hindi ? "संपर्क जोड़ें" : "Add trusted contact"} close={() => setFormType(null)}><form onSubmit={saveContact} className="space-y-3"><input required placeholder={hindi ? "नाम" : "Name"} value={contact.name} onChange={(event) => setContact({ ...contact, name: event.target.value })} className="field" /><input required placeholder={hindi ? "रिश्ता" : "Relationship"} value={contact.relationship} onChange={(event) => setContact({ ...contact, relationship: event.target.value })} className="field" /><input required placeholder={hindi ? "फोन नंबर" : "Phone number"} value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} className="field" /><label className="flex items-center gap-2 text-sm font-semibold text-slate-600"><input type="checkbox" checked={contact.primary} onChange={(event) => setContact({ ...contact, primary: event.target.checked })} /> {hindi ? "प्राथमिक संपर्क" : "Primary contact"}</label><Save label={hindi ? "सहेजें" : "Save contact"} /></form></Modal> : null}
        {formType === "appointment" ? <Modal title={hindi ? "अपॉइंटमेंट जोड़ें" : "Add appointment"} close={() => setFormType(null)}><form onSubmit={saveAppointment} className="grid gap-3 sm:grid-cols-2"><input required placeholder={hindi ? "प्रोफेशनल का नाम" : "Professional name"} value={appointment.professional} onChange={(event) => setAppointment({ ...appointment, professional: event.target.value })} className="field sm:col-span-2" /><input placeholder={hindi ? "विशेषज्ञता" : "Specialty"} value={appointment.specialty} onChange={(event) => setAppointment({ ...appointment, specialty: event.target.value })} className="field" /><input placeholder={hindi ? "क्लिनिक/अस्पताल" : "Clinic/Hospital"} value={appointment.clinic} onChange={(event) => setAppointment({ ...appointment, clinic: event.target.value })} className="field" /><input placeholder={hindi ? "फोन" : "Phone"} value={appointment.phone} onChange={(event) => setAppointment({ ...appointment, phone: event.target.value })} className="field" /><input type="date" value={appointment.date} onChange={(event) => setAppointment({ ...appointment, date: event.target.value })} className="field" /><input type="time" value={appointment.time} onChange={(event) => setAppointment({ ...appointment, time: event.target.value })} className="field" /><input placeholder="https://..." value={appointment.url} onChange={(event) => setAppointment({ ...appointment, url: event.target.value })} className="field" /><textarea placeholder={hindi ? "नोट्स" : "Notes"} value={appointment.notes} onChange={(event) => setAppointment({ ...appointment, notes: event.target.value })} className="field sm:col-span-2" rows="3" /><Save label={hindi ? "अपॉइंटमेंट सहेजें" : "Save appointment"} /></form></Modal> : null}
      </div>
    </PatientLayout>
  );
}

function Tab({ active, onClick, icon: Icon, children }) { return <button type="button" onClick={onClick} className={`flex-1 rounded-xl px-4 py-3 font-bold ${active ? "bg-[#082F49] text-white" : "text-slate-600"}`}><Icon className="mr-2 inline" size={17} />{children}</button>; }
function Header({ eyebrow, title, button, onClick }) { return <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#087EA4]">{eyebrow}</p><h2 className="mt-1 text-2xl font-black text-[#062A45]">{title}</h2></div><button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white"><Plus size={17} /> {button}</button></div>; }
function Empty({ text }) { return <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-12 text-center text-slate-500">{text}</div>; }
function Modal({ title, close, children }) { return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#082F49]/50 p-4" role="dialog" aria-modal="true"><div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><h2 className="text-2xl font-black text-[#082F49]">{title}</h2><button type="button" onClick={close} aria-label="Close" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div><div className="mt-5">{children}</div></div></div>; }
function Save({ label }) { return <button className="rounded-xl bg-[#082F49] px-4 py-3 font-bold text-white sm:col-span-2">{label}</button>; }
