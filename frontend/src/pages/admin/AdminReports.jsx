import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const adherenceByCondition = [
  { condition: "Hypertension", rate: 85 },
  { condition: "Diabetes", rate: 72 },
  { condition: "Heart Disease", rate: 91 },
  { condition: "Asthma", rate: 60 },
  { condition: "Arthritis", rate: 78 },
];

const missedDoseData = [
  { name: "Taken", value: 83, color: "#22c55e" },
  { name: "Missed", value: 12, color: "#ef4444" },
  { name: "Delayed", value: 5, color: "#f59e0b" },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-500 text-sm">System-wide health and medication analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-4">Adherence by Condition (%)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={adherenceByCondition} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="condition" type="category" tick={{ fontSize: 11 }} width={90} />
              <Tooltip />
              <Bar dataKey="rate" fill="#0ea5e9" radius={[0, 4, 4, 0]} name="Adherence %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold mb-4">Overall Dose Compliance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={missedDoseData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                {missedDoseData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">Summary Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Reminders Sent", value: "12,480" },
            { label: "Doses Taken on Time", value: "10,358" },
            { label: "Missed Doses", value: "1,498" },
            { label: "Active Prescriptions", value: "384" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
