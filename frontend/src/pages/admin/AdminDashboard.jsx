import { useState, useEffect } from "react";
import { Users, Stethoscope, Calendar, Activity } from "lucide-react";
import StatCard from "../../components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/admin/dashboard").then(r => setStats(r.data.data || {})).catch(() => {});
  }, []);

  const chartData = [
    { label: "Patients", value: stats.totalPatients || 0 },
    { label: "Doctors", value: stats.totalDoctors || 0 },
    { label: "Appointments", value: stats.totalAppointments || 0 },
    { label: "Medicines", value: stats.totalMedicines || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={stats.totalPatients || 0} color="blue" />
        <StatCard icon={Stethoscope} label="Total Doctors" value={stats.totalDoctors || 0} color="green" />
        <StatCard icon={Calendar} label="Total Appointments" value={stats.totalAppointments || 0} color="yellow" />
        <StatCard icon={Activity} label="Pending Appointments" value={stats.pendingAppointments || 0} color="red" />
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">System Overview</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
