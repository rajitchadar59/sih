import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Login() {
  const { roleParam } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: roleParam || "patient",
  });

  useEffect(() => {
    if (roleParam) setForm((prev) => ({ ...prev, role: roleParam }));
  }, [roleParam]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", form);

      if (res.data.success && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.role === "doctor") navigate("/doctor-dashboard");
        else navigate("/patient-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {form.role.charAt(0).toUpperCase() + form.role.slice(1)} Login
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-2"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
