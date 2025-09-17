import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import logo from '../../assets/logo.png';
import './AdminDashboard.css';

Chart.register(...registerables);

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("Practitioner");

    const [allDoctors, setAllDoctors] = useState([]);
    const [allTherapies, setAllTherapies] = useState([]);

    const [doctorForm, setDoctorForm] = useState({
        name: "", email: "", contact: "", specialization: "", password: "",
        workingDays: [], therapies: []
    });
    const [therapyForm, setTherapyForm] = useState({
        name: "", duration: "", cost: "", prePrecaution: "", postPrecaution: ""
    });

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const popularityChartRef = useRef(null);
    const revenueChartRef = useRef(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "admin") {
            navigate("/admin");
        } else {
            setUser(storedUser);
            fetchDoctors();
            fetchTherapies();
        }
    }, [navigate]);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get("http://localhost:5000/auth/doctors");
            if (res.data.success) setAllDoctors(res.data.doctors);
        } catch (err) { console.error("Failed to fetch doctors:", err); }
    };

    const fetchTherapies = async () => {
        try {
            const res = await axios.get("http://localhost:5000/therapy/all");
            if (res.data.success) setAllTherapies(res.data.therapies);
        } catch (err) { console.error("Failed to fetch therapies:", err); }
    };

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/auth/add-doctor", doctorForm);
            if (res.data.success) {
                alert(`Practitioner ${doctorForm.name} added successfully!`);
                setDoctorForm({ name: "", email: "", contact: "", specialization: "", password: "", workingDays: [], therapies: [] });
                fetchDoctors();
                setIsModalOpen(false);
            }
        } catch (err) { alert("Error adding practitioner: " + (err.response?.data?.message || err.message)); }
    };

    const handleTherapySubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/therapy/add-therapy", therapyForm);
            if (res.data.success) {
                alert(`Therapy ${therapyForm.name} added successfully!`);
                setTherapyForm({ name: "", duration: "", cost: "", prePrecaution: "", postPrecaution: "" });
                fetchTherapies();
                setIsModalOpen(false);
            }
        } catch (err) { alert("Error adding therapy: " + (err.response?.data?.message || err.message)); }
    };
    
    const handleCheckboxChange = (e, formType, field) => {
        const { value, checked } = e.target;
        const setForm = formType === 'doctor' ? setDoctorForm : null;
        if (!setForm) return;

        setForm(prevForm => {
            const oldValues = prevForm[field];
            const newValues = checked ? [...oldValues, value] : oldValues.filter(v => v !== value);
            return { ...prevForm, [field]: newValues };
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/admin");
    };

    useEffect(() => {
        const chartGreen = 'rgba(52, 142, 96, 1)';
        const chartBlue = 'rgba(59, 130, 246, 1)';
        const chartBlueFill = 'rgba(59, 130, 246, 0.2)';
        let popularityChartInstance, revenueChartInstance;

        if (popularityChartRef.current) {
            popularityChartInstance = new Chart(popularityChartRef.current.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Vamana', 'Virechana', 'Basti', 'Nasya', 'Raktamokshana'],
                    datasets: [{ label: 'Sessions This Month', data: [120, 95, 80, 65, 30], backgroundColor: chartGreen }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }
        if (revenueChartRef.current) {
            revenueChartInstance = new Chart(revenueChartRef.current.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{ label: 'Revenue (in ₹)', data: [75000, 90000, 82000, 103000], borderColor: chartBlue, backgroundColor: chartBlueFill, fill: true }]
                },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
            });
        }
        return () => {
            if (popularityChartInstance) popularityChartInstance.destroy();
            if (revenueChartInstance) revenueChartInstance.destroy();
        }
    }, []);

    return (
        <div className='admin-dashboard-container'>
            <nav className="admin-nav">
                <img src={logo} alt="Logo" className="logo-small" />
                <div className="admin-nav-side">
                    <button className="book-btn" onClick={() => setIsModalOpen(true)}>
                        <FontAwesomeIcon icon={faPlus} /> Add New
                    </button>
                    <button onClick={handleLogout} className='logout'>LogOut</button>
                </div>
            </nav>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <div className="modal-tabs">
                            <button onClick={() => setActiveTab('Practitioner')} className={activeTab === 'Practitioner' ? 'active' : ''}>Add Practitioner</button>
                            <button onClick={() => setActiveTab('Therapy')} className={activeTab === 'Therapy' ? 'active' : ''}>Add Therapy</button>
                        </div>
                        {activeTab === 'Practitioner' ? (
                            <form onSubmit={handleDoctorSubmit} className="form">
                                <h2>New Practitioner Details</h2>
                                <input type="text" placeholder="Full Name" required value={doctorForm.name} onChange={e => setDoctorForm({ ...doctorForm, name: e.target.value })} />
                                <input type="email" placeholder="Email" required value={doctorForm.email} onChange={e => setDoctorForm({ ...doctorForm, email: e.target.value })} />
                                <input type="password" placeholder="Password" required value={doctorForm.password} onChange={e => setDoctorForm({ ...doctorForm, password: e.target.value })} />
                                <input type="text" placeholder="Contact Number" required value={doctorForm.contact} onChange={e => setDoctorForm({ ...doctorForm, contact: e.target.value })} />
                                <input type="text" placeholder="Specialization" required value={doctorForm.specialization} onChange={e => setDoctorForm({ ...doctorForm, specialization: e.target.value })} />
                                <div className="checkbox-group">
                                    <label>Assign Therapies:</label>
                                    <div className="checkbox-options">
                                        {allTherapies.map(th => (<label key={th._id}><input type="checkbox" value={th._id} checked={doctorForm.therapies.includes(th._id)} onChange={(e) => handleCheckboxChange(e, 'doctor', 'therapies')} /> {th.name}</label>))}
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <label>Working Days:</label>
                                    <div className="checkbox-options">
                                        {weekdays.map(day => (<label key={day}><input type="checkbox" value={day} checked={doctorForm.workingDays.includes(day)} onChange={(e) => handleCheckboxChange(e, 'doctor', 'workingDays')} /> {day}</label>))}
                                    </div>
                                </div>
                                <button type="submit" className="submit-btn">Submit Practitioner</button>
                            </form>
                        ) : (
                             <form onSubmit={handleTherapySubmit} className="form">
                                <h2>New Therapy Details</h2>
                                <input placeholder="Therapy Name" required value={therapyForm.name} onChange={e => setTherapyForm({ ...therapyForm, name: e.target.value })} />
                                <input placeholder="Duration (e.g., 60 mins)" required value={therapyForm.duration} onChange={e => setTherapyForm({ ...therapyForm, duration: e.target.value })}/>
                                <input type="number" placeholder="Cost (₹)" required value={therapyForm.cost} onChange={e => setTherapyForm({ ...therapyForm, cost: e.target.value })}/>
                                <textarea placeholder="Pre-Procedure Precautions" rows="2" value={therapyForm.prePrecaution} onChange={e => setTherapyForm({ ...therapyForm, prePrecaution: e.target.value })}></textarea>
                                <textarea placeholder="Post-Procedure Precautions" rows="2" value={therapyForm.postPrecaution} onChange={e => setTherapyForm({ ...therapyForm, postPrecaution: e.target.value })}></textarea>
                                <button type="submit" className="submit-btn">Submit Therapy</button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <main className='admin-main'>
                <div className="admin-cont">
                    <h1>Center Administration</h1>
                    <p>Operational "bird's-eye view" of the entire facility.</p>
                </div>

                <div className="admin-stats">
                    <div className="box"><p>Patients (This Month)</p><p className='stat-data'>86</p></div>
                    <div className="box"><p>Appointments (This Week)</p><p className='stat-data'>110</p></div>
                    <div className="box"><p>Attendance Rate</p><p className='stat-data'>75%</p></div>
                    <div className="box"><p>Revenue (This Month)</p><p className='stat-data'>₹ 1,03,000</p></div>
                </div>

                <div className="ther-graph">
                    <div className="chart-container"><canvas ref={popularityChartRef}></canvas></div>
                    <div className="stat-desc1">
                        <h1>Therapy Popularity</h1>
                        <p>The graph shows the number of patients in each therapy. Vamana is the most preferred therapy helping more than 100 patients to help them overcome their health problems followed by Virechana and Basti.</p>
                    </div>
                </div>

                <div className="ther-graph">
                     <div className="stat-desc2">
                        <h1>Revenue Trend</h1>
                        <p>The graph shows the revenue collection for the last 4 weeks. The revenue collection depends on number of patients completed each therapy.</p>
                    </div>
                    <div className="chart-container"><canvas ref={revenueChartRef}></canvas></div>
                </div>

                <div className="practitioner-management">
                    <h3 className="card-title">Practitioner Management</h3>
                    <div className="table-wrapper">
                        <table className="practitioner-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Specialty</th>
                                    <th>Status</th> {/* ADDED THIS COLUMN */}
                                    <th>Patients Today</th> {/* ADDED THIS COLUMN */}
                                    <th>Contact</th>
                                    <th>Working Days</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allDoctors.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.name}</td>
                                        <td>{p.specialization}</td>
                                        {/* NOTE: Status is static. It needs to come from backend. */}
                                        <td>
                                            <span className="status-badge status-available">
                                                Available
                                            </span>
                                        </td>
                                        {/* NOTE: Patient count is static. It needs to come from backend. */}
                                        <td>N/A</td>
                                        <td>{p.contact}</td>
                                        <td>{p.workingDays.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AdminDashboard;