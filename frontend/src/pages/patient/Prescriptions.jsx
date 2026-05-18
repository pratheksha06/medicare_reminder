import { useState, useEffect } from "react";
import { FileText, Download } from "lucide-react";
import api from "../../api/axios";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const patientName = (currentUser?.name || "").trim().toLowerCase();
    const cacheKey = `patient_prescriptions_${currentUser?.id || ""}`;
    const directCache = JSON.parse(localStorage.getItem(cacheKey) || "[]");
    const allCacheKeys = Object.keys(localStorage).filter((k) => k.startsWith("patient_prescriptions_"));
    const allCached = allCacheKeys.flatMap((k) => {
      try {
        const data = JSON.parse(localStorage.getItem(k) || "[]");
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    });
    const globalCached = JSON.parse(localStorage.getItem("patient_prescriptions_all") || "[]");
    const cachedPrescriptions = [...directCache, ...allCached].filter((p) =>
      p?.patientId === currentUser?.id ||
      (p?.patientName || "").trim().toLowerCase() === patientName
    );
    const finalCached = [...cachedPrescriptions, ...globalCached].filter((p) =>
      p?.patientId === currentUser?.id ||
      (p?.patientName || "").trim().toLowerCase() === patientName
    );

    api.get("/patient/prescriptions")
      .then(r => {
        const apiData = r.data.data || [];
        const merged = [...finalCached, ...apiData];
        const unique = merged.filter((item, idx, arr) =>
          idx === arr.findIndex((x) => x.id === item.id || (
            x.patientId === item.patientId &&
            x.doctorName === item.doctorName &&
            x.diagnosis === item.diagnosis &&
            x.issuedAt === item.issuedAt
          ))
        );
        setPrescriptions(unique);
      })
      .catch(() => {
        setPrescriptions(finalCached);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-500 text-sm">Your digital prescription history</p>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading prescriptions...</p>
      ) : prescriptions.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No prescriptions yet.</div>
      ) : (
        <div className="grid gap-5">
          {prescriptions.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{p.doctorName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(p.issuedAt).toLocaleDateString()} · {p.diagnosis}
                    </p>
                  </div>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-2 font-medium">Medicine</th>
                    <th className="pb-2 font-medium">Dose</th>
                    <th className="pb-2 font-medium">Frequency</th>
                    <th className="pb-2 font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {p.medicines?.map((m, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-2 font-medium">{m.name}</td>
                      <td className="py-2 text-gray-600">{m.dosage}</td>
                      <td className="py-2 text-gray-600">{m.frequency}</td>
                      <td className="py-2 text-gray-600">{m.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
