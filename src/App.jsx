import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import JobSeeker from "./pages/JobSeeker";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Employer from "./pages/Employer";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import JobDetails from "./pages/JobDetails";
import EmployerApplications from "./pages/EmployerApplications";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer.jsx";
import JobSeekerLayout from "./layouts/JobSeekerLayout";
import EmployerLayout from "./layouts/EmployerLayout";
import ForYou from "./pages/ForYou";
import Profile from "./pages/Profile";
import EmployerJobs from "./pages/EmployerJobs";
import EmployerPostJob from "./pages/EmployerPostJob";
import EmployerApplicationsHub from "./pages/EmployerApplicationsHub";
import EmployerProfile from "./pages/EmployerProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/employer"
          element={
            <ProtectedRoute>
              <EmployerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Employer />} />

          <Route path="jobs" element={<EmployerJobs />} />

          <Route path="post-job" element={<EmployerPostJob />} />

          <Route path="applications" element={<EmployerApplicationsHub />} />

          <Route
            path="applications/job/:jobId"
            element={<EmployerApplications />}
          />

          <Route path="profile" element={<EmployerProfile />} />
        </Route>
        <Route
          path="/jobs"
          element={
            <>
              <Navbar />
              <Jobs />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<Auth />} />

        <Route path="/register" element={<Auth />} />
        <Route
          path="/job-seeker"
          element={
            <ProtectedRoute>
              <JobSeekerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<JobSeeker />} />

          <Route path="jobs" element={<Jobs />} />

          <Route path="jobs/:jobId" element={<JobDetails />} />

          <Route path="applications" element={<MyApplications />} />

          <Route path="for-you" element={<ForYou />} />

          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/jobs/:jobId"
          element={
            <>
              <Navbar />
              <JobDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/applications/job/:jobId"
          element={
            <ProtectedRoute>
              <EmployerApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
