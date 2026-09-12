import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";

export default function AtsChecker() {
  const [searchParams] = useSearchParams();
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState(searchParams.get("resumeId") || "");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/resumes").then(({ data }) => {
      setResumes(data);
      if (!resumeId && data.length) setResumeId(data[0]._id);
    });
  }, []);

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    setResult(null);
    try {
      const { data } = await api.post("/ats/score", { resumeId, jobDescription });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't score this resume");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold mb-2">Scan a resume</h1>
      <p className="text-ink/60 mb-8 text-sm">
        Pick a resume, paste in a job description, and see the exact keyword gap.
      </p>

      <form onSubmit={handleScan} className="space-y-4">
        <div>
          <label className="text-sm text-ink/70">Resume</label>
          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="mt-1 w-full border border-line rounded-sm px-3 py-2 bg-white/60 focus:outline-none focus:ring-2 focus:ring-cobalt"
          >
            <option value="" disabled>Choose a resume</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>{r.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-ink/70">Job description</label>
          <textarea
            required
            rows={10}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job posting here"
            className="mt-1 w-full border border-line rounded-sm p-3 bg-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-cobalt"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !resumeId}
          className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm hover:bg-cobalt transition-colors disabled:opacity-50"
        >
          {busy ? "Scanning…" : "Scan against this job"}
        </button>
      </form>

      {result && (
        <div className="mt-10 border border-line rounded-sm p-6 bg-white/60">
          <div className="flex items-baseline justify-between mb-6">
            <span className="text-sm text-ink/60">Match score</span>
            <span className="font-serif text-5xl font-semibold text-cobalt">{result.matchPercent}%</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">Matched keywords</p>
              <div className="flex flex-wrap gap-2">
                {result.matchedKeywords.length ? result.matchedKeywords.map((k) => (
                  <span key={k} className="text-xs bg-cobalt/10 text-cobalt px-2 py-1 rounded-sm">{k}</span>
                )) : <span className="text-sm text-ink/40">None yet</span>}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink/50 mb-2">Missing keywords</p>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length ? result.missingKeywords.map((k) => (
                  <span key={k} className="text-xs bg-amber/20 text-amber px-2 py-1 rounded-sm">{k}</span>
                )) : <span className="text-sm text-ink/40">Nothing missing — great fit</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
