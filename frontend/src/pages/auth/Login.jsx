import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Pill } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { token, id, name, email, role } = res.data.data;
      login({ id, name, email, role }, token);
      toast.success(`Welcome, ${name}!`);
      navigate(`/${role.toLowerCase()}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
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
          <p className="text-gray-500 text-sm mt-1">Your smart healthcare assistant</p>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-5">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
              <input className="input" type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            No account? <Link to="/register" className="text-primary font-medium">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
