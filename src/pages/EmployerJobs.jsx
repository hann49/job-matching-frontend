import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyJobs, updateJob, deleteJob } from "../services/jobService";

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function EmployerJobs() {
  const location = useLocation();

  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.success || "");

  const [editingJobId, setEditingJobId] = useState(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editRequiredSkill, setEditRequiredSkill] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getMyJobs();

        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Employer jobs error:", error);
        setError("Failed to load your jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  function handleEditClick(job) {
    setEditingJobId(job.id);
    setEditTitle(job.title);
    setEditDescription(job.description);
    setEditRequiredSkill(job.requiredskill);
    setEditDeadline(job.deadline);

    setSuccess("");
    setError("");
  }

  async function handleUpdateJob(jobId) {
    try {
      setSuccess("");
      setError("");

      const data = await updateJob(
        jobId,
        editTitle,
        editDescription,
        editRequiredSkill,
        editDeadline,
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === jobId ? data.job : job)),
      );

      setEditingJobId(null);
      setSuccess("Job updated successfully.");
    } catch (error) {
      console.error("Update job error:", error);
      setError(error.message || "Failed to update job.");
    }
  }

  async function handleDeleteJob(jobId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmed) return;

    try {
      setSuccess("");
      setError("");

      await deleteJob(jobId);

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));

      setSuccess("Job deleted successfully.");
    } catch (error) {
      console.error("Delete job error:", error);
      setError(error.message || "Failed to delete job.");
    }
  }

  const term = searchTerm.trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    if (!term) return true;

    return (
      job.title?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      job.requiredskill?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-lg text-slate-500">Loading jobs...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Job Management
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Open Roles
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Manage your published opportunities and review their applicants.
              </p>
            </div>

            <Link
              to="/employer/post-job"
              className="rounded-lg bg-brand-navy px-6 py-3 text-center font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              + Post a Job
            </Link>
          </div>
        </section>

        {/* Messages */}
        {success && (
          <p className="mb-6 rounded-xl bg-green-50 px-5 py-4 font-medium text-green-700">
            {success}
          </p>
        )}

        {error && (
          <p className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">
            {error}
          </p>
        )}

        {/* Search */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <label
            htmlFor="employer-job-search"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Search jobs
          </label>

          <input
            id="employer-job-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your jobs by title, skill, or description..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </section>

        {/* No jobs */}
        {jobs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No jobs posted yet
            </h2>

            <p className="mt-3 text-slate-500">
              Create your first job opportunity to start receiving applications.
            </p>

            <Link
              to="/employer/post-job"
              className="mt-6 inline-flex rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white"
            >
              Post a Job
            </Link>
          </section>
        ) : filteredJobs.length === 0 ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              No matching jobs found
            </h2>

            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="mt-6 rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white"
            >
              Clear Search
            </button>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-2">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                {editingJobId === job.id ? (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Edit Job
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-slate-900">
                        Update this posting
                      </h2>
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Job Title
                      </label>

                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Description
                      </label>

                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows="5"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Required Skills
                      </label>

                      <textarea
                        value={editRequiredSkill}
                        onChange={(e) => setEditRequiredSkill(e.target.value)}
                        rows="3"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block font-semibold text-slate-800">
                        Application Deadline
                      </label>

                      <input
                        type="date"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleUpdateJob(job.id)}
                        className="rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white"
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingJobId(null)}
                        className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                      Open Role
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {job.title}
                    </h2>

                    <p className="mt-3 leading-7 text-slate-600">
                      {job.description}
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-500">
                          Required Skills
                        </p>

                        <p className="mt-2 leading-7 text-slate-800">
                          {job.requiredskill}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-5">
                        <p className="text-sm font-semibold text-slate-500">
                          Application Deadline
                        </p>

                        <p className="mt-2 font-medium text-slate-800">
                          {formatDeadline(job.deadline)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => handleEditClick(job)}
                        className="rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white"
                      >
                        Edit Job
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600"
                      >
                        Delete Job
                      </button>
                    </div>

                    <Link
                      to={`/employer/applications/job/${job.id}`}
                      className="mt-4 flex w-full items-center justify-center rounded-lg bg-brand-navy hover:bg-slate-800 px-6 py-3 text-sm font-semibold !text-white shadow-sm transition-colors duration-200"
                    >
                      View Applicants
                    </Link>
                  </>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default EmployerJobs;
