import { useMemo, useState } from "react";

const POSES = [
  {
    name: "Cat and Cow Pose",
    sanskrit: "Marjaryasana–Bitilasana",
    desc: "Warm-up for the spinal cord, improves posture and balance.",
    tags: ["Flexibility", "Calming"],
    art: "cat-cow",
  },
  {
    name: "Child's Pose",
    sanskrit: "Balasana",
    desc: "Calming pose, stretches back, hips, thighs, and knees.",
    tags: ["Calming", "Flexibility"],
    art: "child",
  },
  {
    name: "Downward Dog Pose",
    sanskrit: "Adho Mukha Svanasana",
    desc: "Strengthens arms, shoulders, back, and leg arches.",
    tags: ["Strength", "Flexibility"],
    art: "down-dog",
  },
  {
    name: "Plank Pose",
    sanskrit: "Phalakasana",
    desc: "Builds core strength, tightens abdominal muscles.",
    tags: ["Core Strength", "Strength"],
    art: "plank",
  },
  {
    name: "Cobra Pose",
    sanskrit: "Bhujangasana",
    desc: "Increases spinal flexibility, opens chest and shoulders.",
    tags: ["Flexibility", "Strength"],
    art: "cobra",
  },
  {
    name: "Triangle Pose",
    sanskrit: "Trikonasana",
    desc: "Strengthens legs, opens hips and hamstrings.",
    tags: ["Strength", "Flexibility"],
    art: "triangle",
  },
  {
    name: "Tree Pose",
    sanskrit: "Vrikshasana",
    desc: "Aids in balance, strengthens core, spine, and ankles.",
    tags: ["Balance", "Core Strength"],
    art: "tree",
  },
  {
    name: "Bridge Pose",
    sanskrit: "Setu Bandhasana",
    desc: "Gains strength in back muscles and hamstrings.",
    tags: ["Strength", "Flexibility"],
    art: "bridge",
  },
  {
    name: "Supine Twist",
    sanskrit: "Supta Matsyendrasana",
    desc: "Cools down the body, stretches chest and obliques.",
    tags: ["Calming", "Flexibility"],
    art: "twist",
  },
  {
    name: "Mountain Pose",
    sanskrit: "Tadasana",
    desc: "Neutral standing pose, focuses on steady breathing.",
    tags: ["Balance", "Calming"],
    art: "mountain",
  },
];

const FILTERS = [
  "All",
  "Core Strength",
  "Strength",
  "Flexibility",
  "Balance",
  "Calming",
];

const FAQS = [
  {
    q: "Can yoga help in weight reduction?",
    a: "Yoga is mainly done for the sake of meditation and relaxation. However, the continued practice of yoga can help in the loss of body weight as it burns calories effectively.",
  },
  {
    q: "How often should I practice as a beginner?",
    a: "Starting with 2-3 sessions a week is ideal to build mind-body consistency without overloading your muscles.",
  },
  {
    q: "What if I can't touch my toes?",
    a: "Flexibility is a consequence of yoga, not a prerequisite. Arsh Yoga provides modified alignments and prop setups for all flexibility levels.",
  },
  {
    q: "Are the programs suitable for specific health goals like PCOS, Fertility, or Weight Loss?",
    a: "Yes, absolutely. Arsh Yoga designs highly targeted, medically informed workflows specifically tailored for PCOS management, fertility support, sustainable weight loss, and deep stress relief. Each sequence is adapted to balance your body's endocrine and nervous systems naturally.",
  },
  {
    q: "Do I need any specialized equipment before joining a live online class?",
    a: "All you need is a non-slip yoga mat, a stable internet connection, and a quiet, comfortable space. For specific restorative sessions, we may suggest using everyday household items like pillows, blocks, or a sturdy chair as supportive props.",
  },
  {
    q: "What happens if I miss a scheduled Daily Live Class?",
    a: "Life happens, and your practice should flex with it. Every daily live session is automatically recorded and uploaded directly to your Student Dashboard within a few hours. You have unlimited on-demand access to the playback library to practice whenever suits your schedule.",
  },
  {
    q: "How do I access the live sessions once I enroll?",
    a: "Accessing your classes is entirely seamless. Simply log into your Arsh Yoga Student Dashboard, navigate to the 'Upcoming Live' tab, and click the direct forest-green 'Join Class' button. It will launch your session directly in Zoom or Google Meet with no extra links to track down.",
  },
  {
    q: "Is it safe to practice yoga if I am recovering from a minor injury or have joint pain?",
    a: "Yoga can be incredibly therapeutic for recovery, but safety is our priority. We always recommend consulting your physician first. Please update your profile settings in your dashboard regarding your health focus, and our instructors will provide safe, modified variations during live classes.",
  },
];

export default function Guide() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(0);

  const filtered = useMemo(
    () =>
      filter === "All" ? POSES : POSES.filter((p) => p.tags.includes(filter)),
    [filter],
  );

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-[#2B4C36]">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <p className="uppercase tracking-[0.3em] text-xs text-[#B8893A] mb-4">
          The Arsh Yoga Guide
        </p>
        <h1 className="font-serif text-5xl md:text-6xl leading-tight">
          A library of postures,
          <br />
          answered with intention.
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-[#2B4C36]/70">
          Ten foundational āsanas, illustrated in the Arsh house style — paired
          with the questions our students ask most often.
        </p>
      </section>

      {/* POSTURE LIBRARY */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <h2 className="font-serif text-3xl">Posture Library</h2>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-xs tracking-[0.15em] uppercase transition ${
                  filter === f
                    ? "bg-[#2B4C36] text-[#F7F5EE]"
                    : "border border-[#2B4C36]/25 text-[#2B4C36] hover:bg-[#2B4C36]/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.name}
              className="group bg-white/60 rounded-2xl border border-[#2B4C36]/10 overflow-hidden hover:border-[#2B4C36]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-[#EFEADD] flex items-center justify-center overflow-hidden">
                <PoseArt name={p.art} />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8893A] mb-1">
                  {p.sanskrit}
                </p>
                <h3 className="font-serif text-xl mb-2">{p.name}</h3>
                <p className="text-sm text-[#2B4C36]/75 leading-relaxed">
                  {p.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full bg-[#2B4C36]/8 text-[#2B4C36]/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-28">
        <div className="text-center mb-12">
          <p className="uppercase tracking-[0.3em] text-xs text-[#B8893A] mb-3">
            Frequently asked
          </p>
          <h2 className="font-serif text-4xl">Yoga, answered with care</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`rounded-2xl border bg-white/60 transition-all duration-300 ${
                  isOpen
                    ? "border-[#2B4C36]/40 shadow-[0_8px_30px_-12px_rgba(43,76,54,0.18)]"
                    : "border-[#2B4C36]/10 hover:border-[#2B4C36]/25"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-6 text-left px-7 py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg md:text-xl text-[#2B4C36]">
                    {item.q}
                  </span>
                  <span
                    className={`shrink-0 w-9 h-9 rounded-full grid place-items-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#2B4C36] text-[#F7F5EE] rotate-45"
                        : "bg-[#2B4C36]/8 text-[#2B4C36]"
                    }`}
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className="grid transition-all duration-500 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-6 pr-16 text-[#2B4C36]/75 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ---------- Minimal line-art SVG placeholders ---------- */

function PoseArt({ name }) {
  const stroke = "#2B4C36";
  const props = {
    width: "62%",
    height: "62%",
    viewBox: "0 0 100 100",
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className:
      "opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500",
  };

  switch (name) {
    case "cat-cow":
      return (
        <svg {...props}>
          <path d="M15 65 Q40 35 55 55 Q70 75 88 55" />
          <circle cx="88" cy="53" r="3" fill={stroke} />
          <path d="M25 65 V80 M40 65 V82 M60 68 V82 M78 62 V80" />
        </svg>
      );
    case "child":
      return (
        <svg {...props}>
          <path d="M15 75 Q35 75 50 70 Q70 62 85 72" />
          <circle cx="85" cy="70" r="3" fill={stroke} />
          <path d="M18 75 Q35 90 60 80" />
        </svg>
      );
    case "down-dog":
      return (
        <svg {...props}>
          <path d="M15 80 L52 25 L88 80" />
          <circle cx="20" cy="78" r="2.5" fill={stroke} />
          <path d="M15 80 L25 80 M82 80 L92 80" />
        </svg>
      );
    case "plank":
      return (
        <svg {...props}>
          <path d="M12 60 L82 60" />
          <circle cx="86" cy="60" r="3" fill={stroke} />
          <path d="M22 60 V78 M70 60 V78 M30 60 V52 M62 60 V52" />
        </svg>
      );
    case "cobra":
      return (
        <svg {...props}>
          <path d="M12 78 Q40 78 60 70 Q78 60 80 40" />
          <circle cx="80" cy="38" r="3" fill={stroke} />
          <path d="M30 78 H72" />
        </svg>
      );
    case "triangle":
      return (
        <svg {...props}>
          <path d="M25 80 L75 80 L40 30 Z" />
          <circle cx="40" cy="28" r="3" fill={stroke} />
          <path d="M40 30 L62 55" />
        </svg>
      );
    case "tree":
      return (
        <svg {...props}>
          <circle cx="50" cy="22" r="6" />
          <path d="M50 28 V60 L40 85 M50 60 L60 85" />
          <path d="M50 45 L32 38 M50 45 L68 38" />
        </svg>
      );
    case "bridge":
      return (
        <svg {...props}>
          <path d="M15 75 Q50 35 85 75" />
          <circle cx="15" cy="75" r="3" fill={stroke} />
          <path d="M30 75 V85 M70 75 V85" />
        </svg>
      );
    case "twist":
      return (
        <svg {...props}>
          <path d="M15 65 L85 65" />
          <circle cx="20" cy="63" r="3" fill={stroke} />
          <path d="M55 65 Q60 50 78 48 M55 65 Q60 80 78 82" />
        </svg>
      );
    case "mountain":
    default:
      return (
        <svg {...props}>
          <circle cx="50" cy="22" r="6" />
          <path d="M50 28 V70 L42 88 M50 70 L58 88" />
          <path d="M50 40 L40 58 M50 40 L60 58" />
        </svg>
      );
  }
}
