import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-line/70 bg-cream">
      <div className="container-x py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-serif text-2xl text-forest">Arsh Yoga</div>
          <p className="mt-3 text-sm text-muted max-w-xs">
            Editorial wellness, rooted in Indian tradition. Yoga, meditation,
            and Ayurveda for the modern woman.
          </p>
        </div>
        <FooterCol title="Practice" links={[["Programs","/programs"],["Journal","/journal"]]} />
        <FooterCol title="Studio" links={[["About","/about"],["Teachers","/about#teachers"],["Contact","/contact"]]} />
        <FooterCol title="Account" links={[["Sign in","/login"],["Create account","/register"],["Help","/help"]]} />
      </div>
      <div className="border-t border-line/70 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Arsh Yoga. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div className="eyebrow mb-4">{title}</div>
      <ul className="space-y-2 text-sm text-charcoal/80">
        {links.map(([label, to]) => (
          <li key={to}><Link to={to} className="hover:text-forest">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
