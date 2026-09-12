import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadResumes = () => {
    api.get("/resumes").then(({ data }) => setResumes(data)).finally(() => setLoading(false));
  };

  useEffect(loadResumes, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      loadResumes();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleCreateBlank = async () => {
    const { data } = await api.post("/resumes", { title: "Untitled Resume" });
    setResumes((r) => [data, ...r]);
  };

  const handleDelete = async (id) => {
    await api.delete(`/resumes/${id}`);
    setResumes((r) => r.filter((res) => res._id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-serif text-3xl font-semibold">Your resumes</h1>
        <div className="flex items-center gap-3">
          <label className="rounded-full border border-ink px-4 py-2 text-sm cursor-pointer hover:bg-ink hover:text-paper transition-colors">
            {uploading ? "Uploading…" : "Upload file"}
            <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
          </label>
          <button
            onClick={handleCreateBlank}
            className="rounded-full bg-ink text-paper px-4 py-2 text-sm hover:bg-cobalt transition-colors"
          >
            Write from scratch
          </button>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/60 text-sm">Loading…</p>
      ) : resumes.length === 0 ? (
        <div className="border border-dashed border-line rounded-sm p-12 text-center text-ink/60">
          No resumes yet. Upload a PDF/Word file or start one from scratch.
        </div>
      ) : (
        <ul className="divide-y divide-line border border-line rounded-sm">
          {resumes.map((r) => (
            <li key={r._id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-ink/50 mt-0.5">
                  {r.lastScore?.matchPercent != null
                    ? `Last score: ${r.lastScore.matchPercent}%`
                    : "Not scanned yet"}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <Link to={`/resumes/${r._id}`} className="text-cobalt hover:underline">Edit</Link>
                <Link to={`/ats-checker?resumeId=${r._id}`} className="text-cobalt hover:underline">
                  Scan
                </Link>
                <button onClick={() => handleDelete(r._id)} className="text-ink/40 hover:text-red-600">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
