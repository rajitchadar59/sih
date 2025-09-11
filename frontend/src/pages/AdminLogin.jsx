import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    adminKey: "",
    role: "admin",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...form };
      delete payload.password;

      const res = await axios.post("http://localhost:5000/auth/login", payload);

      if (res.data.success && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="adminKey"
          placeholder="Admin Secret Key"
          value={form.adminKey}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
