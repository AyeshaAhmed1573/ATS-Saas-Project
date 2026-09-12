import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Team() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  const load = () => api.get("/team").then(({ data }) => setData(data));
  useEffect(() => { load(); }, []);

  const handleRemove = async (userId) => {
    await api.delete(`/team/${userId}`);
    load();
  };

  if (!data) return <div className="p-16 text-center text-ink/60">Loading…</div>;

  const canManage = user?.role === "owner" || user?.role === "admin";

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold mb-2">{data.organization.name}</h1>
      <p className="text-ink/60 text-sm mb-8">
        {data.organization.seatsUsed} member{data.organization.seatsUsed !== 1 ? "s" : ""} ·{" "}
        Invite code <span className="font-mono">{data.organization.inviteCode}</span>
      </p>

      <ul className="divide-y divide-line border border-line rounded-sm">
        {data.members.map((m) => (
          <li key={m._id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-ink/50">{m.email} · {m.role}</p>
            </div>
            {canManage && m._id !== user.id && (
              <button onClick={() => handleRemove(m._id)} className="text-sm text-ink/40 hover:text-red-600">
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-ink/60">
        Share the invite code above with teammates — they can join from the registration
        screen using it.
      </p>
    </div>
  );
}
