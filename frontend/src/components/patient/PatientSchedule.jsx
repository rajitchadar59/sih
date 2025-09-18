import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// --- UI Imports ---
import './PatientSchedule.css';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMessage, faBars, faTimes, faPlus, faStar, faSignOutAlt, faBan } from "@fortawesome/free-solid-svg-icons";

const PatientSchedule = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // --- STATE MANAGEMENT ---
    const [user, setUser] = useState(null);
    const [allSchedules, setAllSchedules] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI State
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Booking Modal State
    const [modalTherapies, setModalTherapies] = useState([]);
    const [modalDoctors, setModalDoctors] = useState([]);
    const [bookingForm, setBookingForm] = useState({ therapy: '', doctor: '', date: '', slot: '' });

    // --- UPDATED: Feedback Modal State with all fields ---
    const initialFeedbackState = { rating: 0, digestion: '', sleep: '', stress: '', symptoms: '', feedback: '' };
    const [feedbackForm, setFeedbackForm] = useState(initialFeedbackState);

    // --- AUTHENTICATION & DATA FETCHING ---
    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            if (!storedUser || storedUser.role !== "patient") {
                navigate("/login/patient");
                return;
            }
            setUser(storedUser);
            fetchSchedules(storedUser._id);
            fetchTherapiesForModal();
        } catch (e) {
            console.error("Error authenticating user:", e);
            navigate("/login/patient");
        }
    }, [navigate]);
    
    useEffect(() => {
        const fetchDoctorsForTherapy = async (therapyId) => {
            if (!therapyId) {
                setModalDoctors([]);
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/auth/doctors-by-therapy/${therapyId}`);
                setModalDoctors(res.data.doctors || []);
            } catch (err) {
                console.error("Error fetching doctors:", err.response || err);
                setModalDoctors([]);
            }
        };
        if (bookingForm.therapy) {
            fetchDoctorsForTherapy(bookingForm.therapy);
        }
    }, [bookingForm.therapy]);

    const fetchSchedules = async (patientId) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await axios.get(`http://localhost:5000/appointment/patient/${patientId}`);
            setAllSchedules(res.data.appointments || []);
        } catch (err) {
            console.error("Error fetching schedules:", err.response || err);
            setError("Could not load your schedules. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTherapiesForModal = async () => {
        try {
            const res = await axios.get("http://localhost:5000/therapy/all");
            setModalTherapies(res.data.therapies || []);
        } catch (err) {
            console.error("Error fetching therapies:", err.response || err);
        }
    };

    const { upcomingSchedules, completedSchedules, cancelledSchedules } = useMemo(() => {
        const upcoming = [], completed = [], cancelled = [];
        if (Array.isArray(allSchedules)) {
            allSchedules.forEach(appt => {
                if (!appt || !appt.date) return;
                if (appt.cancelled) cancelled.push(appt);
                else if (appt.completed || new Date(appt.date) < new Date()) completed.push(appt);
                else upcoming.push(appt);
            });
        }
        const sortByDate = (a, b) => new Date(b.date) - new Date(a.date);
        return {
            upcomingSchedules: upcoming.sort(sortByDate),
            completedSchedules: completed.sort(sortByDate),
            cancelledSchedules: cancelled.sort(sortByDate)
        };
    }, [allSchedules]);

    // --- EVENT HANDLERS ---
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login/patient");
    };

    const handleBookingFormChange = (e) => {
        const { name, value } = e.target;
        if (name === "therapy") {
            setBookingForm(prev => ({ ...prev, therapy: value, doctor: '' }));
        } else {
            setBookingForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- NEW: Handler for the detailed feedback form ---
    const handleFeedbackFormChange = (e) => {
        const { name, value } = e.target;
        setFeedbackForm(prev => ({ ...prev, [name]: value }));
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        const { therapy, doctor, date, slot } = bookingForm;
        if (!therapy || !doctor || !date || !slot) return alert("Please fill all fields.");
        try {
            await axios.post("http://localhost:5000/appointment/book", { ...bookingForm, patient: user._id });
            alert("Appointment booked successfully!");
            setIsBookingOpen(false);
            setBookingForm({ therapy: '', doctor: '', date: '', slot: '' });
            fetchSchedules(user._id);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to book appointment.");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`http://localhost:5000/appointment/cancel/${appointmentId}`);
            alert("Appointment cancelled successfully.");
            setAllSchedules(prev => prev.map(appt => 
                appt._id === appointmentId ? { ...appt, cancelled: true } : appt
            ));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel appointment.");
        }
    };
    
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        const feedbackPayload = { ...feedbackForm, appointmentId: selectedSchedule._id };
        console.log("Submitting feedback:", feedbackPayload);
        // NOTE: When your backend is ready, you'll replace the console.log with this:
        // await axios.post("http://localhost:5000/feedback/submit", feedbackPayload);
        alert("Thank you for your feedback!");
        setIsFeedbackOpen(false);
        setFeedbackForm(initialFeedbackState); // Reset the form
    };

    if (!user) {
        return <div className="loading-container">Authenticating...</div>;
    }

    return (
        <div className='pat-sched-page'>
            <nav className="pat-nav">
                {/* ... navigation JSX is unchanged ... */}
                 <div className="logo-link" onClick={() => navigate('/dashboard/Patient')}><img src={logo} alt="AyurSutra" className="logo-small" /></div>
                <div className="tags-desktop">
                    <div onClick={() => navigate('/dashboard/Patient')} className={`nav-item ${location.pathname.includes('dashboard') ? 'active' : ''}`}>Dashboard</div>
                    <div onClick={() => navigate('/analytics/Patient')} className={`nav-item ${location.pathname.includes('analytics') ? 'active' : ''}`}>Analytics</div>
                    <div onClick={() => navigate('/schedules/Patient')} className={`nav-item ${location.pathname.includes('schedules') ? 'active' : ''}`}>Schedules</div>
                    <div onClick={() => navigate('/info/Patient')} className={`nav-item ${location.pathname.includes('info') ? 'active' : ''}`}>Info</div>
                </div>
                <div className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}><FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} /></div>
                {isNavOpen && (
                    <div className="tags-mobile">
                         <div onClick={() => { navigate('/dashboard/Patient'); setIsNavOpen(false); }}>Dashboard</div>
                         <div onClick={() => { navigate('/analytics/Patient'); setIsNavOpen(false); }}>Analytics</div>
                         <div onClick={() => { navigate('/schedules/Patient'); setIsNavOpen(false); }}>Schedules</div>
                         <div onClick={() => { navigate('/info/Patient'); setIsNavOpen(false); }}>Info</div>
                    </div>
                )}
                <div className="prof">
                    <div className="pat-user-ico" title="Messages"><FontAwesomeIcon icon={faMessage} /></div>
                    <div className="pat-user-ico" title="Notifications"><FontAwesomeIcon icon={faBell} /></div>
                    <div className="userprof" title="Your Profile">
                        <div className="name">{user?.name?.split(' ')[0] || 'User'}</div>
                        <div className="profpic"><FontAwesomeIcon icon={faUser} className='iconprof' /></div>
                    </div>
                    <div className="logout-container"><FontAwesomeIcon icon={faSignOutAlt} className="logout-btn" title="Logout" onClick={handleLogout} /></div>
                </div>
            </nav>

            <main className='schedule-pat-main'>
                {/* ... main schedule sections JSX is unchanged ... */}
                <div className="card sched">
                    <div className="sched-header">
                        <h3>Your Schedules</h3>
                        <button className="book-btn" onClick={() => setIsBookingOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} className='pluss' /> Book Appointment
                        </button>
                    </div>
                    
                    {error && <div className="error-message">{error}</div>}

                    <div className="schedule-section">
                        <h4>Upcoming</h4>
                        <div className="list">
                            {isLoading ? <p>Loading...</p> : upcomingSchedules.length > 0 ? (
                                <ul>{upcomingSchedules.map(item => (
                                    <li key={item._id} className="sched-item-li upcoming">
                                        <div className='sched-info'>
                                            <span className='sched-time'>{new Date(item.date).toLocaleDateString("en-IN")} - {item.slot}</span>
                                            <span className='sched-doctor'>with {item.doctor?.name || 'N/A'}</span>
                                            <span className='sched-type upcoming'>Upcoming</span>
                                        </div>
                                        <div className='sched-actions'>
                                            <button className="cancel-btn" onClick={() => cancelAppointment(item._id)}>Cancel</button>
                                        </div>
                                    </li>
                                ))}</ul>
                            ) : <p className="empty-msg">No upcoming appointments.</p>}
                        </div>
                    </div>
                    
                    <div className="schedule-section">
                        <h4>Completed</h4>
                        <div className="list">
                            {isLoading ? <p>Loading...</p> : completedSchedules.length > 0 ? (
                                <ul>{completedSchedules.map(item => (
                                    <li key={item._id} className="sched-item-li completed">
                                        <div className='sched-info'>
                                            <span className='sched-time'>{new Date(item.date).toLocaleDateString("en-IN")} - {item.slot}</span>
                                            <span className='sched-doctor'>with {item.doctor?.name || 'N/A'}</span>
                                            <span className='sched-type completed'>Completed</span>
                                        </div>
                                        <div className='sched-actions'>
                                            <button className="feedback-btn" onClick={() => { setSelectedSchedule(item); setIsFeedbackOpen(true); }}>Feedback</button>
                                        </div>
                                    </li>
                                ))}</ul>
                            ) : <p className="empty-msg">No completed appointments yet.</p>}
                        </div>
                    </div>

                    <div className="schedule-section">
                        <h4>Cancelled</h4>
                        <div className="list">
                           {isLoading ? <p>Loading...</p> : cancelledSchedules.length > 0 ? (
                                <ul>{cancelledSchedules.map(item => (
                                    <li key={item._id} className="sched-item-li cancelled">
                                        <div className='sched-info'>
                                            <span className='sched-time'>{new Date(item.date).toLocaleDateString("en-IN")} - {item.slot}</span>
                                            <span className='sched-doctor'>with {item.doctor?.name || 'N/A'}</span>
                                            <span className='sched-type cancelled'>Cancelled</span>
                                        </div>
                                    </li>
                                ))}</ul>
                            ) : <p className="empty-msg">No cancelled appointments.</p>}
                        </div>
                    </div>
                </div>
            </main>
            
            {isBookingOpen && (
                <div className="modal-overlay" onClick={() => setIsBookingOpen(false)}>
                    {/* ... booking modal JSX is unchanged ... */}
                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setIsBookingOpen(false)}>&times;</span>
                        <h2>Book a New Appointment</h2>
                        <form onSubmit={handleBookAppointment} className="form">
                            <div className="form-group">
                                <label>Select Therapy:</label>
                                <select required name="therapy" value={bookingForm.therapy} onChange={handleBookingFormChange}>
                                    <option value="">-- Select Therapy --</option>
                                    {modalTherapies.map(therapy => (
                                        <option key={therapy._id} value={therapy._id}>{therapy.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Select Practitioner:</label>
                                <select required name="doctor" value={bookingForm.doctor} onChange={handleBookingFormChange} disabled={!bookingForm.therapy || modalDoctors.length === 0}>
                                    <option value="">-- Select Practitioner --</option>
                                    {modalDoctors.map(doc => (
                                        <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialization})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Select Date:</label>
                                <input type="date" required name="date" value={bookingForm.date} onChange={handleBookingFormChange} min={new Date().toISOString().split("T")[0]}/>
                            </div>
                            <div className="form-group">
                                <label>Select Time Slot:</label>
                                <select required name="slot" value={bookingForm.slot} onChange={handleBookingFormChange}>
                                    <option value="">-- Select Time Slot --</option>
                                    <option>10:00 AM - 11:00 AM</option>
                                    <option>11:00 AM - 12:00 PM</option>
                                    <option>2:00 PM - 3:00 PM</option>
                                    <option>3:00 PM - 4:00 PM</option>
                                </select>
                            </div>
                            <button type="submit" className="submit-btn">Confirm Booking</button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- NEW: Feedback Modal with Full Form --- */}
            {isFeedbackOpen && selectedSchedule && (
                <div className="modal-overlay" onClick={() => setIsFeedbackOpen(false)}>
                    <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={() => setIsFeedbackOpen(false)}>&times;</span>
                        <h2>Feedback for your session with {selectedSchedule.doctor?.name}</h2>
                        <p>on {new Date(selectedSchedule.date).toLocaleDateString("en-IN")}</p>
                        <form onSubmit={handleFeedbackSubmit} className="form">
                            <div className="form-group">
                                <label>1. How would you rate your session?</label>
                                <div className="star-rating">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return ( <FontAwesomeIcon key={ratingValue} icon={faStar}
                                            className={ratingValue <= feedbackForm.rating ? 'star-filled' : 'star-empty'}
                                            onClick={() => setFeedbackForm(prev => ({ ...prev, rating: ratingValue }))}
                                        /> );
                                    })}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>2. Is your digestion improved?</label>
                                <div className='radio-group'>
                                    <label><input type="radio" name="digestion" value="yes" checked={feedbackForm.digestion === 'yes'} onChange={handleFeedbackFormChange} /> Yes</label>
                                    <label><input type="radio" name="digestion" value="no" checked={feedbackForm.digestion === 'no'} onChange={handleFeedbackFormChange} /> No</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>3. Is your sleep cycle improved?</label>
                                <div className='radio-group'>
                                    <label><input type="radio" name="sleep" value="yes" checked={feedbackForm.sleep === 'yes'} onChange={handleFeedbackFormChange} /> Yes</label>
                                    <label><input type="radio" name="sleep" value="no" checked={feedbackForm.sleep === 'no'} onChange={handleFeedbackFormChange} /> No</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>4. Is your stress reduced?</label>
                                <div className='radio-group'>
                                    <label><input type="radio" name="stress" value="yes" checked={feedbackForm.stress === 'yes'} onChange={handleFeedbackFormChange} /> Yes</label>
                                    <label><input type="radio" name="stress" value="no" checked={feedbackForm.stress === 'no'} onChange={handleFeedbackFormChange} /> No</label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="symptoms">5. Any post-therapy symptoms?</label>
                                <textarea id="symptoms" name="symptoms" rows="3" value={feedbackForm.symptoms} onChange={handleFeedbackFormChange} placeholder='e.g., headache, fatigue'></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="feedback">6. Any other feedback?</label>
                                <textarea id="feedback" name="feedback" rows="3" value={feedbackForm.feedback} onChange={handleFeedbackFormChange} placeholder='Your overall experience...'></textarea>
                            </div>
                            <button type="submit" className="submit-btn">Submit Feedback</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientSchedule;