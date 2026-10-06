import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getJobs } from "../services/jobService";

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();

  const isJobSeekerJobs =
    location.pathname.startsWith("/job-seeker/jobs");

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs();

        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Jobs error:", error);
        setError("Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return jobs;
    }

    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";
      const skills = job.requiredskill?.toLowerCase() || "";

      return (
        title.includes(term) ||
        description.includes(term) ||
        skills.includes(term)
      );
    });
  }, [jobs, searchTerm]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-slate-500">
            Loading jobs...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium text-red-600">
            {error}
          </p>
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
            Job Search
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Open Roles
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Explore available opportunities and find a role that
            matches your skills and interests.
          </p>
        </section>

        {/* Search */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="job-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search jobs
          </label>

          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>

            <input
              id="job-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, skills, or description..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>

        {/* No jobs at all */}
        {jobs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No jobs available
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              There are currently no job postings available.
              Please check back later.
            </p>
          </section>
        ) : filteredJobs.length === 0 ? (
          /* No search results */
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No matching jobs found
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Try another job title, skill, or keyword.
            </p>

            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-6 rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              Clear Search
            </button>
          </section>
        ) : (
          <>
            {/* Result count */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                {filteredJobs.length}{" "}
                {filteredJobs.length === 1 ? "job" : "jobs"} found
              </p>
            </div>

            {/* Jobs */}
            <section className="grid gap-6 md:grid-cols-2">
              {filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                      Open Role
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {job.title}
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-6 space-y-4">

                    {/* Skills */}
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Required Skills
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {job.requiredskill}
                      </p>
                    </div>

                    {/* Deadline */}
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Application Deadline
                      </p>

                      <p className="mt-2 font-medium text-slate-800">
                        {formatDeadline(job.deadline)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={
                      isJobSeekerJobs
                        ? `/job-seeker/jobs/${job.id}`
                        : `/jobs/${job.id}`
                    }
                    className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-navy px-6 py-3.5 font-semibold !text-white shadow-md transition hover:bg-brand-navy-light"
                  >
                    View Details
                  </Link>
                </article>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default Jobs;