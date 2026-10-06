import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getJob } from "../services/jobService";
import { applyToJob } from "../services/applicationService";

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function formatPostedDate(createdAt) {
  if (!createdAt) return "Unknown";

  return new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function JobDetails() {
  const { jobId } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobError, setJobError] = useState("");
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        setJobError("");

        const jobData = await getJob(jobId);

        if (!jobData || jobData.message === "Job not found") {
          setJob(null);
          setJobError("Job not found.");
          return;
        }

        setJob(jobData);
      } catch (error) {
        console.error("Error fetching job:", error);
        setJobError("Failed to load this job.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  async function handleApply() {
    setApplying(true);
    setMessage("");
    setError("");

    try {
      const response = await applyToJob(jobId);
      setMessage(response.message);
    } catch (error) {
      console.error("Error applying to job:", error);
      setError("Failed to submit application. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg text-slate-500">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (jobError) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{jobError}</h1>

          <p className="mt-3 text-slate-500">
            Please return to the jobs page and try again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <section className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Job Opportunity
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Job Details
          </h1>

          <p className="mt-3 text-lg text-slate-600">
            Learn more about this opportunity and decide whether to apply.
          </p>
        </section>

        {/* Job card */}
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          {/* Card header */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-8 py-8">
            <p className="mb-2 text-sm font-medium text-slate-500">Position</p>

            <h2 className="text-3xl font-bold text-slate-900">{job.title}</h2>
          </div>

          <div className="space-y-8 px-8 py-8">
            {/* Description */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">Description</h3>

              <p className="mt-3 leading-7 text-slate-600">{job.description}</p>
            </section>

            {/* Skills */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Required Skills
              </h3>

              <div className="mt-3 rounded-xl bg-slate-50 p-4">
                <p className="leading-7 text-slate-600">{job.requiredskill}</p>
              </div>
            </section>

            {/* Job information */}
            <section className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Deadline</p>

                <p className="mt-2 font-semibold text-slate-900">
                  {formatDeadline(job.deadline)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-500">Posted</p>

                <p className="mt-2 font-semibold text-slate-900">
                  {formatPostedDate(job.createdAt)}
                </p>
              </div>
            </section>

            {/* Messages */}
            {message && (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {message}
              </p>
            )}

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {/* Apply */}
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              className="rounded-lg bg-brand-navy px-7 py-3.5 font-semibold !text-white shadow-md transition hover:bg-brand-navy/80"
            >
              {applying ? "Applying..." : "Apply Now"}
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}

export default JobDetails;
