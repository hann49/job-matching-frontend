import { useState } from "react";

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function getProfileKey(userId) {
  return `companyProfile_${userId}`;
}

function loadCompanyProfile(user) {
  if (!user?.id) {
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem(getProfileKey(user.id)) || "null");
  } catch {
    return null;
  }
}

function EmployerProfile() {
  const user = getCurrentUser();
  const savedProfile = loadCompanyProfile(user);

  const [companyName, setCompanyName] = useState(
    savedProfile?.companyName || user?.fullname || "",
  );

  const [website, setWebsite] = useState(savedProfile?.website || "");

  const [headquarters, setHeadquarters] = useState(
    savedProfile?.headquarters || "",
  );

  const [about, setAbout] = useState(savedProfile?.about || "");

  const [success, setSuccess] = useState("");

  function handleSave(e) {
    e.preventDefault();

    if (!user?.id) {
      setSuccess("");
      return;
    }

    const companyProfile = {
      companyName,
      website,
      headquarters,
      about,
    };

    localStorage.setItem(
      getProfileKey(user.id),
      JSON.stringify(companyProfile),
    );

    setSuccess("Company profile saved successfully.");
  }

  return (
    <main className="min-h-[calc(100vh-76px)] bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Company Profile
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Company Profile
          </h1>

          <p className="mt-3 text-slate-600">
            Keep your company information clear and up to date.
          </p>
        </section>

        {/* Success */}
        {success && (
          <p className="mb-6 rounded-xl bg-green-50 px-5 py-4 font-medium text-green-700">
            {success}
          </p>
        )}

        {/* Profile Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Company Name */}
            <div>
              <label
                htmlFor="company-name"
                className="mb-2 block font-semibold text-slate-800"
              >
                Company Name
              </label>

              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Website */}
            <div>
              <label
                htmlFor="website"
                className="mb-2 block font-semibold text-slate-800"
              >
                Website
              </label>

              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Headquarters */}
            <div>
              <label
                htmlFor="headquarters"
                className="mb-2 block font-semibold text-slate-800"
              >
                Headquarters
              </label>

              <input
                id="headquarters"
                type="text"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                placeholder="e.g. Addis Ababa, Ethiopia"
                className="w-full rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* About */}
            <div>
              <label
                htmlFor="about-company"
                className="mb-2 block font-semibold text-slate-800"
              >
                About the Company
              </label>

              <textarea
                id="about-company"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows="6"
                placeholder="Tell job seekers about your company..."
                className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Save */}
            <button
              type="submit"
              className="rounded-lg bg-brand-navy px-7 py-3.5 font-semibold !text-white transition hover:bg-brand-navy-light"
            >
              Save Profile
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default EmployerProfile;
