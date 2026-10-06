import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyJobs } from "../services/jobService";
import { getApplicationsForJob } from "../services/applicationService";

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function getTodayString() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().split("T")[0];
}

function Employer() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const companyProfileKey = user?.id ? `companyProfile_${user.id}` : null;

  let savedCompanyProfile = null;

  try {
    savedCompanyProfile = companyProfileKey
      ? JSON.parse(localStorage.getItem(companyProfileKey) || "null")
      : null;
  } catch {
    savedCompanyProfile = null;
  }

  const companyName =
    savedCompanyProfile?.companyName || user?.fullname || "Employer";

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const myJobs = await getMyJobs();

        const jobList = Array.isArray(myJobs) ? myJobs : [];

        setJobs(jobList);

        const results = await Promise.all(
          jobList.map(async (job) => {
            try {
              const data = await getApplicationsForJob(job.id);

              return Array.isArray(data)
                ? data.map((application) => ({
                    ...application,
                    job,
                  }))
                : [];
            } catch (error) {
              console.error(`Applications error for job ${job.id}:`, error);

              return [];
            }
          }),
        );

        setApplications(results.flat());
      } catch (error) {
        console.error("Employer dashboard error:", error);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const today = getTodayString();

  const openJobs = jobs.filter((job) => !job.deadline || job.deadline >= today);

  const totalApplicants = applications.length;

  const hires = applications.filter(
    (application) => application.status === "accepted",
  ).length;

  const recentApplicants = [...applications]
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
    .slice(0, 5);

  const getApplicationCount = (jobId) =>
    applications.filter((application) => application.job?.id === jobId).length;

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-lg text-slate-500">Loading dashboard...</p>
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
        {/* Dashboard Header */}
        <section className="mb-8 rounded-3xl border border-[#DFECFA] bg-gradient-to-br from-[#EBF3FC] to-[#F3F8FE] px-8 py-10 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Employer Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {companyName}
              </h1>

              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Manage your job opportunities and review candidates.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/employer/post-job"
                className="rounded-lg bg-brand-navy px-6 py-3 text-center font-semibold !text-white transition hover:bg-brand-navy-light"
              >
                Post a Job
              </Link>

              <Link
                to="/employer/applications"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Review Applicants
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Open Jobs
            </p>

            <p className="mt-3 text-4xl font-bold text-brand-navy">
              {openJobs.length}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Total Applicants
            </p>

            <p className="mt-3 text-4xl font-bold text-brand-navy">
              {totalApplicants}
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Hires
            </p>

            <p className="mt-3 text-4xl font-bold text-brand-navy">{hires}</p>
          </article>
        </section>

        {/* Recent Applicants + Your Jobs */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Recent Applicants */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Candidates
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Recent Applicants
              </h2>
            </div>

            {recentApplicants.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <p className="font-medium text-slate-700">No applicants yet</p>

                <p className="mt-2 text-sm text-slate-500">
                  Applicants will appear here when job seekers apply.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplicants.map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {application.applicant?.fullname || "Applicant"}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {application.job?.title}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                      {application.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {recentApplicants.length > 0 && (
              <Link
                to="/employer/applications"
                className="mt-6 inline-flex rounded-lg bg-brand-navy px-5 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
              >
                View All Applicants
              </Link>
            )}
          </article>

          {/* Your Jobs */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Listings
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Your Jobs
                </h2>
              </div>

              <Link
                to="/employer/jobs"
                className="text-sm font-semibold text-brand-navy hover:underline"
              >
                View all
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <p className="font-medium text-slate-700">No jobs posted yet</p>

                <Link
                  to="/employer/post-job"
                  className="mt-4 inline-flex rounded-lg bg-brand-navy px-5 py-3 font-semibold !text-white"
                >
                  Post a Job
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.slice(0, 4).map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {job.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Deadline: {formatDeadline(job.deadline)}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {getApplicationCount(job.id)}{" "}
                      {getApplicationCount(job.id) === 1
                        ? "applicant"
                        : "applicants"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

export default Employer;
