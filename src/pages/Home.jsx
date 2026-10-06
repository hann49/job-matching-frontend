import { Link } from "react-router-dom";

const stats = [
  { value: "12k+", label: "active candidates" },
  { value: "180+", label: "companies hiring" },
  { value: "96%", label: "skill match quality" },
  { value: "48h", label: "average response time" },
];

const roles = [
  "Frontend Engineer",
  "Product Designer",
  "Data Analyst",
  "Customer Success",
];

const features = [
  {
    icon: "👥",
    title: "For job seekers",
    text: "Create a profile, highlight your skills, and discover opportunities that fit your experience, location, and goals.",
  },
  {
    icon: "💼",
    title: "For employers",
    text: "Post real jobs, review applicants, and identify candidates with the strongest match for each role.",
  },
  {
    icon: "🎯",
    title: "Smart matching",
    text: "Our job recommendation engine compares candidate strengths with job requirements to surface the best-fit opportunities.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create a profile",
    text: "Share your experience, skills, and preferences to build a useful candidate or hiring profile.",
  },
  {
    number: "02",
    title: "Browse & match",
    text: "Explore curated opportunities or discover candidates whose strengths align with your requirements.",
  },
  {
    number: "03",
    title: "Apply with confidence",
    text: "Move forward faster with clearer matches, relevant roles, and better hiring decisions.",
  },
];

function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(135deg,#eef6ff_0%,#f8fbff_50%,#edfdfd_100%)] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-blue-200 bg-white/90 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                Smart hiring marketplace
              </div>

              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find better jobs.
                <span className="block text-blue-600">Hire better people.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
                JobMatch connects ambitious professionals with companies that need the right talent. Discover clean job matches, skill-based recommendations, and a more practical hiring experience.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="rounded-xl bg-brand-navy px-7 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-blue-900/10 transition hover:-translate-y-0.5 hover:bg-brand-navy/90"
                >
                  Get started
                </Link>
                <Link
                  to="/jobs"
                  className="rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-center text-base font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  Browse jobs
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Trusted by growing teams
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  Real role matching
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                <div className="rounded-[1.5rem] bg-slate-900 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Talent pipeline</p>
                      <h2 className="mt-2 text-3xl font-bold">89%</h2>
                    </div>
                    <div className="rounded-xl bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-300">
                      +24% this month
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>Frontend Engineer</span>
                        <span>92%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                        <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>Product Designer</span>
                        <span>88%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                        <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-violet-400 to-indigo-400" />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                        <span>Data Analyst</span>
                        <span>81%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                        <div className="h-full w-[81%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <div key={role} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Why JobMatch</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Built for modern hiring and job discovery
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">A faster path from search to success</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm">
                <div className="mb-5 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-slate-900 px-8 py-14 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] sm:px-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">Join the platform</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Ready to grow your career or team?</h2>
              <p className="mt-4 text-lg leading-7 text-slate-300">
                Start building a stronger hiring process and discover roles that match your skills, goals, or company needs.
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/register"
                className="rounded-xl bg-white px-7 py-3.5 text-center font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Create account
              </Link>
              <Link
                to="/jobs"
                className="rounded-xl border border-slate-700 bg-slate-800 px-7 py-3.5 text-center font-semibold text-white transition hover:border-slate-600 hover:bg-slate-700"
              >
                Explore jobs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
