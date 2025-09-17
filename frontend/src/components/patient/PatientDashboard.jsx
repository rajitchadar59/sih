import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// --- UI Library Imports ---
import './PatientDashboard.css';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMessage, faBars, faTimes, faCalendarAlt, faPlus, faChevronDown, faChevronUp, faBan, faSignOutAlt, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// --- Chart.js Imports ---
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// --- React Calendar Import ---
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- Register Chart.js components ---
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [upcoming, setUpcoming] = useState([]);
    const [yourDoctors, setYourDoctors] = useState([]);
    const [cancelledAppointments, setCancelledAppointments] = useState([]);

    // UI State
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedDoctorId, setExpandedDoctorId] = useState(null);
    const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
    const [expandedNotificationId, setExpandedNotificationId] = useState(null);

    // Modal Form State
    const [modalTherapies, setModalTherapies] = useState([]);
    const [modalDoctors, setModalDoctors] = useState([]);
    const [selectedTherapy, setSelectedTherapy] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "patient") {
            navigate("/login/patient");
        } else {
            setUser(storedUser);
            fetchUpcomingAppointments(storedUser._id);
            fetchTherapiesForModal();
        }
    }, [navigate]);

    useEffect(() => {
        const doctors = upcoming.length > 0 ? [...new Map(upcoming.map(a => [a.doctor?._id, a.doctor])).values()].filter(Boolean) : [];
        setYourDoctors(doctors);
    }, [upcoming]);

    const notificationTherapies = useMemo(() => {
        const therapies = new Map();
        upcoming
            .filter(a => !a.completed && a.therapy)
            .forEach(appt => therapies.set(appt.therapy._id, appt.therapy));
        return Array.from(therapies.values());
    }, [upcoming]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login/patient");
    };

    const fetchUpcomingAppointments = async (patientId) => {
        try {
            const res = await axios.get(`http://localhost:5000/appointment/patient/${patientId}`);
            if (res.data.success) {
                setUpcoming(res.data.appointments || []);
            }
        } catch (err) { console.error("Error fetching appointments:", err); }
    };

    const fetchTherapiesForModal = async () => {
        try {
            const res = await axios.get("http://localhost:5000/therapy/all");
            if (res.data.success) setModalTherapies(res.data.therapies || []);
        } catch (err) { console.error("Error fetching therapies:", err); }
    };

    const fetchDoctorsForTherapy = async (therapyId) => {
        if (!therapyId) { setModalDoctors([]); return; }
        try {
            const res = await axios.get(`http://localhost:5000/auth/doctors-by-therapy/${therapyId}`);
            if (res.data.success) setModalDoctors(res.data.doctors || []);
        } catch (err) { console.error("Error fetching doctors:", err); setModalDoctors([]); }
    };

    const handleTherapyChange = (e) => {
        const therapyId = e.target.value;
        setSelectedTherapy(therapyId);
        setSelectedDoctor('');
        fetchDoctorsForTherapy(therapyId);
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        if (!selectedTherapy || !selectedDoctor || !selectedDate || !selectedSlot) {
            return alert("Please fill all fields.");
        }
        try {
            const payload = { therapy: selectedTherapy, doctor: selectedDoctor, patient: user._id, date: new Date(selectedDate).toISOString(), slot: selectedSlot };
            const res = await axios.post("http://localhost:5000/appointment/book", payload);
            if (res.data.success) {
                alert("Appointment booked successfully!");
                setIsModalOpen(false);
                setSelectedTherapy(''); setSelectedDoctor(''); setSelectedDate(''); setSelectedSlot('');
                setModalDoctors([]);
                fetchUpcomingAppointments(user._id);
            }
        } catch (err) { alert(err.response?.data?.message || "Failed to book appointment."); }
    };

    const cancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/appointment/cancel/${appointmentId}`);
                if (res.data.success) {
                    alert("Appointment cancelled successfully.");
                    const cancelledAppt = upcoming.find(a => a._id === appointmentId);
                    if (cancelledAppt) {
                        setCancelledAppointments(prev => [...prev, cancelledAppt]);
                    }
                    setUpcoming(prev => prev.filter(appt => appt._id !== appointmentId));
                }
            } catch (err) {
                alert(err.response?.data?.message || "Failed to cancel appointment.");
            }
        }
    };

    const toggleDoctorDetails = (id) => setExpandedDoctorId(expandedDoctorId === id ? null : id);
    const toggleAppointmentDetails = (id) => setExpandedAppointmentId(expandedAppointmentId === id ? null : id);
    const toggleNotificationDetails = (id) => setExpandedNotificationId(expandedNotificationId === id ? null : id);

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toDateString();
            const isCompleted = upcoming.some(a => a.completed && new Date(a.date).toDateString() === dateString);
            if (isCompleted) return 'highlight-green';
            const isUpcoming = upcoming.some(a => !a.completed && new Date(a.date).toDateString() === dateString);
            if (isUpcoming) return 'highlight-brown';
            const isCancelled = cancelledAppointments.some(a => new Date(a.date).toDateString() === dateString);
            if (isCancelled) return 'highlight-red';
        }
        return '';
    };

    const patientData = {
        progressPercent: 78,
        therapyFrequency: upcoming.filter(a => !a.completed).length,
    };
    const chartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Progress', data: [65, 70, 80, 78, 85, 82, 90],
            borderColor: 'rgba(47, 108, 102, 1)', backgroundColor: 'rgba(47, 108, 102, 0.2)',
            fill: true, tension: 0.4,
        }],
    };
    const chartOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, title: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } }
    };

    if (!user) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className='patient-page'>
            <nav className="pat-nav">
                <div className="logo-link" onClick={() => navigate('/dashboard/Patient')}>
                    <img src={logo} alt="AyurSutra" className="logo-small" />
                </div>
                <div className="tags-desktop">
                    <div onClick={() => navigate('/dashboard/Patient')} className={`nav-item ${location.pathname === '/patient-dashboard' ? 'active' : ''}`}>Dashboard</div>
                    <div onClick={() => navigate('/analytics/Patient')} className={`nav-item ${location.pathname === '/analytics/Patient' ? 'active' : ''}`}>Analytics</div>
                    <div onClick={() => navigate('/schedules/Patient')} className={`nav-item ${location.pathname === '/schedules/Patient' ? 'active' : ''}`}>Schedules</div>
                    <div onClick={() => navigate('/info/Patient')} className={`nav-item ${location.pathname === '/info/Patient' ? 'active' : ''}`}>Info</div>
                </div>
                <div className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
                    <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} />
                </div>
                {isNavOpen && (
                    <div className="tags-mobile">
                        <div onClick={() => { navigate('/patient-dashboard'); setIsNavOpen(false); }}>Dashboard</div>
                        <div onClick={() => { navigate('/analytics/Patient'); setIsNavOpen(false); }}>Analytics</div>
                        <div onClick={() => { navigate('/schedules/Patient'); setIsNavOpen(false); }}>Schedules</div>
                        <div onClick={() => { navigate('/info/Patient'); setIsNavOpen(false); }}>Info</div>
                    </div>
                )}
                <div className="prof">
                    <div className="pat-user-ico" title="Messages"><FontAwesomeIcon icon={faMessage} /></div>
                    <div className="pat-user-ico" title="Notifications"><FontAwesomeIcon icon={faBell} /></div>
                    <div className="userprof" title="Your Profile">
                        <div className="name">{user.name.split(' ')[0]}</div>
                        <div className="profpic"><FontAwesomeIcon icon={faUser} className='iconprof' /></div>
                    </div>
                    <div className="logout-container">
                        <FontAwesomeIcon icon={faSignOutAlt} className="logout-btn" title="Logout" onClick={handleLogout} />
                    </div>
                </div>
            </nav>

            <main className='main'>
                <div className="block1">
                    <div className="card dash-pat-chart">
                        <Line options={chartOptions} data={chartData} />
                    </div>
                    <div className="card prog">
                        <div className="per">
                            <span className="progress-value">{patientData.progressPercent}%</span>
                            <span className="progress-label">Overall Progress</span>
                        </div>
                        <div className="freq">
                            <span className="progress-value"><FontAwesomeIcon icon={faCalendarAlt} /> {patientData.therapyFrequency}</span>
                            <span className="progress-label">Upcoming Therapies</span>
                        </div>
                    </div>
                    <div className="card doclist">
                        <h4>Your Therapists</h4>
                        <ul>
                            {yourDoctors.length > 0 ? yourDoctors.map(doc => (
                                <li key={doc._id} className='doc-li' onClick={() => toggleDoctorDetails(doc._id)}>
                                    <div className="doc-summary">
                                        <div className="doc-avatar">{doc.name.charAt(0)}</div>
                                        <div className="doc-info">
                                            <span className="doc-name">{doc.name}</span>
                                            <span className="doc-spec">{doc.specialization}</span>
                                        </div>
                                        <div className="expand-icon">
                                            <FontAwesomeIcon icon={expandedDoctorId === doc._id ? faChevronUp : faChevronDown} />
                                        </div>
                                    </div>
                                    {expandedDoctorId === doc._id && (
                                        <div className="doc-details">
                                            <p><strong>Email:</strong> {doc.email}</p>
                                            <p><strong>Contact:</strong> {doc.contact}</p>
                                            <div className="therapies-by-doc">
                                                <strong>Therapies with this doctor:</strong>
                                                <ul>
                                                    {upcoming
                                                        .filter(appt => appt.doctor?._id === doc._id)
                                                        .map(appt => <li key={appt._id}>{appt.therapy?.name}</li>)
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            )) : <p className="no-items-msg">No therapists assigned yet.</p>}
                        </ul>
                    </div>
                </div>

                <div className="block2">
                    <div className="welcome card">
                        <h1>Welcome back,<span> {user.name.split(' ')[0]}!</span></h1>
                        <p>Your well-being is a priority. Keep up the great work.</p>
                    </div>
                    <div className="card sched">
                        <div className="sched-header">
                            <h3>Upcoming Schedules</h3>
                            <button className="book-btn" onClick={() => setIsModalOpen(true)}>
                                <FontAwesomeIcon icon={faPlus} className='pluss' />
                                Book Appointment
                            </button>
                        </div>
                        <div className="list">
                            {upcoming.filter(a => !a.completed).length > 0 ? (
                                <ul>
                                    {upcoming.filter(a => !a.completed).map(item => (
                                        <li key={item._id} className="sched-li" onClick={() => toggleAppointmentDetails(item._id)}>
                                            <div className="sched-summary">
                                                <span className='sched-time'>{new Date(item.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long' })} - {item.slot}</span>
                                                <span className='sched-doctor'>with {item.doctor?.name || "N/A"}</span>
                                                <span className={`sched-type upcoming`}>Upcoming</span>
                                                <div className="expand-icon">
                                                    <FontAwesomeIcon icon={expandedAppointmentId === item._id ? faChevronUp : faChevronDown} />
                                                </div>
                                            </div>
                                            {expandedAppointmentId === item._id && (
                                                <div className="sched-details">
                                                    <p><strong>Therapy:</strong> {item.therapy?.name || "N/A"}</p>
                                                    <p><strong>Status:</strong> Awaiting confirmation</p>
                                                    <button className="cancel-btn" onClick={(e) => { e.stopPropagation(); cancelAppointment(item._id); }}>
                                                        <FontAwesomeIcon icon={faBan} /> Cancel Appointment
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="sched-empty">
                                    <h4>You're all up to date! ✅</h4>
                                    <p>You have no pending schedules. Book a new one now!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="block3">
                    <div className="card calendar-card">
                        <Calendar tileClassName={tileClassName} />
                    </div>
                    <div className="card rec-noti">
                       <h4>Notifications & Precautions</h4>
                       {notificationTherapies.length > 0 ? (
                           <ul className="noti-list">
                               {notificationTherapies.map(therapy => {
                                   const isExpanded = expandedNotificationId === therapy._id;
                                   return (
                                    <li key={therapy._id} className="noti-item">
                                        <div className="noti-header" onClick={() => toggleNotificationDetails(therapy._id)}>
                                            <div className="noti-header-content">
                                                <FontAwesomeIcon icon={faInfoCircle} className="noti-icon" />
                                                <strong className="noti-title">{therapy.name}</strong>
                                            </div>
                                            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} className="expand-icon-noti" />
                                        </div>
                                        {isExpanded && (
                                            <div className="noti-details">
                                                <div className="precaution-section">
                                                    <strong>Pre-Precautions:</strong>
                                                    <p>{therapy.prePrecaution || "No specific guidelines."}</p>
                                                </div>
                                                <div className="precaution-section">
                                                    <strong>Post-Precautions:</strong>
                                                    <p>{therapy.postPrecaution || "No specific guidelines."}</p>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                   );
                               })}
                           </ul>
                       ) : (
                           <p className="no-items-msg">No precautions to show.</p>
                       )}
                    </div>
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h2>Book a New Appointment</h2>
                        <form onSubmit={handleBookAppointment} className="form">
                            <div className="form-group">
                                <label>Select Therapy:</label>
                                <select required value={selectedTherapy} onChange={handleTherapyChange}>
                                    <option value="">-- Select Therapy --</option>
                                    {modalTherapies.map(therapy => (
                                        <option key={therapy._id} value={therapy._id}>{therapy.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Select Practitioner:</label>
                                <select required value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} disabled={!selectedTherapy || modalDoctors.length === 0}>
                                    <option value="">-- Select Practitioner --</option>
                                    {modalDoctors.map(doc => (
                                        <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Select Date:</label>
                                <input type="date" required value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]}/>
                            </div>
                            <div className="form-group">
                                <label>Select Time Slot:</label>
                                <select required value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                                    <option value="">-- Select Time Slot --</option>
                                    <option>10:00 AM - 11:00 AM</option>
                                    <option>11:00 AM - 12:00 PM</option>
                                    <option>2:00 PM - 3:00 PM</option>
                                    <option>3:00 PM - 4:00 PM</option>
                                </select>
                            </div>
                            <button type="submit" className="submit-btn">
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;