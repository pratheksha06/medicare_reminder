import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Pill } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "PATIENT", phone: "" });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Pill size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">MediCare Reminder</h1>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-5">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
              <input className="input" placeholder="John Doe" value={form.name} onChange={set("name")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Phone</label>
              <input className="input" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={set("phone")} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Role</label>
              <select className="input" value={form.role} onChange={set("role")}>
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={set("password")} required minLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-primary font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
