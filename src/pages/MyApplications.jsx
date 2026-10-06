import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyApplications } from "../services/applicationService";

function formatDate(date) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function getStatusClasses(status) {
  if (status === "accepted") {
    return "bg-green-100 text-green-700";
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchApplications() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyApplications();

        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("Failed to load your applications.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-slate-500">Loading your applications...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{error}</h1>

          <button
            type="button"
            onClick={() => navigate("/job-seeker")}
            className="mt-6 rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Job Seeker
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Applications
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Track the jobs you have applied for and monitor their application
            status.
          </p>
        </section>

        {/* Applications count */}
        {applications.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Your submitted applications
            </p>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"}
            </span>
          </div>
        )}

        {/* Empty state */}
        {applications.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No applications yet
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              You haven't applied to any jobs yet. Explore available
              opportunities and submit an application.
            </p>

            <Link
              to="/job-seeker/jobs"
              className="mt-6 inline-flex rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              Browse Jobs
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {applications.map((application) => (
              <article
                key={application.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Job + Status */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                      Applied Job
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {application.job.title}
                    </h2>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                      application.status,
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-5">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Applied
                    </p>

                    <p className="mt-2 font-medium text-slate-900">
                      {formatDate(application.appliedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Description
                    </p>

                    <p className="mt-2 leading-7 text-slate-700">
                      {application.job.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Required Skills
                    </p>

                    <p className="mt-2 leading-7 text-slate-700">
                      {application.job.requiredskill}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Application Deadline
                    </p>

                    <p className="mt-2 font-medium text-slate-900">
                      {formatDeadline(application.job.deadline)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default MyApplications;
