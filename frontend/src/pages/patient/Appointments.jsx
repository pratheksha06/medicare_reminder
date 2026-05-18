import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function Appointments() {
  const [appts, setAppts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ doctorId: "", appointmentTime: "", type: "Consultation", notes: "" });
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    api.get("/patient/appointments")
      .then(r => setAppts(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    // Fetch registered doctors for appointment dropdown
    api.get("/patient/doctors")
      .then(r => setDoctors(r.data.data || []))
      .catch(() => {
        api.get("/auth/doctors")
          .then(r => setDoctors(r.data.data || []))
          .catch(() => {
            toast.error("Unable to load doctors list");
          });
      });
  }, []);

  const book = async (e) => {
    e.preventDefault();
    try {
      await api.post("/patient/appointments", form);
      toast.success("Appointment booked successfully!");
      setForm({ doctorId: "", appointmentTime: "", type: "Consultation", notes: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    }
  };

  const cancel = async (id) => {
    try {
      await api.patch(`/patient/appointments/${id}/cancel`);
      toast.success("Appointment cancelled");
      fetchData();
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const statusColor = { PENDING: "badge-yellow", CONFIRMED: "badge-green", CANCELLED: "badge-red", COMPLETED: "badge-blue" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-500 text-sm">Book and manage your doctor appointments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {showForm && (
        <div className="card border-primary border">
          <h2 className="font-semibold mb-4">Book New Appointment</h2>
          <form onSubmit={book} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Select Doctor</label>
              <select className="input" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required>
                <option value="">-- Choose a doctor --</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Date & Time</label>
              <input className="input" type="datetime-local" value={form.appointmentTime}
                onChange={(e) => setForm({ ...form, appointmentTime: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Check-up">Check-up</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
              <input className="input" placeholder="Any notes for the doctor..." value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">Confirm Booking</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading appointments...</p>
      ) : appts.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No appointments yet. Book your first appointment!</div>
      ) : (
        <div className="grid gap-4">
          {appts.map((a) => (
            <div key={a.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{a.doctorName}</p>
                  <p className="text-sm text-gray-500">{a.type}</p>
                  <p className="text-xs text-primary mt-0.5">{new Date(a.appointmentTime).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={statusColor[a.status] || "badge-yellow"}>{a.status}</span>
                {a.status === "PENDING" && (
                  <button onClick={() => cancel(a.id)} className="btn-danger text-xs py-1 px-3">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
