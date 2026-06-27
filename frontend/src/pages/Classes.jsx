import { useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

// Four real specialized live subjects taught at Arsh Yoga.
const SUBJECTS = [
  {
    key: "Classical Flow",
    title: "All-Level Classical Yoga Flow",
    focus:
      "Traditional Asana, Pranayama (breathwork), Alignment, and deep Guided Meditation — suitable for absolute beginners while keeping advanced practitioners engaged.",
    instructor: "Aarti Sharma",
    durationMin: 60,
  },
  {
    key: "Fat Loss Flow",
    title: "Fat Loss & Dynamic Metabolism Flow",
    focus:
      "High-energy, metabolic-boosting sequences combined with core strengthening to burn calories and build physical stamina.",
    instructor: "Kiran Patel",
    durationMin: 55,
  },
  {
    key: "Hormonal Balance",
    title: "Hormonal Balance & Pelvic Floor Strength",
    focus:
      "Therapeutic, slow-paced movements to release physical tension, reduce cortisol, and optimize reproductive health.",
    instructor: "Devika R.",
    durationMin: 50,
  },
  {
    key: "Pranayama Reset",
    title: "Pranayama & Nervous System Reset",
    focus:
      "Conscious breathing practices and mindfulness meditations to combat acute mental anxiety, stress, and promote restful sleep patterns.",
    instructor: "Meera Iyer",
    durationMin: 40,
  },
];

// Build a recurring weekly schedule from the 4 subjects.
function dayAt(offset, hour, min = 0) {
  const d = new Date();
  d.setHours(hour, min, 0, 0);
  d.setDate(d.getDate() + offset - d.getDay());
  return d.toISOString();
}

const SCHEDULE = [
  // Mon
  { day: 1, hour: 6, min: 30, subject: SUBJECTS[0] },
  { day: 1, hour: 19, min: 0, subject: SUBJECTS[3] },
  // Tue
  { day: 2, hour: 7, min: 0, subject: SUBJECTS[1] },
  { day: 2, hour: 18, min: 30, subject: SUBJECTS[2] },
  // Wed
  { day: 3, hour: 6, min: 30, subject: SUBJECTS[0] },
  { day: 3, hour: 20, min: 0, subject: SUBJECTS[3] },
  // Thu
  { day: 4, hour: 7, min: 0, subject: SUBJECTS[1] },
  { day: 4, hour: 18, min: 30, subject: SUBJECTS[2] },
  // Fri
  { day: 5, hour: 6, min: 30, subject: SUBJECTS[0] },
  { day: 5, hour: 19, min: 0, subject: SUBJECTS[1] },
  // Sat
  { day: 6, hour: 8, min: 0, subject: SUBJECTS[2] },
  { day: 6, hour: 17, min: 0, subject: SUBJECTS[3] },
  // Sun
  { day: 0, hour: 9, min: 0, subject: SUBJECTS[0] },
];

const FALLBACK = SCHEDULE.map((s, i) => ({
  _id: `c${i + 1}`,
  title: s.subject.title,
  subject: s.subject.key,
  focus: s.subject.focus,
  instructor: s.subject.instructor,
  durationMin: s.subject.durationMin,
  scheduledAt: dayAt(s.day, s.hour, s.min),
  type: "live",
  platform: "Zoom",
  joinUrl: "#",
}));

const SUBJECT_FILTERS = ["All", ...SUBJECTS.map((s) => s.key)];

export default function Classes() {
  const [classes, setClasses] = useState(FALLBACK);
  const [subject, setSubject] = useState("All");

  useEffect(() => {
    api
      .get("/classes")
      .then(({ data }) => {
        if (Array.isArray(data) && data.length) setClasses(data);
      })
      .catch(() => {});
  }, []);

  const week = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, []);

  const byDay = useMemo(() => {
    const map = new Map(week.map((d) => [d.toDateString(), []]));
    classes
      .filter((c) => subject === "All" || c.subject === subject)
      .forEach((c) => {
        const key = new Date(c.scheduledAt).toDateString();
        if (map.has(key)) map.get(key).push(c);
      });
    for (const [, arr] of map)
      arr.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
    return map;
  }, [classes, subject, week]);

  return (
    <section className="container-x py-16 lg:py-24 bg-[#F7F5EE]">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
        <div>
          <div className="eyebrow mb-3">This Week · Live via Zoom</div>
          <h1 className="font-serif text-5xl text-[#2B4C36] leading-tight">
            Daily live classes calendar
          </h1>
          <p className="mt-3 text-charcoal/70 max-w-xl">
            Four specialized wellness subjects taught live every week by Arsh
            Yoga teachers. All times in IST.
          </p>
        </div>

        {/* Filter by Subject */}
        <div className="flex flex-wrap gap-2">
          {SUBJECT_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={`rounded-pill px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
                subject === s
                  ? "bg-[#2B4C36] text-[#F7F5EE] border-[#2B4C36]"
                  : "border-line text-charcoal/70 hover:border-[#2B4C36]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Subject legend */}
      <div className="mb-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {SUBJECTS.map((s) => (
          <div
            key={s.key}
            className="rounded-2xl border border-line bg-cream p-4"
          >
            <div className="text-[0.65rem] uppercase tracking-[0.2em] text-gold">
              {s.key}
            </div>
            <div className="font-serif text-[#2B4C36] text-lg leading-snug mt-1">
              {s.title}
            </div>
            <p className="text-xs text-charcoal/70 mt-2 line-clamp-3">
              {s.focus}
            </p>
          </div>
        ))}
      </div>

      {/* Weekly calendar */}
      <div className="grid md:grid-cols-7 gap-px bg-line border border-line rounded-2xl overflow-hidden">
        {week.map((d) => {
          const today = d.toDateString() === new Date().toDateString();
          const items = byDay.get(d.toDateString()) || [];
          return (
            <div
              key={d.toDateString()}
              className="bg-[#F7F5EE] min-h-[320px] p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`font-serif text-xl ${
                    today ? "text-[#2B4C36]" : "text-charcoal"
                  }`}
                >
                  {d.toLocaleDateString(undefined, { weekday: "short" })}
                </div>
                <div
                  className={`text-xs ${
                    today
                      ? "bg-[#2B4C36] text-[#F7F5EE] rounded-pill px-2 py-0.5"
                      : "text-muted"
                  }`}
                >
                  {d.getDate()}
                </div>
              </div>
              <div className="space-y-2">
                {items.length === 0 && (
                  <div className="text-xs text-muted italic">Rest day</div>
                )}
                {items.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-lg border border-line bg-sand p-3 hover:border-[#2B4C36] transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[0.6rem] uppercase tracking-[0.18em] text-gold">
                        {c.subject}
                      </div>
                      <span className="text-[0.55rem] uppercase tracking-[0.18em] bg-[#2B4C36] text-[#F7F5EE] rounded-pill px-2 py-0.5">
                        Live · Zoom
                      </span>
                    </div>
                    <div className="font-serif text-[#2B4C36] text-base leading-tight mt-1">
                      {c.title}
                    </div>
                    <div className="text-xs text-muted mt-1">
                      {new Date(c.scheduledAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {" · "}
                      {c.durationMin} min
                    </div>
                    <div className="text-xs text-charcoal/70 mt-1">
                      {c.instructor}
                    </div>
                    <a
                      href={c.joinUrl || "#"}
                      className="mt-3 inline-flex items-center justify-center w-full rounded-pill bg-[#2B4C36] text-[#F7F5EE] text-[0.65rem] uppercase tracking-[0.18em] py-2 hover:opacity-90 transition"
                    >
                      Join Class →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
