import { useEffect, useMemo, useState } from "react";

export default function ProgramSearchSelect({
  label,
  programs,
  selectedProgram,
  onProgramSelect,
  placeholder = "Search programs…",
}) {
  const [query, setQuery] = useState(selectedProgram?.title || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(selectedProgram?.title || "");
  }, [selectedProgram]);

  const filteredPrograms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return programs;
    return programs.filter((program) => {
      const title = (program?.title || program?.name || "").toLowerCase();
      return title.includes(normalized);
    });
  }, [programs, query]);

  const handleSelect = (program) => {
    setQuery(program?.title || program?.name || "");
    setOpen(false);
    onProgramSelect(program);
  };

  return (
    <div className="relative">
      <label className="block text-xs uppercase tracking-[0.2em] text-forest/60 mb-2">
        {label}
      </label>
      <input
        className="input"
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />

      {open && (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-2xl border border-forest/10 bg-white shadow-lg">
          {filteredPrograms.length === 0 ? (
            <div className="p-3 text-sm text-forest/70">No matching programs</div>
          ) : (
            filteredPrograms.map((program) => {
              const programId = program._id || program.id;
              const programTitle = program.title || program.name || "Untitled program";
              return (
                <button
                  key={programId}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(program)}
                  className="w-full text-left px-4 py-3 hover:bg-forest/10 text-forest"
                >
                  {programTitle}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
