import { useEffect, useState } from "react";
import { Plus, Trash2, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const emptyMed = { name: "", dose: "", frequency: "", duration: "" };

export default function DoctorPrescriptions() {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: "", diagnosis: "", medicines: [{ ...emptyMed }], notes: "" });

  const fetchData = () => {
    setLoading(true);
    api.get("/doctor/registered-patients")
      .then((patientsRes) => {
        setPatients(patientsRes.data.data || []);
      })
      .catch(() => {
        // Fallback for older backend builds where this route doesn't exist yet.
        api.get("/doctor/patients")
          .then((fallbackRes) => setPatients(fallbackRes.data.data || []))
          .catch(() => {
            // Final fallback to all registered patients.
            api.get("/auth/patients")
              .then((authRes) => setPatients(authRes.data.data || []))
              .catch(() => {});
          });
      });

    api.get("/doctor/prescriptions")
      .then((prescriptionsRes) => {
        setPrescriptions(prescriptionsRes.data.data || []);
      })
      .catch(() => {
        toast.error("Failed to load prescription data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setMed = (i, k) => (e) => {
    const meds = [...form.medicines];
    meds[i] = { ...meds[i], [k]: e.target.value };
    setForm({ ...form, medicines: meds });
  };
  const addMedRow = () => setForm({ ...form, medicines: [...form.medicines, { ...emptyMed }] });
  const removeMedRow = (i) => setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        patientId: form.patientId,
        diagnosis: form.diagnosis,
        notes: form.notes,
        medicines: form.medicines.map((m) => ({
          name: m.name,
          dosage: m.dose,
          frequency: m.frequency,
          duration: m.duration
        }))
      };
      await api.post("/doctor/prescriptions", payload);

      // Local fallback cache so patient portal can still display latest prescriptions
      // when backend patient endpoint is temporarily unavailable.
      const cacheKey = `patient_prescriptions_${form.patientId}`;
      const cached = JSON.parse(localStorage.getItem(cacheKey) || "[]");
      const newCachedPrescription = {
        id: `local-${Date.now()}`,
        patientId: form.patientId,
        patientName: patients.find((p) => p.id === form.patientId)?.name || "",
        doctorName: currentUser?.name || "Doctor",
        diagnosis: form.diagnosis,
        notes: form.notes,
        issuedAt: new Date().toISOString(),
        medicines: payload.medicines
      };
      localStorage.setItem(cacheKey, JSON.stringify([newCachedPrescription, ...cached]));
      const allCached = JSON.parse(localStorage.getItem("patient_prescriptions_all") || "[]");
      localStorage.setItem("patient_prescriptions_all", JSON.stringify([newCachedPrescription, ...allCached]));

      toast.success("Prescription issued successfully");
      setForm({ patientId: "", diagnosis: "", medicines: [{ ...emptyMed }], notes: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to issue prescription");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
          <p className="text-gray-500 text-sm">Issue digital prescriptions to patients</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Prescription
        </button>
      </div>

      {showForm && (
        <div className="card border-primary border">
          <h2 className="font-semibold mb-4">Issue Prescription</h2>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Patient</label>
                <select className="input" value={form.patientId} onChange={setField("patientId")} required>
                  <option value="">-- Select patient --</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Diagnosis</label>
                <input className="input" placeholder="e.g. Hypertension" value={form.diagnosis} onChange={setField("diagnosis")} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
              <input className="input" placeholder="Additional instructions for patient" value={form.notes} onChange={setField("notes")} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Medicines</label>
                <button type="button" onClick={addMedRow} className="text-primary text-sm flex items-center gap-1 hover:underline">
                  <Plus size={14} /> Add Row
                </button>
              </div>
              <div className="space-y-2">
                {form.medicines.map((m, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 items-center">
                    <input className="input" placeholder="Medicine name" value={m.name} onChange={setMed(i, "name")} required />
                    <input className="input" placeholder="Dose (e.g. 500mg)" value={m.dose} onChange={setMed(i, "dose")} required />
                    <input className="input" placeholder="Frequency" value={m.frequency} onChange={setMed(i, "frequency")} required />
                    <div className="flex gap-2">
                      <input className="input" placeholder="Duration" value={m.duration} onChange={setMed(i, "duration")} required />
                      {form.medicines.length > 1 && (
                        <button type="button" onClick={() => removeMedRow(i)} className="text-red-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">Issue Prescription</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <ClipboardList size={20} className="text-gray-400" />
            <p className="text-gray-500 text-sm">Loading prescriptions...</p>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <ClipboardList size={20} className="text-gray-400" />
            <p className="text-gray-500 text-sm">No prescriptions issued yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((p) => (
              <div key={p.id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">{p.patientName}</p>
                <p className="text-sm text-gray-500">{p.diagnosis}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
