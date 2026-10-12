import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/Scrolltotop";
import Home from "./pages/Home";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectsPage from "./pages/ProjectsPage";
import AdminProjectForm from "./pages/admin/AdminProjectForm";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProjects from "./pages/admin/AdminProjects";
import FloatingCallButton from "./components/FloatingCallButton";
import AdminServices from "./pages/admin/AdminServices";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <FloatingCallButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects" element={<ProjectsPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/projects" element={
          <ProtectedRoute><AdminProjects /></ProtectedRoute>
        } />
        <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
        <Route path="/admin/projects/new" element={
  <ProtectedRoute><AdminProjectForm /></ProtectedRoute>
} />
<Route path="/admin/projects/edit/:id" element={
  <ProtectedRoute><AdminProjectForm /></ProtectedRoute>
} />
      </Routes>
    </>
  );
}
