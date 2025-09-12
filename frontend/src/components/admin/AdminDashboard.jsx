import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // login check loading
  const [activeTab, setActiveTab] = useState("Doctors");

  const [allDoctors, setAllDoctors] = useState([]);
  const [allTherapies, setAllTherapies] = useState([]);

  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    contact: "",
    specialization: "",
    password: "",
    workingDays: [],
    therapies: []
  });

  const [therapyForm, setTherapyForm] = useState({
    name: "",
    duration: "",
    cost: "",
    prePrecaution: "",
    postPrecaution: ""
  });

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Login check + fetch doctors & therapies
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/admin");
    } else {
      setUser(storedUser);
      fetchDoctors();
      fetchTherapies();
    }
    setLoading(false);
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/doctors");
      if (res.data.success) setAllDoctors(res.data.doctors);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTherapies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/therapy/all");
      if (res.data.success) setAllTherapies(res.data.therapies);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/auth/add-doctor", doctorForm);
      if (res.data.success) {
        alert(`Doctor ${doctorForm.name} added successfully!`);
        setDoctorForm({
          name: "",
          email: "",
          contact: "",
          specialization: "",
          password: "",
          workingDays: [],
          therapies: []
        });
        fetchDoctors();
      }
    } catch (err) {
      alert("Error adding doctor: " + (err.response?.data?.message || err.message));
    }
  };

  const handleTherapySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/therapy/add-therapy", therapyForm);
      if (res.data.success) {
        alert(`Therapy ${therapyForm.name} added successfully!`);
        setTherapyForm({ name: "", duration: "", cost: "", prePrecaution: "", postPrecaution: "" });
        fetchTherapies();
      }
    } catch (err) {
      alert("Error adding therapy: " + (err.response?.data?.message || err.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin");
  };

  if (loading) return null; // wait for login check
  if (!user) return null;    // safety

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => setActiveTab("Doctors")}
          style={{
            marginRight: "10px",
            padding: "8px 16px",
            backgroundColor: activeTab === "Doctors" ? "#4caf50" : "#ccc",
            color: "#fff"
          }}
        >
          Doctors
        </button>
        <button
          onClick={() => setActiveTab("Therapies")}
          style={{
            padding: "8px 16px",
            backgroundColor: activeTab === "Therapies" ? "#4caf50" : "#ccc",
            color: "#fff"
          }}
        >
          Therapies
        </button>
      </div>

      {/* Doctors Tab */}
      {activeTab === "Doctors" && (
        <form onSubmit={handleDoctorSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            placeholder="Name"
            value={doctorForm.name}
            onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={doctorForm.email}
            onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })}
            required
          />
          <input
            placeholder="Contact"
            value={doctorForm.contact}
            onChange={e => setDoctorForm({ ...doctorForm, contact: e.target.value })}
            required
          />
          <input
            placeholder="Specialization"
            value={doctorForm.specialization}
            onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={doctorForm.password}
            onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })}
            required
          />

          <div>
            <label>Working Days:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              {weekdays.map(day => (
                <label key={day}>
                  <input
                    type="checkbox"
                    value={day}
                    checked={doctorForm.workingDays.includes(day)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setDoctorForm(prev => ({
                        ...prev,
                        workingDays: checked
                          ? [...prev.workingDays, day]
                          : prev.workingDays.filter(d => d !== day)
                      }));
                    }}
                  /> {day}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label>Available Therapies:</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {allTherapies.map(th => (
                <label key={th._id}>
                  <input
                    type="checkbox"
                    value={th._id}
                    checked={doctorForm.therapies.includes(th._id)}
                    onChange={e => {
                      const checked = e.target.checked;
                      setDoctorForm(prev => ({
                        ...prev,
                        therapies: checked
                          ? [...prev.therapies, th._id]
                          : prev.therapies.filter(id => id !== th._id)
                      }));
                    }}
                  /> {th.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" style={{ padding: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none" }}>Add Doctor</button>
        </form>
      )}

      {/* Therapies Tab */}
      {activeTab === "Therapies" && (
        <form onSubmit={handleTherapySubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            placeholder="Therapy Name"
            value={therapyForm.name}
            onChange={e => setTherapyForm({ ...therapyForm, name: e.target.value })}
            required
          />
          <input
            placeholder="Duration"
            value={therapyForm.duration}
            onChange={e => setTherapyForm({ ...therapyForm, duration: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cost"
            value={therapyForm.cost}
            onChange={e => setTherapyForm({ ...therapyForm, cost: e.target.value })}
            required
          />
          <input
            placeholder="Pre Precaution"
            value={therapyForm.prePrecaution}
            onChange={e => setTherapyForm({ ...therapyForm, prePrecaution: e.target.value })}
          />
          <input
            placeholder="Post Precaution"
            value={therapyForm.postPrecaution}
            onChange={e => setTherapyForm({ ...therapyForm, postPrecaution: e.target.value })}
          />

          <button type="submit" style={{ padding: "10px", backgroundColor: "#4caf50", color: "#fff", border: "none" }}>Add Therapy</button>
        </form>
      )}

      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#f44336", color: "#fff", border: "none" }}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
