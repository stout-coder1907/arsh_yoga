import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="container-x py-16 lg:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow mb-3">About</div>
        <h1 className="font-serif text-4xl text-forest leading-tight mb-4">About Arsh Yoga</h1>
        <p className="text-charcoal/80 mb-4">
          Arsh Yoga blends traditional practices with contemporary research to support hormonal
          health, fertility, and mindful living. Our teachers bring clinical insight and lived
          experience to each program.
        </p>
        <p className="text-charcoal/80">
          Learn more about our approach, teachers, and community by exploring our programs or
          getting in touch.
        </p>
        <div className="mt-8">
          <Link to="/programs" className="btn-primary">Explore Programs</Link>
        </div>
      </div>
    </section>
  );
}
