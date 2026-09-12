import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const plans = [
  {
    name: "Free",
    price: "$0",
    tagline: "For your own job search",
    features: ["Up to 3 resumes", "Unlimited ATS scans", "1 workspace member"],
  },
  {
    name: "Pro",
    price: "$12/mo",
    tagline: "For coaches and placement teams",
    features: ["Unlimited resumes", "Unlimited ATS scans", "Unlimited team members", "Shared workspace"],
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) api.get("/billing/status").then(({ data }) => setStatus(data));
  }, [user]);

  const handleUpgrade = async () => {
    setBusy(true);
    try {
      const { data } = await api.post("/billing/checkout");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.message || "Billing isn't set up yet");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold mb-2">Plans</h1>
      <p className="text-ink/60 mb-10 text-sm">Start free. Upgrade when your team grows.</p>

      <div className="grid sm:grid-cols-2 gap-6">
        {plans.map((p) => {
          const isCurrent = status?.plan === p.name.toLowerCase();
          return (
            <div key={p.name} className="border border-line rounded-sm p-6 bg-white/60">
              <p className="text-sm text-ink/60">{p.tagline}</p>
              <h2 className="font-serif text-2xl font-semibold mt-1">{p.name}</h2>
              <p className="text-3xl font-semibold mt-4 mb-6">{p.price}</p>
              <ul className="space-y-2 text-sm text-ink/70 mb-6">
                {p.features.map((f) => <li key={f}>· {f}</li>)}
              </ul>
              {p.name === "Pro" && user && (
                <button
                  onClick={handleUpgrade}
                  disabled={busy || isCurrent}
                  className="w-full rounded-full bg-ink text-paper py-2.5 text-sm hover:bg-cobalt transition-colors disabled:opacity-50"
                >
                  {isCurrent ? "Current plan" : busy ? "Redirecting…" : "Upgrade"}
                </button>
              )}
              {isCurrent && p.name === "Free" && (
                <div className="text-xs text-ink/50">Your current plan</div>
              )}
            </div>
          );
        })}
      </div>
      {status && !status.billingEnabled && (
        <p className="text-xs text-ink/40 mt-6">
          Billing is scaffolded but not live — add Stripe keys to the backend .env to accept
          real payments.
        </p>
      )}
    </div>
  );
}
