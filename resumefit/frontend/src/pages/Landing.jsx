import { Link } from "react-router-dom";

const steps = [
  {
    mark: "Scan",
    title: "Upload your resume",
    body: "Drop in a PDF or Word file. We read it exactly as an ATS would — plain text, no formatting assumptions.",
  },
  {
    mark: "Compare",
    title: "Paste the job description",
    body: "We pull out the terms the listing actually weights, not just the obvious ones buried in the requirements list.",
  },
  {
    mark: "Fix",
    title: "See what's missing",
    body: "A match score plus the exact keywords to add — so every edit you make is one an ATS will actually notice.",
  },
];

export default function Landing() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
        <div>
          <p className="text-sm uppercase tracking-wide text-cobalt font-medium mb-4">For job seekers</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] font-semibold text-ink">
            Most resumes never
            <br />
            reach a human being.
          </h1>
          <p className="mt-6 text-lg text-ink/70 max-w-md leading-relaxed">
            Applicant tracking systems filter out qualified people every day over
            missing keywords. ResumeFit shows you exactly what a bot is looking
            for, and what your resume is missing, before you hit submit.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/register"
              className="rounded-full bg-ink text-paper px-6 py-3 font-medium hover:bg-cobalt transition-colors"
            >
              Scan your resume, free
            </Link>
            <Link to="/pricing" className="text-sm font-medium underline decoration-line underline-offset-4">
              See plans
            </Link>
          </div>
        </div>

        <div className="border border-line rounded-sm p-6 bg-white/60 relative overflow-hidden">
          <div className="text-xs uppercase tracking-wide text-ink/50 mb-3">Sample scan</div>
          <div className="space-y-2 text-sm font-mono text-ink/70">
            <p>react ✓&nbsp;&nbsp;&nbsp;node.js ✓&nbsp;&nbsp;&nbsp;mongodb ✓</p>
            <p className="text-amber">rest api — missing</p>
            <p className="text-amber">ci/cd — missing</p>
            <p>typescript ✓</p>
          </div>
          <div className="mt-6 pt-4 border-t border-line flex items-baseline justify-between">
            <span className="text-sm text-ink/50">Match score</span>
            <span className="font-serif text-4xl font-semibold text-cobalt">71%</span>
          </div>
          <div className="absolute left-0 right-0 top-1/2 h-px bg-cobalt/30" />
        </div>
      </section>

      <section className="border-t border-line bg-white/40">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-serif text-3xl font-semibold mb-12 max-w-md">
            Three steps between you and an interview.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.title} className="border-l border-line pl-6">
                <div className="text-cobalt font-medium text-sm mb-3">{s.mark}</div>
                <h3 className="font-serif text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-ink/70 text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold max-w-xl mx-auto leading-snug">
          Built for job seekers. Ready for teams helping them.
        </h2>
        <p className="mt-4 text-ink/70 max-w-md mx-auto">
          Career coaches and campus placement offices can invite their whole
          team, share a workspace, and track everyone's scans in one place.
        </p>
        <Link
          to="/register"
          className="inline-block mt-8 rounded-full bg-cobalt text-paper px-6 py-3 font-medium hover:bg-ink transition-colors"
        >
          Create your workspace
        </Link>
      </section>
    </div>
  );
}
