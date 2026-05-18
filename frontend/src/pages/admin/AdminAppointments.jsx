import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../../api/axios";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/admin/appointments").then(r => setAppointments(r.data.data || [])).catch(() => {});
  }, []);

  const filtered = appointments.filter(a =>
    a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    a.doctorName?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = { CONFIRMED: "badge-green", PENDING: "badge-yellow", CANCELLED: "badge-red", COMPLETED: "badge-blue", REJECTED: "badge-red" };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">All Appointments</h1>
        <p className="text-gray-500 text-sm">Monitor all scheduled appointments</p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Search by patient or doctor..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Patient</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Doctor</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Date & Time</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Type</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-400">No appointments found</td></tr>
            ) : filtered.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-5 py-3 font-medium">{a.patientName}</td>
                <td className="px-5 py-3 text-gray-600">{a.doctorName}</td>
                <td className="px-5 py-3 text-gray-600">{new Date(a.appointmentTime).toLocaleString()}</td>
                <td className="px-5 py-3 text-gray-600">{a.type}</td>
                <td className="px-5 py-3"><span className={statusColor[a.status] || "badge-yellow"}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
