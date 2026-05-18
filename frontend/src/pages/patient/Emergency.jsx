import { useState } from "react";
import { AlertCircle, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const hospitals = [
  { name: "City General Hospital", distance: "0.8 km", phone: "+1 555-0200", address: "123 Main St" },
  { name: "St. Mary Medical Center", distance: "1.2 km", phone: "+1 555-0201", address: "456 Oak Ave" },
  { name: "Community Health Clinic", distance: "2.1 km", phone: "+1 555-0202", address: "789 Pine Rd" },
];

export default function Emergency() {
  const [sosSent, setSosSent] = useState(false);

  const sendSOS = () => {
    setSosSent(true);
    toast.success("🚨 SOS Alert sent to your emergency contacts and nearest hospital!");
    setTimeout(() => setSosSent(false), 5000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Emergency Support</h1>
        <p className="text-gray-500 text-sm">Quick access to emergency services</p>
      </div>

      <div className="card bg-red-50 border border-red-200 text-center py-10">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Emergency SOS</h2>
        <p className="text-red-600 text-sm mb-6">Press the button below to alert your caretakers and nearest hospital</p>
        <button
          onClick={sendSOS}
          disabled={sosSent}
          className={`px-10 py-4 rounded-full text-white font-bold text-lg shadow-lg transition ${sosSent ? "bg-gray-400" : "bg-red-500 hover:bg-red-600 animate-pulse"}`}
        >
          {sosSent ? "SOS Sent ✓" : "🚨 SEND SOS"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <Phone size={24} className="text-primary mx-auto mb-2" />
          <p className="font-semibold">Ambulance</p>
          <p className="text-2xl font-bold text-primary mt-1">911</p>
        </div>
        <div className="card text-center">
          <Phone size={24} className="text-green-500 mx-auto mb-2" />
          <p className="font-semibold">Poison Control</p>
          <p className="text-2xl font-bold text-green-600 mt-1">1-800-222-1222</p>
        </div>
        <div className="card text-center">
          <Phone size={24} className="text-yellow-500 mx-auto mb-2" />
          <p className="font-semibold">Crisis Helpline</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">988</p>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><MapPin size={18} className="text-primary" /> Nearby Hospitals</h2>
        <div className="space-y-3">
          {hospitals.map((h, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{h.name}</p>
                <p className="text-xs text-gray-500">{h.address} · {h.distance}</p>
              </div>
              <a href={`tel:${h.phone}`} className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
                <Phone size={14} /> {h.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
