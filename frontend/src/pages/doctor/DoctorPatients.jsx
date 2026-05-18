import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import api from "../../api/axios";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [adherenceMap, setAdherenceMap] = useState({});

  useEffect(() => {
    api.get("/doctor/patients").then(async r => {
      const list = r.data.data || [];
      setPatients(list);
      const map = {};
      await Promise.all(list.map(async p => {
        try {
          const res = await api.get(`/doctor/patients/${p.id}/adherence`);
          map[p.id] = res.data.data?.adherencePercent || 0;
        } catch { map[p.id] = 0; }
      }));
      setAdherenceMap(map);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <p className="text-gray-500 text-sm">Monitor patient health and medication adherence</p>
      </div>

      {patients.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">No patients yet.</div>
      ) : (
        <div className="grid gap-4">
          {patients.map((p) => {
            const adh = adherenceMap[p.id] || 0;
            return (
              <div key={p.id} className="card flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <Users size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-500">{p.email}</p>
                    <p className="text-xs text-gray-400">{p.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Medication Adherence</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${adh >= 80 ? "bg-green-500" : adh >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${adh}%` }} />
                    </div>
                    <span className={`text-sm font-semibold ${adh >= 80 ? "text-green-600" : adh >= 60 ? "text-yellow-600" : "text-red-600"}`}>{adh}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
