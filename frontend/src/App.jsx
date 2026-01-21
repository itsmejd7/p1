
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Home } from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ProjectsList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import Unauthorized from "./pages/Unauthorized";
import { ProtectedRoute, AdminRoute, UserRoute } from "./auth/ProtectedRoute";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<Navigate to="/login" />} />

        
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/user"
          element={
            <UserRoute>
              <UserPage />
            </UserRoute>
          }
        />

        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsList />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/project/:slug"
          element={
            <ProtectedRoute>
              <ProjectDetail />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />   
            </AdminRoute>
          }
        />

       
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}