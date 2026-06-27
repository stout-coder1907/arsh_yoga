import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr(""); setBusy(true);
    try { 
      const user = await register(form);
      const destination = user?.role === "admin" ? "/admin" : "/dashboard";
      nav(destination, { replace: true }); 
    }
    catch (e) { setErr(e?.response?.data?.message || "Could not create account."); }
    finally { setBusy(false); }
  };

  return (
    <section className="container-x py-20 max-w-xl">
      <div className="eyebrow mb-3">Begin softly</div>
      <h1 className="font-serif text-4xl text-forest">Create your Arsh Yoga account</h1>
      <p className="mt-3 text-charcoal/70">Enroll in a program and access guided wellness content.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <Field label="Full name" value={form.name} onChange={(v) => setForm({...form, name: v})} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({...form, email: v})} />
        <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({...form, password: v})} />
        {err && <div className="text-sm text-red-700">{err}</div>}
        <button disabled={busy} className="btn-primary w-full">{busy ? "Creating…" : "Create account"}</button>
      </form>
      <p className="mt-6 text-sm text-charcoal/70">
        Already a student? <Link to="/login" className="text-forest underline underline-offset-4">Sign in</Link>
      </p>
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
