import { useEffect, useMemo, useState } from "react";
import api from "../api/client.js";

const CATEGORIES = [
  "All",
  "PCOS & Endometriosis",
  "Fertility",
  "Fat Loss",
  "Meditation",
  "Stress Relief",
];
const LEVELS = ["All", "Beginner", "Intermediate", "All Levels"];

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");

  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay checkout script failed to load."));
      document.body.appendChild(script);
    });
  };

  const handleEnrollAndPay = async (program) => {
    try {
      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout script is missing. Please refresh the page and try again.");
      }

      const { data } = await api.post("/payments/create-order", { programId: program._id });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "Arsh Yoga",
        description: "Program Enrollment",
        handler: async (response) => {
          try {
            const verifyResponse = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              programId: program._id,
            });

            console.log("Payment verified", verifyResponse.data);
          } catch (verifyError) {
            console.error("Payment verification failed", verifyError);
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
        },
        theme: { color: "#2B4C36" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Unable to start payment", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/programs");

        if (!isMounted) return;

        if (Array.isArray(data)) {
          setPrograms(data);
        } else {
          setPrograms([]);
          setError("Unable to load programs right now.");
        }
      } catch (err) {
        if (isMounted) {
          setPrograms([]);
          setError("Unable to load programs right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrograms();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchCat = cat === "All" || p.category === cat;
      const matchLvl = level === "All" || p.level === level;
      const matchQ = !q || p.title.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchLvl && matchQ;
    });
  }, [programs, cat, level, q]);

  return (
    <section className="container-x py-16 lg:py-24 bg-[#F7F5EE]">
      <div className="max-w-3xl">
        <div className="eyebrow mb-4">Programs · 5 Wellness Tracks</div>
        <h1 className="font-serif text-5xl text-[#2B4C36] leading-tight">
          Devoted practice, by intention.
        </h1>
        <p className="mt-5 text-charcoal/75 text-lg">
          Five focused multi-week journeys — each curated by Arsh Yoga teachers
          for a specific wellness goal. Live via Zoom with on-demand replays.
        </p>
      </div>

      {/* Filter by Subject */}
      <div className="mt-12 border-y border-line py-5 flex flex-wrap gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-pill px-4 py-2 text-xs uppercase tracking-[0.18em] border transition-colors ${
                cat === c
                  ? "bg-[#2B4C36] text-[#F7F5EE] border-[#2B4C36]"
                  : "border-line text-charcoal/70 hover:border-[#2B4C36]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="rounded-pill border border-line bg-[#F7F5EE] px-4 py-2 text-xs uppercase tracking-[0.18em] text-charcoal/80"
          >
            {LEVELS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search programs…"
            className="rounded-pill border border-line bg-[#F7F5EE] px-4 py-2 text-sm text-charcoal w-56 focus:outline-none focus:border-[#2B4C36]"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-20 text-muted">Loading programs...</div>
        ) : error ? (
          <div className="col-span-full text-center py-20 text-muted">{error}</div>
        ) : filtered.length > 0 ? (
          filtered.map((p) => (
            <div
              key={p._id}
              className="group rounded-2xl overflow-hidden border border-line bg-cream hover:shadow-soft transition-all flex flex-col"
            >
              <div className="block aspect-[4/5] overflow-hidden bg-line">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.2em] text-gold">
                  <span>{p.category}</span>
                  <span className="text-muted">
                    {p.durationWeeks} wks · {p.sessionsPerWeek}×/wk
                  </span>
                </div>
                <div className="font-serif text-[#2B4C36] text-2xl mt-2 leading-tight">
                  {p.title}
                </div>
                <p className="mt-2 text-sm text-charcoal/70 line-clamp-3">
                  {p.description}
                </p>

                {p.benefits && p.benefits.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-[0.6rem] uppercase tracking-[0.15em] rounded-pill border border-line px-2 py-1 text-charcoal/70"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-2">
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] bg-[#2B4C36]/10 text-[#2B4C36] rounded-pill px-2.5 py-1">
                    {p.price?.amount ? `₹${(p.price.amount / 100).toFixed(0)}` : "Price on request"}
                  </span>
                  <span className="text-[0.6rem] uppercase tracking-[0.18em] text-muted">
                    {p.level}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleEnrollAndPay(p)}
                  className="mt-5 inline-flex items-center justify-center w-full rounded-pill bg-[#2B4C36] text-[#F7F5EE] text-xs uppercase tracking-[0.18em] py-3 hover:opacity-90 transition"
                >
                  Enroll & Pay →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-muted">
            No programs available.
          </div>
        )}
      </div>
    </section>
  );
}
