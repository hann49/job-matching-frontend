import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    console.error("Failed to read user:", error);
  }

  const isLoggedIn = !!accessToken && !!user;
  const role = user?.role?.toLowerCase();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const navLinkClass =
    "font-medium text-slate-600 transition hover:text-brand-navy";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 text-white"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="5" y="7" width="14" height="12" rx="2" />
              <path d="M9 7V5.5C9 4.67 9.67 4 10.5 4h3c.83 0 1.5.67 1.5 1.5V7" />
              <path d="M12 11v5" />
              <path d="M9.5 13.5h5" />
            </svg>
          </span>

          <span className="text-2xl font-bold tracking-tight text-brand-navy">
            JobMatch
          </span>
        </Link>

        {/* Logged Out */}
        {!isLoggedIn && (
          <div className="ml-auto flex items-center gap-5">
            <Link
              to="/login"
              className="font-semibold text-slate-700 transition hover:text-brand-navy"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-brand-navy px-5 py-2.5 font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              Get Started
            </Link>
          </div>
        )}

        {/* Logged In */}
        {isLoggedIn && (
          <div className="ml-auto flex items-center gap-7">
            {/* Job Seeker Navigation */}
            {role === "job_seeker" && (
              <>
                <Link to="/job-seeker" className={navLinkClass}>
                  Dashboard
                </Link>

                <Link to="/job-seeker/jobs" className={navLinkClass}>
                  Jobs
                </Link>

                <Link to="/job-seeker/applications" className={navLinkClass}>
                  Applications
                </Link>

                <Link to="/job-seeker/for-you" className={navLinkClass}>
                  For You
                </Link>

                <Link to="/job-seeker/profile" className={navLinkClass}>
                  Profile
                </Link>
              </>
            )}

            {/* Employer Navigation */}
            {role === "employer" && (
              <>
                <Link to="/employer" className={navLinkClass}>
                  Dashboard
                </Link>

                <Link to="/employer/jobs" className={navLinkClass}>
                  Jobs
                </Link>

                <Link to="/employer/applications" className={navLinkClass}>
                  Applications
                </Link>

                <Link to="/employer/profile" className={navLinkClass}>
                  Profile
                </Link>
              </>
            )}

            {/* Admin Navigation */}
            {role === "admin" && (
              <>
                <Link to="/admin" className={navLinkClass}>
                  Dashboard
                </Link>
              </>
            )}

            {/* Role Badge */}
            <div className="hidden items-center gap-2 rounded-full bg-brand-cyan px-4 py-2 text-sm font-semibold text-brand-navy sm:flex">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M5.5 19c.9-3.2 3.1-5 6.5-5s5.6 1.8 6.5 5" />
              </svg>

              {role === "job_seeker"
                ? "Job Seeker"
                : role === "employer"
                  ? "Employer"
                  : "Admin"}
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-2 font-semibold text-slate-700 transition hover:text-brand-navy"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M10 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H10" />
                <path d="M14 8l4 4-4 4" />
                <path d="M18 12H9" />
              </svg>
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
