import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client.js";
import { ARTICLES } from "../data/articles.js";

export default function JournalArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Try backend first, fallback to local data
    api
      .get(`/articles/${slug}`)
      .then(({ data }) => {
        if (data) setArticle(data);
        else setArticle(ARTICLES.find((a) => a.slug === slug));
      })
      .catch(() => {
        setArticle(ARTICLES.find((a) => a.slug === slug));
      });
  }, [slug]);

  if (!article) return <section className="container-x py-24">Loading…</section>;

  return (
    <section className="container-x py-16 lg:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow mb-3">{article.category}</div>
        <h1 className="font-serif text-4xl text-forest leading-tight mb-4">{article.title}</h1>
        <div className="text-xs text-muted mb-8">{article.author} · {article.readTime} min · {article.publishedAt}</div>

        <div className="prose max-w-none text-charcoal/90 mb-8">
          <p>{article.description}</p>
        </div>

        <div className="mt-6">
          <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Read Research</a>
        </div>

        <div className="mt-16 border-t border-line pt-6">
          <h3 className="font-serif text-xl text-forest mb-3">References</h3>
          <ul className="list-disc pl-5 text-sm text-charcoal/80">
            <li>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-forest underline">
                {article.sourceUrl}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
