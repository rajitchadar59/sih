// DoctorDashboard.jsx (Updated with new "Complete" Logic)

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import './DoctorDashboard.css';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarCheck, faClock, faNotesMedical } from "@fortawesome/free-solid-svg-icons";

const DoctorDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "doctor") {
            navigate("/login/doctor");
        } else {
            setUser(storedUser);
            fetchAppointments(storedUser._id);
        }
    }, [navigate]);

    const fetchAppointments = async (doctorId) => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:5000/appointment/doctor/${doctorId}`
            );
            if (res.data.success) {
                const sortedAppointments = (res.data.appointments || []).sort((a, b) => new Date(b.date) - new Date(a.date));
                setAppointments(sortedAppointments);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // RENAMED: Function name is now clearer
    const markAppointmentAsComplete = async (appointmentId) => {
        try {
            // This API endpoint marks the appointment as 'completed'
            const res = await axios.put(
                `http://localhost:5000/appointment/confirm/${appointmentId}`
            );
            if (res.data.success) {
                // CHANGED: Alert message is now more accurate
                alert("Appointment marked as complete!");
                setAppointments((prev) =>
                    prev.map((a) =>
                        a._id === appointmentId ? { ...a, completed: true } : a
                    )
                );
            }
        } catch (err) {
            console.error(err);
            alert("Error marking appointment as complete.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login/doctor");
    };

    if (!user) {
        return <div className="loading-container">Loading...</div>;
    }

    // RENAMED: Variables are now clearer
    const upcomingAppointments = appointments.filter(a => !a.completed);
    const completedAppointments = appointments.filter(a => a.completed);

    return (
        <div className="doctor-dashboard">
            <nav className="dash-nav">
                <div className="logo-container">
                    <img src={logo} alt="AyurSutra" className="logo-small" />
                    <span>Practitioner Portal</span>
                </div>
                <div className="profile-container">
                    <div className="profile-info">
                        <strong>Dr. {user.name.split(' ')[0]}</strong>
                        <span>{user.specialization || "Doctor"}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <main className="dash-main">
                <header className="dash-header">
                    <h1>Welcome back, Dr. {user.name}!</h1>
                    <p>Here are your upcoming and completed appointments.</p>
                </header>

                <div className="appointments-grid">
                    {/* UPCOMING APPOINTMENTS SECTION */}
                    <section className="appointment-section">
                        {/* CHANGED: Title updated */}
                        <h2 style={{color:"#fff"}}>Upcoming Appointments ({upcomingAppointments.length})</h2>
                        {loading ? <p>Loading appointments...</p> : (
                            upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map(a => (
                                    <div key={a._id} className="appointment-card pending">
                                        <div className="card-header">
                                            <div className="patient-info">
                                                <FontAwesomeIcon icon={faUser} className="card-icon" />
                                                <div>
                                                    <strong>{a.patient?.name}</strong>
                                                    <span>{a.patient?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p><FontAwesomeIcon icon={faNotesMedical} /> <strong>Therapy:</strong> {a.therapy?.name}</p>
                                            <p><FontAwesomeIcon icon={faCalendarCheck} /> <strong>Date:</strong> {new Date(a.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            <p><FontAwesomeIcon icon={faClock} /> <strong>Slot:</strong> {a.slot}</p>
                                        </div>
                                        <div className="card-footer">
                                            <button
                                                onClick={() => markAppointmentAsComplete(a._id)}
                                                className="confirm-btn"
                                            >
                                                {/* CHANGED: Button text updated */}
                                                Mark as Complete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-appointments-msg">No upcoming appointments.</p>
                            )
                        )}
                    </section>

                    {/* COMPLETED APPOINTMENTS SECTION */}
                    <section className="appointment-section">
                         {/* CHANGED: Title updated */}
                        <h2>Completed Appointments ({completedAppointments.length})</h2>
                        {loading ? <p>Loading history...</p> : (
                             completedAppointments.length > 0 ? (
                                completedAppointments.map(a => (
                                    <div key={a._id} className="appointment-card confirmed">
                                         <div className="card-header">
                                            <div className="patient-info">
                                                <FontAwesomeIcon icon={faUser} className="card-icon" />
                                                <div>
                                                    <strong>{a.patient?.name}</strong>
                                                    <span>{a.patient?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <p><FontAwesomeIcon icon={faNotesMedical} /> <strong>Therapy:</strong> {a.therapy?.name}</p>
                                            <p><FontAwesomeIcon icon={faCalendarCheck} /> <strong>Date:</strong> {new Date(a.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            <p><FontAwesomeIcon icon={faClock} /> <strong>Slot:</strong> {a.slot}</p>
                                        </div>
                                        <div className="card-footer">
                                            <button className="confirm-btn" disabled>
                                                {/* CHANGED: Button text updated */}
                                                ✅ Completed
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-appointments-msg">No completed appointments found.</p>
                            )
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;