import { Navigate, Route, Routes } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { ReactNode } from 'react';

/* Public Routes */
import Home from "../pages/public/Home";
import Projects from "../pages/public/Projects";
import ProjectsDetail from "../pages/public/ProjectsDetail";
import Blogs from "../pages/public/Blogs";
import BlogDetail from "../pages/public/BlogDetail";
import Contact from "../pages/public/Contact";
import Github from "../pages/public/Github";

/* Admin Routes */
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import ManageProjects from "../pages/admin/ManageProjects";
import ManageBlogs from "../pages/admin/ManageBlogs";
import ManageContact from "../pages/admin/ManageContact";
import AdminLayout from "../components/layout/AdminLayout";

import NotFound from "../pages/NotFound";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">Checking authentication...</p>
                </div>
            </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectsDetail />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/github" element={<Github />} />

            {/* Admin Routes */}
            <Route path="/login" element={<Login />} />
            
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="blogs" element={<ManageBlogs />} />
                <Route path="contact" element={<ManageContact />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;