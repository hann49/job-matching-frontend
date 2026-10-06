import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyJobs } from "../services/jobService";
import { getApplicationsForJob } from "../services/applicationService";

function EmployerApplicationsHub() {
  const [activeTab, setActiveTab] = useState("received");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);
        setError("");

        const myJobs = await getMyJobs();

        const jobList = Array.isArray(myJobs) ? myJobs : [];

        const results = await Promise.all(
          jobList.map(async (job) => {
            try {
              const data = await getApplicationsForJob(job.id);

              const applications = Array.isArray(data)
                ? data
                : [];

              return {
                ...job,
                applications,
                applicantCount: applications.length,
                acceptedCount: applications.filter(
                  (application) =>
                    application.status === "accepted",
                ).length,
              };
            } catch (error) {
              console.error(
                `Applications error for job ${job.id}:`,
                error,
              );

              return {
                ...job,
                applications: [],
                applicantCount: 0,
                acceptedCount: 0,
              };
            }
          }),
        );

        setJobs(results);
      } catch (error) {
        console.error("Employer applications error:", error);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, []);

  const displayedJobs =
    activeTab === "received"
      ? jobs.filter((job) => job.applicantCount > 0)
      : jobs.filter((job) => job.acceptedCount > 0);

  const tabClass = (active) =>
    `rounded-lg px-6 py-3 text-sm font-semibold transition ${
      active
        ? "bg-brand-navy text-white"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
    }`;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-slate-500">
            Loading applications...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-red-600">{error}</p>
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
            Hiring Management
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Applications
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Review applications received for your job postings.
          </p>
        </section>

        {/* Tabs */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("received")}
              className={tabClass(activeTab === "received")}
            >
              Received
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("accepted")}
              className={tabClass(activeTab === "accepted")}
            >
              Accepted
            </button>
          </div>
        </section>

        {/* Empty state */}
        {displayedJobs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              {activeTab === "received"
                ? "No applications received yet"
                : "No accepted applications yet"}
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              {activeTab === "received"
                ? "Applications will appear here when job seekers apply to your jobs."
                : "Accepted applications will appear here after you accept applicants."}
            </p>

            <Link
              to="/employer/jobs"
              className="mt-6 inline-flex rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white"
            >
              View Jobs
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {displayedJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Job
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {job.title}
                </h2>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Applications
                    </p>

                    <p className="mt-2 text-2xl font-bold text-brand-navy">
                      {job.applicantCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Accepted
                    </p>

                    <p className="mt-2 text-2xl font-bold text-green-700">
                      {job.acceptedCount}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/employer/applications/job/${job.id}`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand-navy px-5 py-3 font-semibold !text-white"
                >
                  View Applicants
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default EmployerApplicationsHub;