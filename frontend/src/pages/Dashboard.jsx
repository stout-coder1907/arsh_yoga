import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import ProgramSearchSelect from "../components/ProgramSearchSelect.jsx";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("programs");
  const [enrollments, setEnrollments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [programSearch, setProgramSearch] = useState("");
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    healthFocus: user?.wellnessProfile?.healthFocus || "",
    experienceLevel: user?.wellnessProfile?.experienceLevel || "beginner",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [e, c] = await Promise.all([
          api.get("/users/me/enrollments"),
          api.get("/classes/student-view"),
        ]);
        const enrollmentList = e.data?.data || e.data || [];
        setEnrollments(enrollmentList);
        setClasses(c.data?.data || c.data || []);

        if (enrollmentList.length > 0) {
          const firstProgram = enrollmentList[0].program;
          setSelectedProgram(firstProgram || null);
          setProgramSearch(firstProgram?.title || firstProgram?.name || "");
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await api.put("/users/profile", {
        name: profile.name,
        wellnessProfile: {
          healthFocus: profile.healthFocus,
          experienceLevel: profile.experienceLevel,
        },
      });
      setMsg("Saved");
    } catch (err) {
      setMsg("Could not save");
    } finally {
      setSaving(false);
    }
  };

  const fmtDate = (d) =>
    new Date(d).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const fmtClassLogDate = (d) =>
    new Date(d).toLocaleString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const selectedProgramId = selectedProgram?._id || selectedProgram?.id;
  const selectedProgramClasses = selectedProgramId
    ? classes.filter((c) => {
        const classProgramId = c.program?._id || c.program?.id || c.program;
        return classProgramId && String(classProgramId) === String(selectedProgramId);
      })
    : [];
  const hasScheduledClasses = selectedProgramClasses.length > 0;

  return (
    <div className="min-h-screen bg-sand">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 pb-8 border-b border-forest/15">
          <div>
            <p className="uppercase tracking-[0.25em] text-xs text-forest/60 mb-2">
              Namaste
            </p>
            <h1 className="font-serif text-5xl text-forest">
              {user?.name || "Student"}
            </h1>
            <p className="text-forest/70 mt-2">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-full border border-forest/30 text-forest hover:bg-forest hover:text-sand transition self-start md:self-end"
          >
            Sign out
          </button>
        </header>

        <nav className="flex gap-2 mb-10 flex-wrap">
          {[
            ["programs", "My Programs"],
            ["live", "Upcoming Live"],
            ["profile", "Profile Settings"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-5 py-2 rounded-full text-sm tracking-wide transition ${
                tab === k
                  ? "bg-forest text-sand"
                  : "border border-forest/25 text-forest hover:bg-forest/5"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === "programs" && (
          <section className="grid md:grid-cols-2 gap-6">
            {enrollments.length === 0 && (
              <div className="md:col-span-2 bg-white/60 rounded-2xl p-10 text-center border border-forest/10">
                <p className="font-serif text-2xl text-forest mb-3">
                  Your journey awaits
                </p>
                <p className="text-forest/70 mb-6">
                  You haven't enrolled in a program yet.
                </p>
                <Link
                  to="/programs"
                  className="inline-block px-6 py-3 rounded-full bg-forest text-sand"
                >
                  Browse programs
                </Link>
              </div>
            )}

            <div className="md:col-span-2 bg-white/70 rounded-2xl p-7 border border-forest/10">
              <ProgramSearchSelect
                label="Select enrolled program"
                programs={enrollments
                  .map((en) => en.program)
                  .filter((program) => program)
                  .filter(
                    (program, index, self) =>
                      self.findIndex(
                        (item) =>
                          (item._id || item.id) === (program._id || program.id),
                      ) === index,
                  )}
                selectedProgram={selectedProgram}
                query={programSearch}
                onQueryChange={setProgramSearch}
                onProgramSelect={(program) => {
                  setSelectedProgram(program);
                  setProgramSearch(program?.title || program?.name || "");
                }}
              />

              {selectedProgram && (
                <div className="mt-4 rounded-2xl border border-forest/10 bg-sand p-4">
                  <p className="text-sm text-forest/70">Class Log</p>
                  <h3 className="font-serif text-xl text-forest mt-1">
                    {selectedProgram.title || selectedProgram.name}
                  </h3>

                  {selectedProgramClasses.length === 0 ? (
                    <p className="text-forest/70 mt-3">
                      No live classes scheduled yet.
                    </p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {selectedProgramClasses
                        .slice()
                        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
                        .map((classItem) => {
                          const isCompleted = new Date(classItem.scheduledAt) < new Date();

                          return (
                            <li
                              key={classItem._id || classItem.id}
                              className="text-sm text-forest/70"
                            >
                              • {classItem.title || "Untitled class"} — {fmtClassLogDate(classItem.scheduledAt)} — {isCompleted ? "Completed" : "Upcoming"}
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </div>
              )}
            </div>

          </section>
        )}

        {tab === "live" && (
          <section className="space-y-4">
            {classes.length === 0 && (
              <p className="text-forest/70">No upcoming live classes.</p>
            )}
            {classes.map((c) => (
              <div
                key={c._id}
                className="bg-white/70 rounded-2xl p-6 border border-forest/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <p className="uppercase tracking-[0.2em] text-[10px] text-gold mb-1">
                    {c.type || "Live"}
                  </p>
                  <h4 className="font-serif text-xl text-forest">{c.title}</h4>
                  <p className="text-sm text-forest/70 mt-1">
                    {c.scheduledAt ? fmtDate(c.scheduledAt) : "TBA"} ·{" "}
                    {c.durationMinutes || 60} min
                  </p>
                </div>
                {c.joinUrl ? (
                  <a
                    href={c.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-forest text-sand text-sm whitespace-nowrap"
                  >
                    Join Zoom
                  </a>
                ) : (
                  <span className="text-xs text-forest/50">
                    Link opens 15 min before
                  </span>
                )}
              </div>
            ))}
          </section>
        )}

        {tab === "profile" && (
          <form
            onSubmit={saveProfile}
            className="bg-white/70 rounded-2xl p-8 border border-forest/10 max-w-2xl space-y-5"
          >
            <Field label="Full name">
              <input
                className="input"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </Field>
            <Field label="Email">
              <input className="input" value={profile.email} disabled />
            </Field>
            <Field label="Health focus">
              <input
                className="input"
                placeholder="PCOS, fertility, stress…"
                value={profile.healthFocus}
                onChange={(e) =>
                  setProfile({ ...profile, healthFocus: e.target.value })
                }
              />
            </Field>
            <Field label="Experience level">
              <select
                className="input"
                value={profile.experienceLevel}
                onChange={(e) =>
                  setProfile({ ...profile, experienceLevel: e.target.value })
                }
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </Field>
            <div className="flex items-center gap-4 pt-2">
              <button
                disabled={saving}
                className="px-6 py-3 rounded-full bg-forest text-sand disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
              {msg && <span className="text-sm text-forest/70">{msg}</span>}
            </div>
          </form>
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
          font-family: inherit;
          outline: none;
        }
        .input:focus { border-color: #2B4C36; }
      `}</style>
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
