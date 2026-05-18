import { useState, useEffect } from "react";
import { Plus, Trash2, Bell, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const empty = { name: "", dosage: "", time: "", frequency: "DAILY", startDate: "", endDate: "" };

export default function MedicineReminders() {
  const [meds, setMeds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);

  const fetchMeds = () => {
    api.get("/patient/medicines")
      .then(r => setMeds(r.data.data || []))
      .catch(() => toast.error("Failed to load medicines"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMeds(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addMed = async (e) => {
    e.preventDefault();
    try {
      await api.post("/patient/medicines", form);
      toast.success("Medicine reminder added!");
      setForm(empty);
      setShowForm(false);
      fetchMeds();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add medicine");
    }
  };

  const markDose = async (id, status) => {
    try {
      await api.patch(`/patient/medicines/${id}/dose?status=${status}`);
      toast.success(status === "TAKEN" ? "Marked as taken ✓" : "Marked as missed");
      fetchMeds();
    } catch {
      toast.error("Failed to update dose");
    }
  };

  const deleteMed = async (id) => {
    try {
      await api.delete(`/patient/medicines/${id}`);
      toast.success("Reminder removed");
      fetchMeds();
    } catch {
      toast.error("Failed to remove medicine");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medicine Reminders</h1>
          <p className="text-gray-500 text-sm">Manage your daily medication schedule</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      {showForm && (
        <div className="card border-primary border">
          <h2 className="font-semibold mb-4">Add New Medicine</h2>
          <form onSubmit={addMed} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Medicine Name</label>
              <input className="input" placeholder="e.g. Paracetamol" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Dosage</label>
              <input className="input" placeholder="e.g. 500mg" value={form.dosage} onChange={set("dosage")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Reminder Time</label>
              <input className="input" type="time" value={form.time} onChange={set("time")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Frequency</label>
              <select className="input" value={form.frequency} onChange={set("frequency")}>
                <option value="DAILY">Daily</option>
                <option value="TWICE_DAILY">Twice Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="AS_NEEDED">As Needed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Start Date</label>
              <input className="input" type="date" value={form.startDate} onChange={set("startDate")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">End Date</label>
              <input className="input" type="date" value={form.endDate} onChange={set("endDate")} required />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">Save Reminder</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm">Loading medicines...</p>
      ) : meds.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No medicines added yet. Click "Add Medicine" to get started.</div>
      ) : (
        <div className="grid gap-4">
          {meds.map((m) => (
            <div key={m.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center">
                  <Bell size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-gray-500">{m.dosage} · {m.time} · {m.frequency}</p>
                  <p className="text-xs text-gray-400">{m.startDate} → {m.endDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => markDose(m.id, "TAKEN")} title="Mark taken" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg">
                  <CheckCircle size={18} />
                </button>
                <button onClick={() => markDose(m.id, "MISSED")} title="Mark missed" className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg">
                  <XCircle size={18} />
                </button>
                <button onClick={() => deleteMed(m.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
