import { useState, useEffect } from "react";
import { Pill, Calendar, CheckCircle, XCircle } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [adherence, setAdherence] = useState({ taken: 0, missed: 0 });

  useEffect(() => {
    api.get("/patient/medicines").then(r => setMedicines(r.data.data || [])).catch(() => {});
    api.get("/patient/appointments").then(r => setAppointments(r.data.data || [])).catch(() => {});
    api.get("/patient/medicines/adherence").then(r => setAdherence(r.data.data || {})).catch(() => {});
  }, []);

  const todayMeds = medicines.slice(0, 3);
  const upcomingAppts = appointments.filter(a => a.status !== "CANCELLED").slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Good morning, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's your health summary for today</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Pill} label="Total Medicines" value={medicines.length} color="blue" />
        <StatCard icon={CheckCircle} label="Doses Taken" value={adherence.taken || 0} color="green" />
        <StatCard icon={XCircle} label="Doses Missed" value={adherence.missed || 0} color="red" />
        <StatCard icon={Calendar} label="Appointments" value={appointments.length} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Pill size={18} className="text-primary" /> My Medicines
          </h2>
          {todayMeds.length === 0 ? (
            <p className="text-gray-400 text-sm">No medicines added yet.</p>
          ) : (
            <div className="space-y-3">
              {todayMeds.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.dosage} · {m.time}</p>
                  </div>
                  <span className="badge-blue">{m.frequency}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-primary" /> Upcoming Appointments
          </h2>
          {upcomingAppts.length === 0 ? (
            <p className="text-gray-400 text-sm">No appointments booked yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppts.map((a, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm">{a.doctorName}</p>
                  <p className="text-xs text-gray-500">{a.type}</p>
                  <p className="text-xs text-primary mt-1">{new Date(a.appointmentTime).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
