import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import MedicineReminders from "./pages/patient/MedicineReminders";
import Appointments from "./pages/patient/Appointments";
import Prescriptions from "./pages/patient/Prescriptions";
import HealthRecords from "./pages/patient/HealthRecords";
import Caretaker from "./pages/patient/Caretaker";
import Emergency from "./pages/patient/Emergency";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorPrescriptions from "./pages/doctor/DoctorPrescriptions";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminReports from "./pages/admin/AdminReports";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Patient Routes */}
          <Route path="/patient" element={<ProtectedRoute role="patient" />}>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="reminders" element={<MedicineReminders />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="health-records" element={<HealthRecords />} />
            <Route path="caretaker" element={<Caretaker />} />
            <Route path="emergency" element={<Emergency />} />
          </Route>

          {/* Doctor Routes */}
          <Route path="/doctor" element={<ProtectedRoute role="doctor" />}>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
