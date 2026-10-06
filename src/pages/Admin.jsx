import React, { useEffect, useState } from "react";
import {
  getAdminStats,
  getAdminUsers,
  blockAdminUser,
  unblockAdminUser,
  deleteAdminUser,
  getAdminJobs,
  deleteAdminJob,
} from "../services/adminService";

function formatDate(date) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDeadline(deadline) {
  if (!deadline) return "No deadline";

  const [year, month, day] = deadline.split("-");

  return `${month}/${day}/${year}`;
}

function getRoleClasses(role) {
  if (role === "admin") {
    return "bg-purple-100 text-purple-700";
  }

  if (role === "employer") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-slate-100 text-slate-700";
}

function Admin() {
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (error) {
        console.error("Admin statistics error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getAdminUsers();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Admin users error:", error);
        setUsersError(error.message);
      } finally {
        setUsersLoading(false);
      }
    }

    loadUsers();
  }, []);

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getAdminJobs();

        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Admin jobs error:", error);
        setJobsError(error.message);
      } finally {
        setJobsLoading(false);
      }
    }

    loadJobs();
  }, []);

  async function handleBlockToggle(userId, isBlocked) {
    try {
      setUsersError("");

      let data;

      if (isBlocked) {
        data = await unblockAdminUser(userId);
      } else {
        data = await blockAdminUser(userId);
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                isBlocked: data.user.isBlocked,
              }
            : user,
        ),
      );

      const updatedStats = await getAdminStats();
      setStats(updatedStats);
    } catch (error) {
      console.error("Block/unblock user error:", error);
      setUsersError(error.message);
    }
  }

  async function handleDeleteUser(userId, fullname) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${fullname}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setUsersError("");

      await deleteAdminUser(userId);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

      const updatedStats = await getAdminStats();
      setStats(updatedStats);
    } catch (error) {
      console.error("Delete user error:", error);
      setUsersError(error.message);
    }
  }

  async function handleDeleteJob(jobId, title) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setJobsError("");

      await deleteAdminJob(jobId);

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));

      const updatedStats = await getAdminStats();
      setStats(updatedStats);
    } catch (error) {
      console.error("Delete job error:", error);
      setJobsError(error.message);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-10 rounded-3xl bg-gradient-to-br from-[#EBF3FC] to-[#F3F8FE] px-10 py-12 border border-[#DFECFA]/60 shadow-sm">
          <div>
            <p lassName="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-base font-normal text-slate-600">
              Welcome, {currentUser?.fullname || "Administrator"}.
            </p>
          </div>
        </section>

        {/* General error */}
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Overview
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">
              Platform Statistics
            </h2>

            <p className="mt-2 text-slate-500">
              Monitor users, jobs, and application activity.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-lg text-slate-500">Loading statistics...</p>
            </div>
          ) : stats ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Total Users
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {stats.totalUsers}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Job Seekers
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {stats.jobSeekers}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Employers
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {stats.employers}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">Admins</p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {stats.admins}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Blocked Users
                </p>
                <p className="mt-2 text-4xl font-bold text-red-600">
                  {stats.blockedUsers}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Total Jobs
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {stats.totalJobs}
                </p>
              </article>

              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2">
                <p className="text-sm font-semibold text-slate-500">
                  Total Applications
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {stats.totalApplications}
                </p>
              </article>
            </div>
          ) : null}
        </section>

        {/* Users */}
        <section className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              User Management
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">Users</h2>

            <p className="mt-2 text-slate-500">
              Manage platform accounts and account status.
            </p>
          </div>

          {usersLoading ? (
            <div className="rounded-2xl bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg text-slate-500">Loading users...</p>
            </div>
          ) : usersError ? (
            <div className="rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">
              {usersError}
            </div>
          ) : users.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No users found
              </h3>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {users.map((user) => (
                <article
                  key={user.id}
                  className="rounded-2xl border border-slate-200 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">
                        {user.fullname}
                      </h3>

                      <p className="mt-1 text-slate-500">{user.email}</p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
                        user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-500">
                        Role
                      </p>

                      <span
                        className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${getRoleClasses(
                          user.role,
                        )}`}
                      >
                        {user.role.replace("_", " ")}
                      </span>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-500">
                        Created
                      </p>

                      <p className="mt-2 text-slate-800">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  {user.id !== currentUser?.id && (
                    <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          handleBlockToggle(user.id, user.isBlocked)
                        }
                        className={`rounded-lg px-5 py-3 font-semibold transition ${
                          user.isBlocked
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {user.isBlocked ? "Unblock User" : "Block User"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.fullname)}
                        className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete User
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Jobs */}
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Job Management
            </p>

            <h2 className="mt-1 text-3xl font-bold text-slate-900">Jobs</h2>

            <p className="mt-2 text-slate-500">
              Review and manage job postings across the platform.
            </p>
          </div>

          {jobsLoading ? (
            <div className="rounded-2xl bg-slate-50 px-6 py-12 text-center">
              <p className="text-lg text-slate-500">Loading jobs...</p>
            </div>
          ) : jobsError ? (
            <div className="rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">
              {jobsError}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <h3 className="text-xl font-bold text-slate-900">
                No jobs found
              </h3>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {jobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-slate-200 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Job Posting
                      </p>

                      <h3 className="mt-1 text-2xl font-bold text-slate-900">
                        {job.title}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-xl bg-slate-50 p-5">
                      <p className="text-sm font-semibold text-slate-500">
                        Employer
                      </p>

                      <p className="mt-2 font-semibold text-slate-900">
                        {job.postedByName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {job.postedByEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Description
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {job.description}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-500">
                        Required Skills
                      </p>

                      <p className="mt-2 leading-7 text-slate-800">
                        {job.requiredskill}
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-500">
                          Deadline
                        </p>

                        <p className="mt-2 font-medium text-slate-800">
                          {formatDeadline(job.deadline)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-500">
                          Created
                        </p>

                        <p className="mt-2 font-medium text-slate-800">
                          {formatDate(job.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    className="rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete Job
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Admin;
