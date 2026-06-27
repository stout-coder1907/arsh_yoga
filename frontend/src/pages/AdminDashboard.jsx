import { useEffect, useState } from "react";
import api from "../api/client.js";

const TABS = [
  ["overview", "Overview"],
  ["classes", "Schedule Class"],
  ["articles", "Articles"],
  ["enrollments", "Enrollments"],
  ["users", "Users"],
];

export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [kpis, setKpis] = useState({
    users: 0,
    enrollments: 0,
    revenue: 0,
    classes: 0,
  });
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [articles, setArticles] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [programsError, setProgramsError] = useState("");
  const [classForm, setClassForm] = useState({
    title: "",
    program: "",
    scheduledAt: "",
    durationMinutes: 60,
    joinUrl: "",
    type: "live",
  });
  const [msg, setMsg] = useState("");

  const loadAll = async () => {
    setProgramsLoading(true);
    setProgramsError("");

    try {
      const [u, en, ar, pr, pay] = await Promise.all([
        api.get("/users"),
        api.get("/enrollments"),
        api.get("/articles?limit=50"),
        api.get("/programs?published=false"),
        api.get("/payments"),
      ]);
      const usersList = u.data?.data || u.data || [];
      const enList = en.data?.data || en.data || [];
      const arList = ar.data?.data || ar.data || [];
      const prList = Array.isArray(pr.data)
        ? pr.data
        : pr.data?.data || [];
      const payList = pay.data?.data || pay.data || [];
      setUsers(usersList);
      setEnrollments(enList);
      setArticles(arList);
      setPrograms(prList);
      const revenue = payList
        .filter((p) => p.status === "succeeded" || p.status === "captured")
        .reduce((s, p) => s + (p.amount || 0), 0);
      setKpis({
        users: usersList.length,
        enrollments: enList.length,
        revenue: revenue / 100,
        classes: 0,
      });
    } catch (err) {
      console.error(err);
      setProgramsError("Unable to load programs");
    } finally {
      setProgramsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createClass = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/classes", classForm);
      setMsg("Class scheduled");
      setClassForm({
        title: "",
        program: "",
        scheduledAt: "",
        durationMinutes: 60,
        joinUrl: "",
        type: "live",
      });
    } catch {
      setMsg("Could not create class");
    }
  };

  const toggleArticle = async (a) => {
    try {
      await api.put(`/articles/${a._id}`, { published: !a.published });
      setArticles((prev) =>
        prev.map((x) =>
          x._id === a._id ? { ...x, published: !x.published } : x,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const setRole = async (u, role) => {
    try {
      await api.put(`/users/${u._id}/role`, { role });
      setUsers((prev) =>
        prev.map((x) => (x._id === u._id ? { ...x, role } : x)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <header className="mb-10 pb-8 border-b border-forest/15">
          <p className="uppercase tracking-[0.25em] text-xs text-gold mb-2">
            Arsh Yoga · Admin
          </p>
          <h1 className="font-serif text-5xl text-forest">Studio Console</h1>
        </header>

        <nav className="flex gap-2 mb-10 flex-wrap">
          {TABS.map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-full text-sm transition ${
                tab === k
                  ? "bg-forest text-sand"
                  : "border border-forest/25 text-forest hover:bg-forest/5"
              }`}
            >
              {l}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Kpi label="Students" value={kpis.users} />
            <Kpi label="Enrollments" value={kpis.enrollments} />
            <Kpi label="Programs" value={programs.length} />
            <Kpi
              label="Revenue"
              value={`₹${kpis.revenue.toLocaleString("en-IN")}`}
            />
          </div>
        )}

        {tab === "classes" && (
          <form
            onSubmit={createClass}
            className="bg-white/70 rounded-2xl p-8 border border-forest/10 max-w-2xl space-y-5"
          >
            <h2 className="font-serif text-2xl text-forest">
              Schedule a new class
            </h2>
            <Field label="Title">
              <input
                required
                className="input"
                value={classForm.title}
                onChange={(e) =>
                  setClassForm({ ...classForm, title: e.target.value })
                }
              />
            </Field>
            <Field label="Program">
              <select
                required
                className="input"
                value={classForm.program}
                onChange={(e) =>
                  setClassForm({ ...classForm, program: e.target.value })
                }
              >
                <option value="">Select…</option>
                {programsLoading ? (
                  <option disabled>Loading programs…</option>
                ) : programsError ? (
                  <option disabled>{programsError}</option>
                ) : programs.length === 0 ? (
                  <option disabled>No programs available</option>
                ) : (
                  programs.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title}
                    </option>
                  ))
                )}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Date & time">
                <input
                  required
                  type="datetime-local"
                  className="input"
                  value={classForm.scheduledAt}
                  onChange={(e) =>
                    setClassForm({ ...classForm, scheduledAt: e.target.value })
                  }
                />
              </Field>
              <Field label="Duration (min)">
                <input
                  type="number"
                  className="input"
                  value={classForm.durationMinutes}
                  onChange={(e) =>
                    setClassForm({
                      ...classForm,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
            <Field label="Zoom join URL">
              <input
                className="input"
                placeholder="https://zoom.us/j/…"
                value={classForm.joinUrl}
                onChange={(e) =>
                  setClassForm({ ...classForm, joinUrl: e.target.value })
                }
              />
            </Field>
            <div className="flex items-center gap-4 pt-2">
              <button className="px-6 py-3 rounded-full bg-forest text-sand">
                Publish class
              </button>
              {msg && <span className="text-sm text-forest/70">{msg}</span>}
            </div>
          </form>
        )}

        {tab === "articles" && (
          <div className="bg-white/70 rounded-2xl border border-forest/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-forest/5 text-forest/70 text-xs uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr
                    key={a._id}
                    className="border-t border-forest/10 text-forest"
                  >
                    <td className="px-6 py-4 font-serif">{a.title}</td>
                    <td className="px-6 py-4 text-sm">
                      {a.author?.name || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {a.published ? "Published" : "Draft"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleArticle(a)}
                        className="px-4 py-2 rounded-full text-xs border border-forest/25 hover:bg-forest hover:text-sand transition"
                      >
                        {a.published ? "Unpublish" : "Publish"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "enrollments" && (
          <div className="bg-white/70 rounded-2xl border border-forest/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-forest/5 text-forest/70 text-xs uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Program</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((en) => (
                  <tr
                    key={en._id}
                    className="border-t border-forest/10 text-forest"
                  >
                    <td className="px-6 py-4 text-sm">
                      {en.user?.name || en.user?.email || "—"}
                    </td>
                    <td className="px-6 py-4 font-serif">
                      {en.program?.title || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {en.progress?.percent || 0}%
                    </td>
                    <td className="px-6 py-4 text-sm text-forest/60">
                      {en.createdAt
                        ? new Date(en.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "users" && (
          <div className="bg-white/70 rounded-2xl border border-forest/10 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-forest/5 text-forest/70 text-xs uppercase tracking-[0.2em]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-forest/10 text-forest"
                  >
                    <td className="px-6 py-4 font-serif">{u.name}</td>
                    <td className="px-6 py-4 text-sm">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => setRole(u, e.target.value)}
                        className="input !py-1.5 !px-3 text-sm w-auto"
                      >
                        <option value="student">student</option>
                        <option value="instructor">instructor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 9999px;
          border: 1px solid rgba(43,76,54,0.2);
          background: #fff;
          color: #2B4C36;
          outline: none;
          font-family: inherit;
        }
        .input:focus { border-color: #2B4C36; }
      `}</style>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="bg-white/70 rounded-2xl p-7 border border-forest/10">
      <p className="text-xs uppercase tracking-[0.25em] text-forest/60 mb-3">
        {label}
      </p>
      <p className="font-serif text-4xl text-forest">{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.2em] text-forest/60 mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
