import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generateMatches, getMatches } from "../services/matchingService";

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function ForYou() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        await generateMatches();

        const data = await getMatches();

        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.error("Recommended jobs error:", error);
        setError("Failed to load recommended jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Recommendations
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Recommended for You
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Jobs matched to your skills and profile.
          </p>
        </section>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-slate-500">
              Finding jobs that match your profile...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <p className="font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* No Matches */}
        {!loading && !error && matches.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No matching jobs yet
            </h2>

            <p className="mt-2 text-slate-500">
              Check back soon as new opportunities become available.
            </p>

            <Link
              to="/job-seeker/jobs"
              className="mt-6 inline-flex rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Matches */}
        {!loading && !error && matches.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-2">
            {matches.map((match) => (
              <article
                key={match.job.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {match.job.title}
                  </h2>

                  <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                    {match.matchScore}%
                  </span>
                </div>

                <p className="mt-4 leading-7 text-slate-600">
                  {match.job.description}
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Required Skills
                    </p>

                    <p className="mt-2 leading-7 text-slate-800">
                      {match.job.requiredskill}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Application Deadline
                    </p>

                    <p className="mt-2 font-medium text-slate-800">
                      {formatDeadline(match.job.deadline)}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/job-seeker/jobs/${match.job.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand-navy px-5 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
                >
                  View Job
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default ForYou;
