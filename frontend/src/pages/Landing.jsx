import {
  ArrowRight,
  Brain,
  CalendarDays,
  Heart,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Link } from "react-router-dom";
import AyuDeeLogo from "../components/brand/AyuDeeLogo";

// YOUR ACTUAL IMAGE FILE NAMES
import patientCare from "../assets/patient-care.png.png";
import familyMemory from "../assets/family-memory.jpg.png";

const benefits = [
  {
    icon: Brain,
    title: "Stay Engaged",
    text: "Cognitive games & activities",
  },
  {
    icon: CalendarDays,
    title: "Stay Organized",
    text: "Smart reminders & routines",
  },
  {
    icon: Users,
    title: "Stay Connected",
    text: "Caregiver support & insights",
  },
  {
    icon: ShieldCheck,
    title: "Stay Safe",
    text: "Privacy-first support",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Memory Vault",
    text: "Save meaningful people, places, stories and moments in one familiar space.",
  },
  {
    icon: CalendarDays,
    title: "Smart Daily Routines",
    text: "Simple reminders help make everyday activities easier to remember.",
  },
  {
    icon: Brain,
    title: "Brain Studio",
    text: "Interactive cognitive games designed to encourage memory and engagement.",
  },
  {
    icon: MessageCircleHeart,
    title: "Ayu AI Companion",
    text: "A friendly digital companion for conversation, reminders and daily support.",
  },
];

const steps = [
  {
    number: "01",
    title: "Remember",
    text: "Preserve meaningful memories, people and moments.",
  },
  {
    number: "02",
    title: "Engage",
    text: "Stay mentally active with simple cognitive activities.",
  },
  {
    number: "03",
    title: "Connect",
    text: "Keep patients and caregivers meaningfully connected.",
  },
  {
    number: "04",
    title: "Support",
    text: "Make everyday routines easier and more reassuring.",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F4FAFD] text-[#0B2945]">

      {/* =========================
          NAVBAR
      ========================== */}

      <header className="relative z-50 border-b border-[#DCEFF4] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">

          <AyuDeeLogo />

          <nav className="hidden items-center gap-8 text-sm font-bold text-[#64748B] lg:flex">
            <a
              href="#features"
              className="transition hover:text-[#087FC4]"
            >
              Features
            </a>

            <a
              href="#how"
              className="transition hover:text-[#087FC4]"
            >
              How it works
            </a>

            <a
              href="#brain-studio"
              className="transition hover:text-[#087FC4]"
            >
              Brain Studio
            </a>

            <a
              href="#safety"
              className="transition hover:text-[#087FC4]"
            >
              Safety
            </a>

            <Link
              to="/login"
              className="transition hover:text-[#087FC4]"
            >
              Sign in
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-bold text-[#087FC4] sm:block"
            >
              Need help?
            </Link>

            <Link
              to="/choose-role"
              className="inline-flex items-center gap-2 rounded-xl bg-[#062A4D] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#087FC4]"
            >
              Get started
              <ArrowRight size={17} />
            </Link>
          </div>

        </div>
      </header>

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="relative">

        {/* Background decoration */}

        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#18BCE0]/10 blur-3xl" />

        <div className="absolute -right-32 top-10 h-[450px] w-[450px] rounded-full bg-[#38C6C4]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1480px] gap-14 px-5 pb-24 pt-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-12 lg:pb-28 lg:pt-20">

          {/* LEFT HERO */}

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#BCE8EF] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#087FC4] shadow-sm">
              <Sparkles size={15} />
              AI-Powered Cognitive Care
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-[#062A4D] sm:text-6xl lg:text-7xl">

              Care that{" "}

              <span className="text-[#18BCE0]">
                remembers
              </span>

              {" "}with you.

            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#64748B]">
              AyuDee AI is a compassionate cognitive care platform that
              helps people preserve memories, manage everyday routines,
              stay mentally engaged and remain connected with caregivers.
            </p>

            {/* Hero Buttons */}

            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/choose-role"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#087FC4] px-6 py-3 font-black text-white shadow-lg shadow-[#087FC4]/20 transition hover:-translate-y-1 hover:bg-[#062A4D]"
              >
                Choose your journey
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/patient"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#B9DCE8] bg-white px-6 py-3 font-black text-[#062A4D] shadow-sm transition hover:-translate-y-1 hover:border-[#18BCE0] hover:shadow-lg"
              >
                Explore demo
                <Sparkles size={17} />
              </Link>

            </div>

            {/* Benefits */}

            <div className="mt-10 grid gap-4 sm:grid-cols-2">

              {benefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#087FC4] shadow-sm ring-1 ring-[#D5EDF2]">
                      <Icon size={20} />
                    </span>

                    <span>
                      <strong className="block text-sm font-black text-[#0B2945]">
                        {item.title}
                      </strong>

                      <small className="text-xs text-[#64748B]">
                        {item.text}
                      </small>
                    </span>
                  </div>
                );
              })}

            </div>

          </div>

          {/* =========================
              HERO IMAGES
          ========================== */}

          <div className="relative min-h-[560px]">

            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#38C6C4]/20 blur-3xl" />

            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[#078DD8]/15 blur-3xl" />

            <div className="relative grid gap-5 sm:grid-cols-2">

              {/* PATIENT IMAGE CARD */}

              <div className="translate-y-8 overflow-hidden rounded-[32px] border border-white/80 bg-white p-3 shadow-[0_30px_80px_rgba(7,59,102,0.18)] transition duration-300 hover:-translate-y-1">

                <div className="relative h-[320px] overflow-hidden rounded-[25px]">

                  <img
                    src={patientCare}
                    alt="Patient care and companionship"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#062A4D]/70 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-[#087FC4] shadow-lg backdrop-blur-md">

                    <Heart
                      size={14}
                      fill="currentColor"
                    />

                    Moments Matter

                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-white">

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100">
                      Patient Space
                    </p>

                    <p className="mt-1 text-xl font-black">
                      Every memory matters.
                    </p>

                  </div>

                </div>

                <div className="p-4">

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#087FC4]">
                    Remember • Engage • Smile
                  </p>

                  <h3 className="mt-2 text-xl font-black text-[#062A4D]">
                    A familiar space for every day.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    Memories, routines, brain activities and gentle
                    companionship — all together.
                  </p>

                </div>

              </div>

              {/* FAMILY IMAGE CARD */}

              <div className="overflow-hidden rounded-[32px] bg-gradient-to-br from-[#062A4D] to-[#087FC4] p-3 text-white shadow-[0_30px_80px_rgba(7,59,102,0.25)] transition duration-300 hover:-translate-y-2">

                <div className="relative h-[320px] overflow-hidden rounded-[25px]">

                  <img
                    src={familyMemory}
                    alt="Family sharing meaningful memories"
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#062A4D]/80 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-black text-[#0F9F91] shadow-lg backdrop-blur-md">

                    <HeartHandshake size={15} />

                    Together Stronger

                  </div>

                  <div className="absolute bottom-5 left-5 right-5">

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A7F3D0]">
                      Care Circle
                    </p>

                    <p className="mt-1 text-xl font-black">
                      Connection creates comfort.
                    </p>

                  </div>

                </div>

                <div className="p-4">

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#A7F3D0]">
                    Caregiver Connection
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Together, stronger.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-sky-100/80">
                    Help families stay informed, connected and involved
                    in everyday care.
                  </p>

                </div>

              </div>

            </div>

            {/* Floating card */}

            <div className="relative mx-auto mt-[-12px] max-w-md rounded-2xl border border-[#C8E8EE] bg-white/95 p-4 shadow-xl backdrop-blur-md">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DDF7F5] text-[#087FC4]">
                  <HeartHandshake size={23} />
                </div>

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#087FC4]">
                    Human-centered AI
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#062A4D]">
                    Technology designed around care, memories and people.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================
          FEATURES
      ========================== */}

      <section
        id="features"
        className="border-y border-[#D7EBF0] bg-white"
      >

        <div className="mx-auto max-w-[1480px] px-5 py-20 sm:px-8 lg:px-12">

          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#087FC4]">
            One Connected Experience
          </p>

          <h2 className="mt-3 max-w-3xl text-3xl font-black text-[#062A4D] sm:text-4xl">
            Everyday tools designed to make care feel more human.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-[#64748B]">
            From remembering special moments to staying active and
            connected, AyuDee brings essential cognitive-care tools
            into one simple experience.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  id={
                    feature.title === "Brain Studio"
                      ? "brain-studio"
                      : undefined
                  }
                  key={feature.title}
                  className="group rounded-[24px] border border-[#D8EBF0] bg-[#FBFDFC] p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#9EDDEA] hover:shadow-xl"
                >

                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#EAF7FC] p-3 text-[#087FC4] transition group-hover:bg-[#087FC4] group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-[#062A4D]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#64748B]">
                    {feature.text}
                  </p>

                </article>
              );
            })}

          </div>

        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section
        id="how"
        className="mx-auto max-w-[1480px] px-5 py-24 sm:px-8 lg:px-12"
      >

        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#087FC4]">
              How AyuDee Works
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#062A4D] sm:text-4xl">
              Remember.
              <br />
              Engage.
              <br />
              Connect.
              <br />
              Support.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-[#64748B]">
              A simple care journey designed to support independence
              while keeping family and caregivers connected.
            </p>

            <Link
              to="/choose-role"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#062A4D] px-5 py-3 font-black text-white transition hover:bg-[#087FC4]"
            >
              Start your journey
              <ArrowRight size={17} />
            </Link>

          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[25px] border border-[#D8EBF0] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >

                <span className="text-sm font-black text-[#18BCE0]">
                  {step.number}
                </span>

                <h3 className="mt-10 text-xl font-black text-[#062A4D]">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#64748B]">
                  {step.text}
                </p>

              </article>
            ))}

          </div>

        </div>

      </section>

      {/* =========================
          CTA
      ========================== */}

      <section className="px-5 pb-20 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[32px] bg-gradient-to-r from-[#062A4D] via-[#075B83] to-[#0EA5B7] px-7 py-12 text-white shadow-2xl sm:px-12 lg:flex lg:items-center lg:justify-between">

          <div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-200">
              Built for meaningful care
            </p>

            <h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-4xl">
              A calmer day starts with one familiar step.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-sky-100/80">
              Choose your experience and explore AyuDee as a patient
              or caregiver.
            </p>

          </div>

          <Link
            to="/choose-role"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-black text-[#062A4D] shadow-lg transition hover:-translate-y-1 lg:mt-0"
          >
            Explore AyuDee
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

      {/* =========================
          FOOTER
      ========================== */}

      <footer
        id="safety"
        className="bg-[#062A4D] text-white"
      >

        <div className="mx-auto flex max-w-[1480px] flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-12">

          <div>

            <AyuDeeLogo variant="light" />

            <p className="mt-5 max-w-md text-sm leading-6 text-sky-100/70">
              AyuDee AI supports memories, routines, cognitive
              engagement and caregiver connection. It is not a
              medical diagnostic system or emergency service.
            </p>

          </div>

          <div className="flex flex-wrap gap-3 text-xs font-bold text-sky-100/70">

            <span className="rounded-full border border-white/15 px-3 py-2">
              Privacy First
            </span>

            <span className="rounded-full border border-white/15 px-3 py-2">
              Accessible
            </span>

            <span className="rounded-full border border-white/15 px-3 py-2">
              Caregiver Connected
            </span>

            <span className="rounded-full border border-white/15 px-3 py-2">
              Non-Diagnostic
            </span>

          </div>

        </div>

      </footer>

    </main>
  );
}