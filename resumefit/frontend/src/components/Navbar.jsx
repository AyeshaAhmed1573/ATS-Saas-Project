import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-semibold tracking-tight">
          ResumeFit
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-cobalt">Dashboard</Link>
              <Link to="/ats-checker" className="hover:text-cobalt">Scan a resume</Link>
              <Link to="/team" className="hover:text-cobalt">Team</Link>
              <Link to="/pricing" className="hover:text-cobalt">Plan</Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="rounded-full border border-ink px-4 py-1.5 hover:bg-ink hover:text-paper transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/pricing" className="hover:text-cobalt">Pricing</Link>
              <Link to="/login" className="hover:text-cobalt">Sign in</Link>
              <Link
                to="/register"
                className="rounded-full bg-ink text-paper px-4 py-1.5 hover:bg-cobalt transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
