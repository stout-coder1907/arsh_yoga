import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client.js";
import { ARTICLES } from "../data/articles.js";

export default function Journal() {
  const [posts, setPosts] = useState(ARTICLES);

  useEffect(() => {
    api.get("/articles").then(({ data }) => {
      if (Array.isArray(data) && data.length) setPosts(data);
    }).catch(() => {});
  }, []);

  const [hero, ...rest] = posts;
  const navigate = useNavigate();

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="max-w-3xl mb-14">
        <div className="eyebrow mb-3">The Journal</div>
        <h1 className="font-serif text-5xl text-forest leading-tight">
          Slow reading for a devoted practice.
        </h1>
      </div>

      {hero && (
        <div className="grid lg:grid-cols-2 gap-10 group mb-20 cursor-pointer" onClick={() => navigate(`/journal/${hero.slug}`)}>
          <div className="rounded-[2rem] overflow-hidden border border-line">
            <img src={hero.image} alt={hero.title} className="w-full h-[460px] object-cover group-hover:scale-[1.02] transition-transform duration-700" />
          </div>
          <div className="self-center">
            <div className="flex items-center gap-3">
              <div className="eyebrow text-gold">{hero.category} · Featured</div>
              <div className="inline-block bg-gold/10 text-gold text-xs px-2 py-1 rounded-full">Research Backed</div>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-forest mt-4 leading-tight group-hover:underline underline-offset-4 decoration-1">
              {hero.title}
            </h2>
            <p className="mt-5 text-charcoal/75 text-lg">{hero.description}</p>
            <div className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">
              {hero.author} · {hero.readTime} min read
            </div>
            <div className="mt-6">
              <a href={hero.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Read Research</a>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 border-t border-line pt-14">
        {rest.map((p) => (
          <div key={p._id} className="group">
            <div onClick={() => navigate(`/journal/${p.slug}`)} className="aspect-[5/4] overflow-hidden rounded-2xl border border-line cursor-pointer">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
            </div>
            <div className="flex items-center gap-3 mt-5">
              <div className="eyebrow text-gold">{p.category}</div>
              <div className="inline-block bg-gold/10 text-gold text-xs px-2 py-1 rounded-full">Research Backed</div>
            </div>
            <h3 onClick={() => navigate(`/journal/${p.slug}`)} className="font-serif text-2xl text-forest mt-2 leading-snug group-hover:underline underline-offset-4 decoration-1 cursor-pointer">
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-charcoal/70">{p.description}</p>
            <div className="mt-3 text-xs uppercase tracking-[0.18em] text-muted">
              {p.author} · {p.readTime} min
            </div>
            <div className="mt-3">
              <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Read Research</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
