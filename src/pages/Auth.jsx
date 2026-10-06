import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
login,
register,
googleLogin,
} from "../services/authService";



function Auth() {
const location = useLocation();
const navigate = useNavigate();

const isRegister = location.pathname === "/register";

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const [role, setRole] = useState("job_seeker");
const [fullname, setFullname] = useState("");
const [success, setSuccess] = useState("");
const [showPasswordRequirements, setShowPasswordRequirements] =
useState(false);

// One shared Google button container
const googleButtonRef = useRef(null);
const googleModeRef = useRef(isRegister);
const googleRoleRef = useRef(role);
const googleCallbackRef = useRef(null);

googleModeRef.current = isRegister;
googleRoleRef.current = role;

function handleGoogleCredential(response) {
  if (!response?.credential) {
    setError("Google authentication failed.");
    return;
  }

  handleGoogleLogin(response.credential);
}

async function handleGoogleLogin(idToken) {
  const mode = googleModeRef.current ? "register" : "login";
  const selectedRole = googleRoleRef.current;

  try {
    setError("");
    setSuccess("");
    setLoading(true);

    const data = await googleLogin(idToken, mode, selectedRole);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "job_seeker") {
      navigate("/job-seeker");
    } else if (data.user.role === "employer") {
      navigate("/employer");
    } else if (data.user.role === "admin") {
      navigate("/admin");
    }
  } catch (error) {
    console.error("Google authentication error:", error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

googleCallbackRef.current = handleGoogleCredential;

async function handleGoogleLogin(idToken) {
const mode = googleModeRef.current ? "register" : "login";
const selectedRole = googleRoleRef.current;


try {
  setError("");
  setSuccess("");
  setLoading(true);

  const data = await googleLogin(
    idToken,
    mode,
    selectedRole,
  );

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (data.user.role === "job_seeker") {
    navigate("/job-seeker");
  } else if (data.user.role === "employer") {
    navigate("/employer");
  } else if (data.user.role === "admin") {
    navigate("/admin");
  }
} catch (error) {
  console.error("Google authentication error:", error);
  setError(error.message);
} finally {
  setLoading(false);
}


}

useEffect(() => {
  function initializeGoogle() {
    if (!window.google || !googleButtonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response) => {
        googleCallbackRef.current?.(response);
      },
    });

    googleButtonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      width: 360,
    });
  }

  if (window.google) {
    initializeGoogle();
    return;
  }

  const interval = setInterval(() => {
    if (window.google) {
      clearInterval(interval);
      initializeGoogle();
    }
  }, 100);

  return () => clearInterval(interval);
}, []);

const passwordChecks = {
minLength: password.length >= 8,
uppercase: /[A-Z]/.test(password),
lowercase: /[a-z]/.test(password),
number: /[0-9]/.test(password),
special: /[^A-Za-z0-9\s]/.test(password),
};

const isStrongPassword =
passwordChecks.minLength &&
passwordChecks.uppercase &&
passwordChecks.lowercase &&
passwordChecks.number &&
passwordChecks.special;

async function handleLogin(e) {
e.preventDefault();


setError("");
setLoading(true);

try {
  const data = await login(email, password);

  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.user));

  if (data.user.role === "job_seeker") {
    navigate("/job-seeker");
  } else if (data.user.role === "employer") {
    navigate("/employer");
  } else if (data.user.role === "admin") {
    navigate("/admin");
  }
} catch (error) {
  console.error("Login error:", error);
  setError(error.message);
} finally {
  setLoading(false);
}


}

async function handleRegister(e) {
e.preventDefault();


setError("");
setSuccess("");

if (!isStrongPassword) {
  setError(
    "Please choose a stronger password that meets all requirements.",
  );
  return;
}

setLoading(true);

try {
  await register(fullname, email, password, role);

  setSuccess(
    "Account created successfully! Redirecting to sign in...",
  );

  setTimeout(() => {
    navigate("/login");
  }, 1000);
} catch (error) {
  console.error("Register error:", error);
  setError(error.message);
} finally {
  setLoading(false);
}


}

return (
  <main className="min-h-screen bg-slate-50 px-5 py-10">
    <div className="mx-auto flex w-full max-w-md flex-col items-center">
      {/* JobMatch */}
      <Link
        to="/"
        className="mb-8 text-3xl font-bold tracking-tight text-brand-navy"
      >
        JobMatch
      </Link>

      {/* Auth card */}
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
        {/* Tabs */}
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <Link
            to="/login"
            className={`rounded-lg px-4 py-3 text-center font-semibold transition ${
              !isRegister
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Sign In
          </Link>

          <Link
            to="/register"
            className={`rounded-lg px-4 py-3 text-center font-semibold transition ${
              isRegister
                ? "bg-white text-brand-navy shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Create Account
          </Link>
        </div>

        {/* Shared authentication content */}
        <div className="p-8">
          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
              {isRegister ? "Create your account" : "Welcome back"}
            </h1>

            <p className="mt-3 text-slate-500">
              {isRegister
                ? "Join JobMatch and get started today."
                : "Sign in to continue to your JobMatch account."}
            </p>
          </div>

          {/* ONE Google button */}
          <div className="flex justify-center">
            <div ref={googleButtonRef} />
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* CREATE ACCOUNT */}
          {isRegister ? (
            <>
              {/* I want to */}
              <div className="mb-5">
                <p className="mb-2 text-sm font-bold text-slate-900">
                  I want to
                </p>

                <div className="grid w-full grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("job_seeker")}
                    aria-pressed={role === "job_seeker"}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition ${
                      role === "job_seeker"
                        ? "border-sky-500 bg-sky-50/50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        Find a job
                      </span>

                      <span className="text-xs text-slate-500">Job seeker</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("employer")}
                    aria-pressed={role === "employer"}
                    className={`w-full rounded-xl border px-4 py-2.5 text-left transition ${
                      role === "employer"
                        ? "border-sky-500 bg-sky-50/50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">
                        Hire talent
                      </span>

                      <span className="text-xs text-slate-500">Employer</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Registration form */}
              <form onSubmit={handleRegister} className="space-y-5">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-2 block font-semibold text-slate-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="fullname"
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="register-email"
                    className="mb-2 block font-semibold text-slate-800"
                  >
                    Email
                  </label>

                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="register-password"
                    className="mb-2 block font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => setShowPasswordRequirements(false)}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                  />

                  {showPasswordRequirements && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-4 text-sm">
                      <p className="mb-2 font-semibold text-slate-700">
                        Use a strong password:
                      </p>

                      <p
                        className={
                          passwordChecks.minLength
                            ? "text-green-600"
                            : "text-slate-500"
                        }
                      >
                        {passwordChecks.minLength ? "✓" : "○"} 8 or more
                        characters
                      </p>

                      <p
                        className={
                          passwordChecks.uppercase
                            ? "text-green-600"
                            : "text-slate-500"
                        }
                      >
                        {passwordChecks.uppercase ? "✓" : "○"} At least one
                        uppercase letter
                      </p>

                      <p
                        className={
                          passwordChecks.lowercase
                            ? "text-green-600"
                            : "text-slate-500"
                        }
                      >
                        {passwordChecks.lowercase ? "✓" : "○"} At least one
                        lowercase letter
                      </p>

                      <p
                        className={
                          passwordChecks.number
                            ? "text-green-600"
                            : "text-slate-500"
                        }
                      >
                        {passwordChecks.number ? "✓" : "○"} At least one number
                      </p>

                      <p
                        className={
                          passwordChecks.special
                            ? "text-green-600"
                            : "text-slate-500"
                        }
                      >
                        {passwordChecks.special ? "✓" : "○"} At least one
                        special character
                      </p>

                      <p className="mt-3 text-xs text-slate-500">
                        You can also use a strong password suggested by your
                        browser or password manager.
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                {success && (
                  <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-brand-navy px-4 py-3 font-semibold !text-white shadow-sm transition hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </>
          ) : (
            /* SIGN IN */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block font-semibold text-slate-800"
                >
                  Password
                </label>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-brand-navy px-4 py-3 font-semibold !text-white shadow-sm transition hover:bg-brand-navy-light disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  </main>
);
}

export default Auth;
