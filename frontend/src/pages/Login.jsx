import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const user = await login(form.email, form.password);
      const destination = user?.role === "admin" ? "/admin" : "/dashboard";
      nav(loc.state?.from?.pathname || destination, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Sign in failed.");
    } finally { setBusy(false); }
  };

  return (
    <section className="container-x py-20 grid lg:grid-cols-2 gap-16 items-center">
      <div className="hidden lg:block rounded-[2rem] overflow-hidden border border-line">
        <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=900&q=80" alt="" className="w-full h-[560px] object-cover" />
      </div>
      <div className="max-w-md w-full mx-auto">
        <div className="eyebrow mb-3">Welcome back</div>
        <h1 className="font-serif text-4xl text-forest">Sign in to Arsh Yoga</h1>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({...form, email: v})} />
          <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({...form, password: v})} />
          {err && <div className="text-sm text-red-700">{err}</div>}
          <button disabled={busy} className="btn-primary w-full">{busy ? "Signing in…" : "Sign in"}</button>
        </form>
        <p className="mt-6 text-sm text-charcoal/70">
          New to Arsh Yoga? <Link to="/register" className="text-forest underline underline-offset-4">Create an account</Link>
        </p>
      </div>
    </section>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="mt-2 w-full rounded-pill border border-line bg-cream px-5 py-3 text-sm text-charcoal focus:outline-none focus:border-forest"
      />
    </label>
  );
}
