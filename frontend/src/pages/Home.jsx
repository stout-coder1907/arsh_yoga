import { useState } from "react";
import { Link } from "react-router-dom";

const pillars = [
  { tag: "PCOS Care", title: "Hormonal balance through breath and asana." },
  { tag: "Fertility", title: "Gentle, science-led practice for conception." },
  { tag: "Weight Loss", title: "Sustainable strength, never punishment." },
  { tag: "Meditation", title: "Stillness practices rooted in tradition." },
];

const faqItems = [
  {
    id: "faq-1",
    question: "Is Arsh Yoga suitable for beginners?",
    answer:
      "Absolutely. Our programs are designed for practitioners of all levels, including complete beginners. Each session offers guidance and modifications to help you practice safely and confidently.",
  },
  {
    id: "faq-2",
    question: "How often should I practice yoga?",
    answer:
      "Consistency matters more than duration. Practicing 3–5 times per week can help improve flexibility, strength, focus, and overall well-being.",
  },
  {
    id: "faq-3",
    question: "What do I need for a yoga session?",
    answer:
      "A yoga mat and comfortable clothing are usually enough. Some programs may optionally use props such as blocks, straps, or cushions.",
  },
  {
    id: "faq-4",
    question: "Can yoga help with stress and sleep?",
    answer:
      "Many yoga and meditation practices focus on relaxation, mindful breathing, and nervous-system regulation, which can support better sleep and stress management.",
  },
  {
    id: "faq-5",
    question: "Are the programs based on traditional Indian practices?",
    answer:
      "Yes. Arsh Yoga draws inspiration from traditional yoga, meditation, and Ayurvedic principles while adapting them for modern lifestyles.",
  },
  {
    id: "faq-6",
    question: "Can I practice if I have never done yoga before?",
    answer:
      "Yes. Beginners are welcome. Start with foundational programs and progress at a pace that feels comfortable for you.",
  },
  {
    id: "faq-7",
    question: "Are online sessions available?",
    answer:
      "Yes. Many of our offerings can be accessed online, allowing you to practice from anywhere.",
  },
  {
    id: "faq-8",
    question: "How do I choose the right program?",
    answer:
      "Explore the Programs section and select a path that aligns with your goals, whether that is relaxation, flexibility, mindfulness, hormonal wellness, or overall fitness.",
  },
  {
    id: "faq-9",
    question: "Is yoga helpful for women’s wellness?",
    answer:
      "Yoga can support physical, mental, and emotional well-being through movement, breathwork, and mindfulness practices. Many women incorporate yoga into their overall wellness routine.",
  },
  {
    id: "faq-10",
    question: "How can I contact Arsh Yoga?",
    answer:
      "Visit the Contact section to send us a message, ask questions, or learn more about our programs.",
  },
];

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(faqItems[0].id);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-x pt-16 lg:pt-24 pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <h1 className="h-display">
              Quiet strength.<br />
              Ancient practice.<br />
              <span className="italic text-forest-soft">A softer kind of power.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-charcoal/75 leading-relaxed">
              Editorial yoga, meditation and Ayurveda programs designed for
              women navigating PCOS, fertility, weight, and stress —
              taught by India's most trusted practitioners.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link to="/register" className="btn-primary">
                Join Arsh Yoga
              </Link>
              <Link to="/programs" className="btn-ghost">
                Explore programs →
              </Link>
            </div>

            {/* Trust badges removed per request */}
          </div>

          {/* HERO IMAGE */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-gold/15 blur-2xl" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-soft border border-line">
                <img
                  src="https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=80"
                  alt="Woman practicing yoga in soft natural light"
                  className="w-full h-[560px] object-cover"
                />
              </div>
              {/* Live class card removed to keep hero image clean */}
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-cream border-y border-line/70">
        <div className="container-x py-20">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <div className="eyebrow mb-3">The Pillars</div>
              <h2 className="font-serif text-4xl text-forest max-w-xl">
                Five quiet programs. One devoted practice.
              </h2>
            </div>
            <Link to="/programs" className="text-sm text-forest underline-offset-4 hover:underline">
              View all programs →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => (
              <div key={p.tag} className="bg-sand rounded-2xl p-7 border border-line hover:shadow-soft transition-shadow">
                <div className="eyebrow text-gold">{p.tag}</div>
                <div className="font-serif text-forest text-xl mt-3 leading-snug">{p.title}</div>
                <Link to="/programs" className="mt-6 inline-block text-sm text-forest/80 hover:text-forest">
                  Begin →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-[2rem] overflow-hidden border border-line shadow-soft">
          <img
            src="https://images.unsplash.com/photo-1593810450967-f9c42742e326?auto=format&fit=crop&w=900&q=80"
            alt="Meditation in a sunlit Indian studio"
            className="w-full h-[480px] object-cover"
          />
        </div>
        <div>
          <div className="eyebrow mb-4">Ready to begin</div>
          <h2 className="font-serif text-4xl lg:text-5xl text-forest leading-tight">
            Enroll in a program that meets your goals.
          </h2>
          <p className="mt-6 text-charcoal/75 text-lg max-w-lg">
            Choose a guided program for hormone balance, fertility support,
            mindful weight management, or stress relief, then join and start.
          </p>
          <div className="mt-8">
            <Link to="/register" className="btn-primary">Enroll now</Link>
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="eyebrow mb-3">About</div>
          <h2 className="font-serif text-4xl text-forest mb-5">
            A mindful practice rooted in tradition.
          </h2>
          <p className="text-charcoal/75 text-lg leading-relaxed">
            Arsh Yoga blends traditional yoga, meditation, and Ayurvedic principles with modern wellness support for hormonal health, stress resilience, and restorative recovery.
          </p>
          <div className="mt-8">
            <Link to="/about" className="btn-ghost">Learn more about us</Link>
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3">Frequently Asked Questions</div>
            <h2 className="font-serif text-4xl text-forest leading-tight">
              Everything you need to know before beginning your wellness journey with Arsh Yoga.
            </h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item) => {
              const isOpen = activeFaq === item.id;
              return (
                <div key={item.id} className="overflow-hidden rounded-[2rem] border border-line bg-white shadow-soft">
                  <button
                    id={`faq-button-${item.id}`}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    onClick={() => setActiveFaq(isOpen ? null : item.id)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-charcoal/90 hover:bg-sand/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                  >
                    <span className="font-semibold">{item.question}</span>
                    <span className="text-forest text-2xl">{isOpen ? "−" : "+"}</span>
                  </button>
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-button-${item.id}`}
                    className={`px-6 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 py-4" : "max-h-0"}`}
                  >
                    <p className="text-charcoal/75 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="rounded-[2rem] border border-line bg-forest/5 p-12 text-center">
          <div className="eyebrow text-forest mb-3">Contact</div>
          <h2 className="font-serif text-4xl text-forest leading-tight">
            Have questions or want to get started?
          </h2>
          <p className="mt-6 text-charcoal/75 text-lg max-w-2xl mx-auto">
            Reach out to our team for personalised guidance, program support, or partnership enquiries.
          </p>
          <div className="mt-10">
            <Link to="/contact" className="btn-primary">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
