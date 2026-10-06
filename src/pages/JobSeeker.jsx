import { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import { getMyApplications } from "../services/applicationService";
import { Link } from "react-router-dom";

function JobSeeker() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profileData = await getProfile();

        if (profileData.message === "Profile not found") {
          setShowCreateProfile(true);
          return;
        }

        setProfile(profileData);

        const applicationData = await getMyApplications();

        if (Array.isArray(applicationData)) {
          setApplications(applicationData);
        } else {
          setApplications([]);
        }
      } catch (error) {
        console.error("Job seeker dashboard error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-red-600">Failed to load your dashboard.</p>
        </div>
      </main>
    );
  }

  const profileFields = [
    profile?.skill,
    profile?.education,
    profile?.experience,
    profile?.bio,
    profile?.phone,
  ];

  const completedProfileFields = profileFields.filter(
    (field) => field && field.toString().trim() !== "",
  ).length;

  const totalProfileFields = profileFields.length;

  const skills = profile?.skill
    ? profile.skill
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean)
    : [];

  if (showCreateProfile) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Job Seeker
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Complete Your Profile
            </h1>

            <p className="mt-3 text-slate-600">
              Complete your profile before exploring personalized job
              recommendations.
            </p>

            <Link
              to="/job-seeker/profile"
              className="mt-6 inline-flex rounded-lg bg-brand-navy px-6 py-3 font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              Create Profile
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <section className="mb-8 rounded-3xl border border-[#DFECFA] bg-gradient-to-br from-[#EBF3FC] to-[#F3F8FE] px-8 py-10 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Job Seeker Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Welcome back, {profile.user.fullname}.
              </h1>

              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Keep your profile complete and discover opportunities that match
                your skills.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/job-seeker/profile"
                className="rounded-lg bg-brand-navy px-6 py-3 text-center font-semibold !text-white transition hover:bg-brand-navy-light"
              >
                Edit Profile
              </Link>

              <Link
                to="/job-seeker/jobs"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Profile Complete
            </p>

            <p className="mt-3 text-4xl font-bold text-brand-navy">
              {completedProfileFields}/{totalProfileFields}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Profile sections completed
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Skills Listed
            </p>

            <p className="mt-3 text-4xl font-bold text-brand-navy">
              {skills.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Skills in your profile
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Applications Sent
            </p>

            <p className="mt-3 text-4xl font-bold text-brand-navy">
              {applications.length}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Total applications submitted
            </p>
          </article>
        </section>

        {/* Checklist + Skills */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Profile Checklist */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Profile Checklist
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Complete your profile
              </h2>
            </div>

            <div className="space-y-3">
              {[
                ["Skills", profile?.skill],
                ["Education", profile?.education],
                ["Experience", profile?.experience],
                ["About", profile?.bio],
                ["Phone", profile?.phone],
              ].map(([label, value]) => {
                const complete = value && value.toString().trim() !== "";

                return (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                  >
                    <span className="font-medium text-slate-700">{label}</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        complete
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {complete ? "Complete" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          </article>

          {/* Job Seeker Skills */}
          <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Job Seeker Skills
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-900">
                Your Skills
              </h2>

              <p className="mt-2 text-slate-500">
                Skills currently used by the matching system.
              </p>
            </div>

            {skills.length === 0 ? (
              <p className="text-slate-500">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-brand-soft-blue px-4 py-2 text-sm font-semibold text-brand-navy"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}

export default JobSeeker;
