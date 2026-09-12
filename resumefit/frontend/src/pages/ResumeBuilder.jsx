import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    api.get(`/resumes/${id}`).then(({ data }) => setResume(data));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await api.put(`/resumes/${id}`, { title: resume.title, rawText: resume.rawText });
    setSaving(false);
    setSavedAt(new Date());
  };

  if (!resume) return <div className="p-16 text-center text-ink/60">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <button onClick={() => navigate(-1)} className="text-sm text-ink/60 hover:underline mb-6">
        ← Back
      </button>
      <input
        value={resume.title}
        onChange={(e) => setResume({ ...resume, title: e.target.value })}
        className="w-full font-serif text-2xl font-semibold mb-4 bg-transparent focus:outline-none border-b border-transparent focus:border-line pb-1"
      />
      <textarea
        value={resume.rawText}
        onChange={(e) => setResume({ ...resume, rawText: e.target.value })}
        rows={20}
        placeholder="Paste or write your resume content here — plain text is fine, this is exactly what an ATS sees."
        className="w-full border border-line rounded-sm p-4 bg-white/60 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-cobalt"
      />
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-ink text-paper px-5 py-2 text-sm hover:bg-cobalt transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {savedAt && <span className="text-xs text-ink/50">Saved {savedAt.toLocaleTimeString()}</span>}
      </div>
    </div>
  );
}
