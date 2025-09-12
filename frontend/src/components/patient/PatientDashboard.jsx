import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [therapies, setTherapies] = useState([]);
  const [expandedTherapy, setExpandedTherapy] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [expandedDoctor, setExpandedDoctor] = useState({}); // therapyId => doctorId

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "patient") {
      navigate("/login");
    } else {
      setUser(storedUser);
      fetchTherapies();
    }
  }, [navigate]);

  const fetchTherapies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/therapy/all");
      if(res.data.success) setTherapies(res.data.therapies);
    } catch(err) {
      alert("Error fetching therapies: " + err.message);
    }
  };

  const fetchDoctorsForTherapy = async (therapyId) => {
    try {
      const res = await axios.get(`http://localhost:5000/auth/doctors-by-therapy/${therapyId}`);
      if(res.data.success) setDoctors(res.data.doctors);
    } catch(err) {
      console.log(err);
    }
  };

  const handleTherapyClick = (therapyId) => {
    if(expandedTherapy === therapyId) {
      setExpandedTherapy(null);
    } else {
      setExpandedTherapy(therapyId);
      fetchDoctorsForTherapy(therapyId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if(!user) return null;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <h2 style={{ marginTop: "30px" }}>Available Therapies</h2>
      {therapies.length === 0 ? (
        <p>No therapies available yet.</p>
      ) : therapies.map(therapy => (
        <div key={therapy._id} style={{ border: "1px solid #ccc", borderRadius: "8px", margin: "10px 0", padding: "10px" }}>
          {/* Therapy Header */}
          <div onClick={() => handleTherapyClick(therapy._id)} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>{therapy.name}</h3>
            <span>{expandedTherapy === therapy._id ? "▲" : "▼"}</span>
          </div>

          {/* Therapy Details */}
          {expandedTherapy === therapy._id && (
            <div style={{ marginTop: "10px" }}>
              <p><strong>Duration:</strong> {therapy.duration}</p>
              <p><strong>Cost:</strong> {therapy.cost}</p>
              <p><strong>Pre Precaution:</strong> {therapy.prePrecaution || "N/A"}</p>
              <p><strong>Post Precaution:</strong> {therapy.postPrecaution || "N/A"}</p>

              <h4>Doctors for this therapy:</h4>
              {doctors.length === 0 ? <p>No doctors assigned.</p> : doctors.map(doc => (
                <div key={doc._id} style={{ border: "1px solid #eee", borderRadius: "6px", padding: "8px", marginBottom: "6px" }}>
                  {/* Doctor Header */}
                  <div onClick={() => setExpandedDoctor(prev => ({ ...prev, [therapy._id]: prev[therapy._id] === doc._id ? null : doc._id }))} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p><strong>{doc.name}</strong> ({doc.specialization})</p>
                    <span>{expandedDoctor[therapy._id] === doc._id ? "▲" : "▼"}</span>
                  </div>

                  {/* Doctor Details */}
                  {expandedDoctor[therapy._id] === doc._id && (
                    <div style={{ marginTop: "8px" }}>
                      <p><strong>Email:</strong> {doc.email}</p>
                      <p><strong>Contact:</strong> {doc.contact}</p>
                      <p><strong>Working Days:</strong> {doc.workingDays.join(", ")}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button onClick={handleLogout} style={{ marginTop: "30px", padding: "10px 20px", backgroundColor: "#f44336", color: "#fff", border: "none", cursor: "pointer" }}>Logout</button>
    </div>
  );
};

export default PatientDashboard;
