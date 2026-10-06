import { useEffect, useState } from "react";
import {
  getProfile,
  createProfile,
  updateProfile,
} from "../services/profileService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [skill, setSkill] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();

        if (data.message === "Profile not found") {
          setShowCreateProfile(true);
        } else {
          setProfile(data);

          setSkill(data.skill || "");
          setEducation(data.education || "");
          setExperience(data.experience || "");
          setBio(data.bio || "");
          setPhone(data.phone || "");
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        setError("Failed to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function handleEdit() {
    setSuccess("");
    setError("");
    setIsEditing(true);
  }

  async function handleSaveProfile(e) {
    e.preventDefault();

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      if (showCreateProfile) {
        await createProfile(skill, education, experience, bio, phone);
      } else {
        await updateProfile(skill, education, experience, bio, phone);
      }

      const updatedProfile = await getProfile();

      setProfile(updatedProfile);
      setShowCreateProfile(false);
      setIsEditing(false);

      setSuccess("Profile saved successfully.");
    } catch (error) {
      console.error("Profile save error:", error);
      setError(error.message || "Failed to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </main>
    );
  }

  const fullName =
    profile?.user?.fullname ||
    JSON.parse(localStorage.getItem("user") || "null")?.fullname ||
    "Job Seeker";

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <section className="mb-8 rounded-3xl border border-slate-200 bg-white px-8 py-9 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Your Profile
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Basics
          </h1>

          <p className="mt-3 text-slate-600">
            Keep your profile information up to date so JobMatch can match you
            with relevant opportunities.
          </p>
        </section>

        {/* Messages */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Profile */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Full Name
              </label>

              <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-slate-900">
                {fullName}
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-600">
                Headline
              </label>

              <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-slate-700">
                Job Seeker
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Headline is currently displayed as your account role.
              </p>
            </div>

            {/* About */}
            <div>
              <label
                htmlFor="bio"
                className="mb-2 block text-sm font-semibold text-slate-600"
              >
                About
              </label>

              {isEditing || showCreateProfile ? (
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows="4"
                  placeholder="Tell employers a little about yourself..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-slate-800">
                  {bio || "No information added yet."}
                </div>
              )}
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skill"
                className="mb-2 block text-sm font-semibold text-slate-600"
              >
                Skills
              </label>

              {isEditing || showCreateProfile ? (
                <input
                  id="skill"
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g. React, JavaScript, PostgreSQL"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <div className="flex flex-wrap gap-3 rounded-xl bg-slate-50 p-4">
                  {skill ? (
                    skill
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-brand-soft-blue px-4 py-2 text-sm font-semibold text-brand-navy"
                        >
                          {item}
                        </span>
                      ))
                  ) : (
                    <span className="text-slate-500">No skills added yet.</span>
                  )}
                </div>
              )}
            </div>

            {/* Education & Experience */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="education"
                  className="mb-2 block text-sm font-semibold text-slate-600"
                >
                  Education
                </label>

                {isEditing || showCreateProfile ? (
                  <textarea
                    id="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    rows="4"
                    placeholder="e.g. BSc in Software Engineering"
                    required
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-slate-800">
                    {education || "No education added yet."}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="mb-2 block text-sm font-semibold text-slate-600"
                >
                  Experience
                </label>

                {isEditing || showCreateProfile ? (
                  <textarea
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    rows="4"
                    placeholder="Describe your work or project experience..."
                    className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                ) : (
                  <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-slate-800">
                    {experience || "No experience added yet."}
                  </div>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-600"
              >
                Phone
              </label>

              {isEditing || showCreateProfile ? (
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0912345678"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              ) : (
                <div className="rounded-xl bg-slate-50 px-4 py-3.5 text-slate-800">
                  {phone || "No phone number added yet."}
                </div>
              )}
            </div>

            {/* Actions */}
            {!isEditing && !showCreateProfile && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="rounded-lg bg-brand-navy px-7 py-3.5 font-semibold !text-white shadow-md transition hover:bg-brand-navy-light"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {(isEditing || showCreateProfile) && (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-brand-navy px-7 py-3.5 font-semibold !text-white shadow-md transition hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : showCreateProfile
                      ? "Save Profile"
                      : "Save Profile"}
                </button>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;
