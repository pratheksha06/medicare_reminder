import { useState, useEffect } from "react";
import { Users, Calendar, ClipboardList, CheckCircle } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    api.get("/doctor/appointments").then(r => setAppointments(r.data.data || [])).catch(() => {});
    api.get("/doctor/patients").then(r => setPatients(r.data.data || [])).catch(() => {});
  }, []);

  const todayAppts = appointments.filter(a => {
    const d = new Date(a.appointmentTime);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const confirmed = appointments.filter(a => a.status === "CONFIRMED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name} 👨‍⚕️</h1>
        <p className="text-gray-500 text-sm">Here's your schedule overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Total Appointments" value={appointments.length} color="blue" />
        <StatCard icon={Users} label="My Patients" value={patients.length} color="green" />
        <StatCard icon={CheckCircle} label="Confirmed" value={confirmed} color="green" />
        <StatCard icon={ClipboardList} label="Today's Appointments" value={todayAppts.length} color="yellow" />
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-4">Recent Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-400 text-sm">No appointments yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{a.patientName}</p>
                  <p className="text-xs text-gray-500">{a.type} · {new Date(a.appointmentTime).toLocaleString()}</p>
                </div>
                <span className={a.status === "CONFIRMED" ? "badge-green" : a.status === "PENDING" ? "badge-yellow" : "badge-red"}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
