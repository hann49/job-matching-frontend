import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

function JobSeekerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navClass = (active) =>
    `relative whitespace-nowrap px-3 py-2 text-base font-medium transition ${
      active ? "text-brand-navy" : "text-slate-600 hover:text-brand-navy"
    }`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
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

          {/* Center Navigation */}
          <nav className="ml-auto mr-auto flex items-center gap-7">
            <Link
              to="/job-seeker"
              className={navClass(isActive("/job-seeker"))}
            >
              Dashboard
              {isActive("/job-seeker") && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-navy" />
              )}
            </Link>

            <Link
              to="/job-seeker/jobs"
              className={navClass(
                location.pathname.startsWith("/job-seeker/jobs"),
              )}
            >
              Jobs
              {location.pathname.startsWith("/job-seeker/jobs") && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-navy" />
              )}
            </Link>

            <Link
              to="/job-seeker/applications"
              className={navClass(
                location.pathname === "/job-seeker/applications",
              )}
            >
              Applications
              {location.pathname === "/job-seeker/applications" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-navy" />
              )}
            </Link>

            <Link
              to="/job-seeker/for-you"
              className={navClass(location.pathname === "/job-seeker/for-you")}
            >
              For You
              {location.pathname === "/job-seeker/for-you" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-navy" />
              )}
            </Link>

            <Link
              to="/job-seeker/profile"
              className={navClass(location.pathname === "/job-seeker/profile")}
            >
              Profile
              {location.pathname === "/job-seeker/profile" && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand-navy" />
              )}
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex shrink-0 items-center gap-5">
            {/* Role */}
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
              Job Seeker
            </div>

            {/* Sign Out */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-brand-navy"
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
        </div>
      </header>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default JobSeekerLayout;
