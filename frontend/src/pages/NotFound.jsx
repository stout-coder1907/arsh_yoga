import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <div className="eyebrow mb-3">404</div>
      <h1 className="font-serif text-5xl text-forest">This path is still unwritten.</h1>
      <Link to="/" className="btn-primary mt-8 inline-flex">Return home</Link>
    </section>
  );
}
