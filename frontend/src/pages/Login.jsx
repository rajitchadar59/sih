import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // same CSS as LoginPage

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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        ...form,
        role: form.role.toLowerCase(), // ensure lowercase for backend match
      });

      if (res.data.success && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        if (res.data.user.role === "doctor") navigate("/doctor-dashboard");
        else navigate("/dashboard/Patient");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="auth-wrapper">
        <div className="info-block">
          <h2>Welcome Back!</h2>
          <p>Your path to wellness continues here. Log in to manage your journey.</p>
        </div>

        <div className="login-box">
          <button onClick={() => navigate('/')} className="back-button">← Go Back</button>
          
          <h2>
     {form.role.toLowerCase() === "doctor" 
    ? "Practitioner" 
    : form.role.charAt(0).toUpperCase() + form.role.slice(1)
   } Login
  </h2>

          
          <p>Please enter your credentials to proceed.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
                value={form.email}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                onChange={handleChange}
                value={form.password}
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>

          {form.role.toLowerCase() === "patient" && (
            <p className="register-link">
              Don't have an account? <a href="/register">Register here</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
