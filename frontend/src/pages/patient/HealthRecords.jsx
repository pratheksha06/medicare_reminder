import { useState, useEffect } from "react";
import { Upload, Activity, Droplets, Heart, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function HealthRecords() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("BLOOD_PRESSURE");
  const [form, setForm] = useState({ type: "BLOOD_PRESSURE", title: "", systolic: "", diastolic: "", sugarLevel: "", heartRate: "", notes: "" });

  const fetchRecords = () => {
    api.get("/patient/health-records")
      .then(r => setRecords(r.data.data || []))
      .catch(() => {});
  };

  useEffect(() => { fetchRecords(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addRecord = async (e) => {
    e.preventDefault();
    try {
      await api.post("/patient/health-records", form);
      toast.success("Health record added!");
      setShowForm(false);
      setForm({ type: "BLOOD_PRESSURE", title: "", systolic: "", diastolic: "", sugarLevel: "", heartRate: "", notes: "" });
      fetchRecords();
    } catch {
      toast.error("Failed to add record");
    }
  };

  const bpRecords = records.filter(r => r.type === "BLOOD_PRESSURE").slice(-7);
  const sugarRecords = records.filter(r => r.type === "SUGAR_LEVEL").slice(-7);

  const latestBP = bpRecords[bpRecords.length - 1];
  const latestSugar = sugarRecords[sugarRecords.length - 1];
  const latestHR = records.filter(r => r.type === "HEART_RATE").slice(-1)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Health Records</h1>
          <p className="text-gray-500 text-sm">Track your vitals and medical reports</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Record
        </button>
      </div>

      {showForm && (
        <div className="card border-primary border">
          <h2 className="font-semibold mb-4">Add Health Record</h2>
          <form onSubmit={addRecord} className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
              <select className="input" value={form.type} onChange={set("type")}>
                <option value="BLOOD_PRESSURE">Blood Pressure</option>
                <option value="SUGAR_LEVEL">Sugar Level</option>
                <option value="HEART_RATE">Heart Rate</option>
                <option value="LAB_REPORT">Lab Report</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
              <input className="input" placeholder="e.g. Morning reading" value={form.title} onChange={set("title")} />
            </div>
            {form.type === "BLOOD_PRESSURE" && <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Systolic (mmHg)</label>
                <input className="input" type="number" placeholder="120" value={form.systolic} onChange={set("systolic")} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Diastolic (mmHg)</label>
                <input className="input" type="number" placeholder="80" value={form.diastolic} onChange={set("diastolic")} />
              </div>
            </>}
            {form.type === "SUGAR_LEVEL" && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Sugar Level (mg/dL)</label>
                <input className="input" type="number" placeholder="120" value={form.sugarLevel} onChange={set("sugarLevel")} />
              </div>
            )}
            {form.type === "HEART_RATE" && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Heart Rate (bpm)</label>
                <input className="input" type="number" placeholder="72" value={form.heartRate} onChange={set("heartRate")} />
              </div>
            )}
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
              <input className="input" placeholder="Optional notes..." value={form.notes} onChange={set("notes")} />
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" className="btn-primary">Save Record</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Heart size={22} className="text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{latestBP ? `${latestBP.systolic}/${latestBP.diastolic}` : "--"}</p>
          <p className="text-xs text-gray-500">Blood Pressure (mmHg)</p>
        </div>
        <div className="card text-center">
          <Droplets size={22} className="text-blue-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{latestSugar?.sugarLevel || "--"}</p>
          <p className="text-xs text-gray-500">Blood Sugar (mg/dL)</p>
        </div>
        <div className="card text-center">
          <Activity size={22} className="text-green-500 mx-auto mb-1" />
          <p className="text-2xl font-bold">{latestHR?.heartRate || "--"}</p>
          <p className="text-xs text-gray-500">Heart Rate (bpm)</p>
        </div>
      </div>

      {(bpRecords.length > 0 || sugarRecords.length > 0) && (
        <div className="card">
          <div className="flex gap-3 mb-4">
            <button onClick={() => setActiveTab("BLOOD_PRESSURE")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === "BLOOD_PRESSURE" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>Blood Pressure</button>
            <button onClick={() => setActiveTab("SUGAR_LEVEL")} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === "SUGAR_LEVEL" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}>Blood Sugar</button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={activeTab === "BLOOD_PRESSURE" ? bpRecords : sugarRecords}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey={(d) => new Date(d.recordedAt).toLocaleDateString()} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              {activeTab === "BLOOD_PRESSURE" ? <>
                <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={false} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Diastolic" />
              </> : (
                <Line type="monotone" dataKey="sugarLevel" stroke="#f59e0b" strokeWidth={2} dot={false} name="Sugar Level" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
