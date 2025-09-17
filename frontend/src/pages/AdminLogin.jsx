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

      const res = await axios.post("http://localhost:5000/auth/admin-login", payload);

      if (res.data.success && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/admin-dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    

    <div className="login-container flex items-center justify-center min-h-screen bg-gray-100">
  <div className="auth-wrapper bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
    
    <div className="info-block mb-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Welcome ADMIN!</h2>
      <p className="text-gray-600">Access the administrative dashboard to manage the platform.</p>
    </div>

    <div className="login-box">
      <button 
        onClick={() => navigate('/')} 
        className="back-button mb-4 text-blue-500 hover:text-blue-700"
      >
        ← Go Back
      </button>

      <h2 className="text-xl font-semibold mb-2">Admin Login</h2>
      <p className="text-gray-600 mb-4">Enter administrative credentials.</p>

      <form onSubmit={handleSubmit} className="login-form flex flex-col gap-4">
        
        <div className="input-group flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium">Enter Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="input-group flex flex-col">
          <label htmlFor="adminKey" className="mb-1 font-medium">Secret Key</label>
          <input
            type="text"
            id="adminKey"
            name="adminKey"
            placeholder="Admin Secret Key"
            value={form.adminKey}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button 
          type="submit" 
          className="login-button bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</div>


    
  );
};

export default AdminLogin;