import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import axios from "axios";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Doctors");

  // Doctor Form
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    contact: "",
    specialization: "",
    therapy: "",
    therapyDuration: "",
    workingDays: "",
    prePrecaution: "",
    postPrecaution: "",
    password: ""
  });

  // Therapy Form
  const [therapyForm, setTherapyForm] = useState({
    name: "",
    duration: "",
    cost: ""
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/admin"); 
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/admin");
  };

  // Submit Doctor -> Backend Call


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
        therapy: "",
        therapyDuration: "",
        workingDays: "",
        prePrecaution: "",
        postPrecaution: "",
        password: ""
      });
    } else {
      alert("Error: " + res.data.message);
    }
  } catch (err) {
    if (err.response) {
      // Server responded with a status code out of 2xx
      alert("Server Error: " + err.response.data.message || err.response.statusText);
    } else if (err.request) {
      // Request was made but no response received
      alert("No response from server. Check backend.");
    } else {
      // Something else happened
      alert("Error: " + err.message);
    }
    console.error(err);
  }
};


  // Submit Therapy (only frontend for now)
  const handleTherapySubmit = (e) => {
    e.preventDefault();
    console.log("Therapy Added:", therapyForm);
    alert(`Therapy ${therapyForm.name} added successfully!`);
    setTherapyForm({ name: "", duration: "", cost: "" });
  };

  if (!user) return null;

  // Render form based on active tab
  const renderContent = () => {
    if (activeTab === "Doctors") {
      return (
        <div>
          <h2>Add Doctor</h2>
          <form onSubmit={handleDoctorSubmit}>
            <div><label>Name:</label>
              <input type="text" value={doctorForm.name} onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })} required />
            </div>
            <div><label>Email:</label>
              <input type="email" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} required />
            </div>
            <div><label>Contact No:</label>
              <input type="text" value={doctorForm.contact} onChange={(e) => setDoctorForm({ ...doctorForm, contact: e.target.value })} required />
            </div>
            <div><label>Specialization:</label>
              <input type="text" value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })} required />
            </div>
            <div><label>Therapy:</label>
              <input type="text" value={doctorForm.therapy} onChange={(e) => setDoctorForm({ ...doctorForm, therapy: e.target.value })} required />
            </div>
            <div><label>Therapy Duration:</label>
              <input type="text" value={doctorForm.therapyDuration} onChange={(e) => setDoctorForm({ ...doctorForm, therapyDuration: e.target.value })} required />
            </div>
            <div><label>Working Days:</label>
              <input type="text" placeholder="Mon, Tue, Wed" value={doctorForm.workingDays} onChange={(e) => setDoctorForm({ ...doctorForm, workingDays: e.target.value })} />
            </div>
            <div><label>Pre Precaution:</label>
              <input type="text" value={doctorForm.prePrecaution} onChange={(e) => setDoctorForm({ ...doctorForm, prePrecaution: e.target.value })} />
            </div>
            <div><label>Post Precaution:</label>
              <input type="text" value={doctorForm.postPrecaution} onChange={(e) => setDoctorForm({ ...doctorForm, postPrecaution: e.target.value })} />
            </div>
            <div><label>Password:</label>
              <input type="password" value={doctorForm.password} onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })} required />
            </div>
            <button type="submit">Add Doctor</button>
          </form>
        </div>
      );
    } else if (activeTab === "Therapies") {
      return (
        <div>
          <h2>Add Therapy</h2>
          <form onSubmit={handleTherapySubmit}>
            <div><label>Name:</label>
              <input type="text" value={therapyForm.name} onChange={(e) => setTherapyForm({ ...therapyForm, name: e.target.value })} required />
            </div>
            <div><label>Duration (mins):</label>
              <input type="number" value={therapyForm.duration} onChange={(e) => setTherapyForm({ ...therapyForm, duration: e.target.value })} required />
            </div>
            <div><label>Cost ($):</label>
              <input type="number" value={therapyForm.cost} onChange={(e) => setTherapyForm({ ...therapyForm, cost: e.target.value })} required />
            </div>
            <button type="submit">Add Therapy</button>
          </form>
        </div>
      );
    } else {
      return <p>Select a tab to add Doctors or Therapies.</p>;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Dashboard</h1>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <div style={{ marginTop: "20px" }}>{renderContent()}</div>
        <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;
