import { useState, useEffect } from "react";
import { Users, Bell, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const empty = { name: "", relation: "", phone: "", email: "", notifyOnMissedDose: true };

export default function Caretaker() {
  const [caretakers, setCaretakers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);

  const fetchCaretakers = () => {
    api.get("/patient/caretakers")
      .then(r => setCaretakers(r.data.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchCaretakers(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    try {
      await api.post("/patient/caretakers", form);
      toast.success("Caretaker added!");
      setForm(empty);
      setShowForm(false);
      fetchCaretakers();
    } catch {
      toast.error("Failed to add caretaker");
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/patient/caretakers/${id}`);
      toast.success("Caretaker removed");
      fetchCaretakers();
    } catch {
      toast.error("Failed to remove caretaker");
    }
  };

  const toggleNotify = async (id) => {
    try {
      await api.patch(`/patient/caretakers/${id}/toggle-notify`);
      fetchCaretakers();
    } catch {
      toast.error("Failed to update notification");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Caretaker Monitoring</h1>
          <p className="text-gray-500 text-sm">Manage who gets notified about your health</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Caretaker
        </button>
      </div>

      {showForm && (
        <div className="card border-primary border">
          <h2 className="font-semibold mb-4">Add Caretaker</h2>
          <form onSubmit={add} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
              <input className="input" placeholder="Jane Doe" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Relation</label>
              <input className="input" placeholder="e.g. Daughter, Son, Spouse" value={form.relation} onChange={set("relation")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
              <input className="input" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={set("phone")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input className="input" type="email" placeholder="caretaker@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">Add Caretaker</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {caretakers.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No caretakers added yet.</div>
      ) : (
        <div className="grid gap-4">
          {caretakers.map((c) => (
            <div key={c.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Users size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.relation} · {c.phone}</p>
                  <p className="text-xs text-gray-400">{c.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggleNotify(c.id)} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${c.notifyOnMissedDose ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                  <Bell size={13} /> {c.notifyOnMissedDose ? "Notifications ON" : "Notifications OFF"}
                </button>
                <button onClick={() => remove(c.id)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg">
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
