import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    contactNo: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Backend me dob aur contactNo handle nahi hote, lekin frontend validation ke liye include
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/register",
        payload
      );
      alert(res.data.message);
      navigate("/login/patient"); // registration ke baad login page
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="login-container">
      <div className="auth-wrapper">
        <div className="info-block">
          <h2>Let's Get Started</h2>
          <p>Create your account to begin your wellness journey with us.</p>
        </div>

        <div className="login-box">
          <button
            onClick={() => navigate("/login/patient")}
            className="back-button"
          >
            ← Back to Login
          </button>

          <h2>Patient Registration</h2>
          <p>Create your account to get started.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
                onChange={handleChange}
                value={formData.name}
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
                value={formData.email}
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
                value={formData.password}
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  onChange={handleChange}
                  value={formData.dob}
                />
              </div>
              <div className="input-group">
                <label htmlFor="contactNo">Contact No.</label>
                <input
                  type="tel"
                  id="contactNo"
                  name="contactNo"
                  placeholder="9876543210"
                  onChange={handleChange}
                  value={formData.contactNo}
                />
              </div>
            </div>

            <button type="submit" className="login-button">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
