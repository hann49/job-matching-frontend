import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getApplicationsForJob,
  updateApplicationStatus,
} from "../services/applicationService";
import { getCandidatesForJob } from "../services/matchingService";

function getStatusClasses(status) {
  if (status === "accepted") {
    return "bg-green-100 text-green-700";
  }

  if (status === "rejected") {
    return "bg-red-100 text-red-700";
  }

  return "bg-amber-100 text-amber-700";
}

function EmployerApplications() {
  const { jobId } = useParams();

  const [applications, setApplications] = useState([]);
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [candidatesLoading, setCandidatesLoading] = useState(true);

  const [error, setError] = useState("");
  const [updatingApplicationId, setUpdatingApplicationId] = useState(null);

  useEffect(() => {
    async function loadApplications() {
      try {
        setLoading(true);

        const data = await getApplicationsForJob(jobId);

        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Applications error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadApplications();
  }, [jobId]);

  useEffect(() => {
    async function loadRecommendedCandidates() {
      try {
        setCandidatesLoading(true);

        const data = await getCandidatesForJob(jobId);

        if (Array.isArray(data.candidates)) {
          setRecommendedCandidates(data.candidates);
        } else {
          setRecommendedCandidates([]);
        }
      } catch (error) {
        console.error("Recommended candidates error:", error);
        setError(error.message);
      } finally {
        setCandidatesLoading(false);
      }
    }

    loadRecommendedCandidates();
  }, [jobId]);

  async function handleStatusUpdate(applicationId, newStatus) {
    try {
      setUpdatingApplicationId(applicationId);
      setError("");

      await updateApplicationStatus(applicationId, newStatus);

      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application,
        ),
      );
    } catch (error) {
      console.error("Status update error:", error);
      setError(error.message);
    } finally {
      setUpdatingApplicationId(null);
    }
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-10 rounded-3xl bg-gradient-to-br from-[#EBF3FC] to-[#F3F8FE] px-10 py-12 border border-[#DFECFA]/60 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Hiring Management
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Candidates & Applications
          </h1>

          <p className="mt-3 text-base font-normal text-slate-600">
            Review recommended candidates and manage applications for this job.
          </p>
        </section>

        {/* Error */}
        {error && (
          <p className="mb-8 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">
            {error}
          </p>
        )}

        {/* Recommended Candidates */}
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Matching
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Recommended Candidates
            </h2>

            <p className="mt-2 text-slate-500">
              Candidates whose skills match the requirements of this job.
            </p>
          </div>

          {candidatesLoading ? (
            <div className="rounded-2xl bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg text-slate-500">
                Loading recommended candidates...
              </p>
            </div>
          ) : recommendedCandidates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No recommended candidates found
              </h3>

              <p className="mt-2 text-slate-500">
                No candidates currently have matching skills for this job.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {recommendedCandidates.map((candidate) => (
                <article
                  key={candidate.jobSeeker.id}
                  className="rounded-2xl border border-slate-200 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Candidate
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {candidate.jobSeeker.fullname}
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                      {candidate.matchScore}%
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Email
                      </p>

                      <p className="mt-1 text-slate-800">
                        {candidate.jobSeeker.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Skills
                      </p>

                      <p className="mt-1 leading-7 text-slate-800">
                        {candidate.jobSeeker.profile.skill}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Applicants */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Applications
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Applicants
            </h2>

            <p className="mt-2 text-slate-500">
              Review applicants and update their application status.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg text-slate-500">Loading applicants...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No applicants yet
              </h3>

              <p className="mt-2 text-slate-500">
                No job seekers have applied to this position.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="rounded-2xl border border-slate-200 p-6"
                >
                  {/* Applicant header */}
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {application.applicant.fullname}
                      </h3>

                      <p className="mt-1 text-slate-500">
                        {application.applicant.email}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-bold capitalize ${getStatusClasses(
                        application.status,
                      )}`}
                    >
                      {application.status}
                    </span>
                  </div>

                  {/* Applicant information */}
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Skills
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {application.applicant.profile?.skill}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Education
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {application.applicant.profile?.education}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Experience
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {application.applicant.profile?.experience}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Phone
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {application.applicant.profile?.phone}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-5 md:col-span-2">
                      <p className="text-sm font-semibold text-slate-500">
                        Bio
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {application.applicant.profile?.bio}
                      </p>
                    </div>
                  </div>

                  {/* Applied date */}
                  <div className="mt-5">
                    <p className="text-sm font-semibold text-slate-500">
                      Applied
                    </p>

                    <p className="mt-1 text-slate-800">
                      {new Date(application.appliedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  {application.status === "pending" && (
                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                      {updatingApplicationId === application.id ? (
                        <p className="font-medium text-slate-500">
                          Updating application...
                        </p>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(application.id, "accepted")
                            }
                            className="rounded-lg bg-[#DCFCE7] px-6 py-3 font-semibold text-green-800 transition hover:bg-[#BBF7D0]"
                          >
                            Accept Application
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(application.id, "rejected")
                            }
                            className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Reject Application
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default EmployerApplications;
