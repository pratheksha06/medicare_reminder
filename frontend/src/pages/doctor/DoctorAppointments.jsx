import { useState, useEffect } from "react";
import { Calendar, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function DoctorAppointments() {
  const [appts, setAppts] = useState([]);

  const fetchAppts = () => {
    api.get("/doctor/appointments").then(r => setAppts(r.data.data || [])).catch(() => {});
  };

  useEffect(() => { fetchAppts(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/doctor/appointments/${id}/status?status=${status}`);
      toast.success(`Appointment ${status.toLowerCase()}`);
      fetchAppts();
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <p className="text-gray-500 text-sm">Manage patient appointment requests</p>
      </div>

      {appts.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No appointments yet.</div>
      ) : (
        <div className="grid gap-4">
          {appts.map((a) => (
            <div key={a.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{a.patientName}</p>
                  <p className="text-sm text-gray-500">{a.type}</p>
                  <p className="text-xs text-primary mt-0.5">{new Date(a.appointmentTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={a.status === "CONFIRMED" ? "badge-green" : a.status === "REJECTED" ? "badge-red" : "badge-yellow"}>{a.status}</span>
                {a.status === "PENDING" && (
                  <>
                    <button onClick={() => updateStatus(a.id, "CONFIRMED")} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="Approve">
                      <Check size={18} />
                    </button>
                    <button onClick={() => updateStatus(a.id, "REJECTED")} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg" title="Reject">
                      <X size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
