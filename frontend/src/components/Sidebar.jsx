import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Pill, Calendar, FileText, Activity,
  AlertCircle, Users, UserCog, LogOut, Stethoscope, ClipboardList,
} from "lucide-react";

const navItems = {
  patient: [
    { to: "/patient/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/patient/reminders", icon: Pill, label: "Medicine Reminders" },
    { to: "/patient/appointments", icon: Calendar, label: "Appointments" },
    { to: "/patient/prescriptions", icon: FileText, label: "Prescriptions" },
    { to: "/patient/health-records", icon: Activity, label: "Health Records" },
    { to: "/patient/caretaker", icon: Users, label: "Caretaker" },
    { to: "/patient/emergency", icon: AlertCircle, label: "Emergency" },
  ],
  doctor: [
    { to: "/doctor/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/doctor/appointments", icon: Calendar, label: "Appointments" },
    { to: "/doctor/patients", icon: Users, label: "My Patients" },
    { to: "/doctor/prescriptions", icon: ClipboardList, label: "Prescriptions" },
  ],
  admin: [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/patients", icon: Users, label: "Patients" },
    { to: "/admin/doctors", icon: Stethoscope, label: "Doctors" },
    { to: "/admin/appointments", icon: Calendar, label: "Appointments" },
    { to: "/admin/reports", icon: Activity, label: "Reports" },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = navItems[user?.role?.toLowerCase()] || [];

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Pill size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-800 text-lg">MediCare</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 capitalize">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                isActive ? "bg-primary-light text-primary font-medium" : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 px-2 py-1 w-full">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}
