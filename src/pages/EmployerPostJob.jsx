import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/jobService";

function EmployerPostJob() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requiredskill, setRequiredSkill] = useState("");
  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await createJob(title, description, requiredskill, deadline);

      navigate("/employer/jobs", {
        state: {
          success: "Job posted successfully.",
        },
      });
    } catch (error) {
      console.error("Create job error:", error);
      setError(error.message || "Failed to publish job.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Hiring
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Post a Job
          </h1>

          <p className="mt-3 text-slate-600">
            Create a new opportunity for job seekers.
          </p>
        </section>

        {/* Error */}
        {error && (
          <p className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">
            {error}
          </p>
        )}

        {/* Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Role Details
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Job Information
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="job-title"
                className="mb-2 block font-semibold text-slate-800"
              >
                Job Title
              </label>

              <input
                id="job-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="job-description"
                className="mb-2 block font-semibold text-slate-800"
              >
                Description
              </label>

              <textarea
                id="job-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the job responsibilities and opportunity..."
                rows="6"
                required
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="required-skills"
                className="mb-2 block font-semibold text-slate-800"
              >
                Required Skills
              </label>

              <textarea
                id="required-skills"
                value={requiredskill}
                onChange={(e) => setRequiredSkill(e.target.value)}
                placeholder="e.g. React, TypeScript, PostgreSQL"
                rows="3"
                required
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-sm text-slate-500">
                Separate multiple skills with commas.
              </p>
            </div>

            <div>
              <label
                htmlFor="job-deadline"
                className="mb-2 block font-semibold text-slate-800"
              >
                Application Deadline
              </label>

              <input
                id="job-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-navy px-7 py-3.5 font-semibold !text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Publishing..." : "Publish Job"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/employer/jobs")}
                className="rounded-lg border border-slate-300 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EmployerPostJob;
