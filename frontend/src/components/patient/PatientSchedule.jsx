import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active styling
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMessage, faBars, faTimes, faCalendarAlt, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import './PatientSchedule.css'

const PatientSchedule = () => {

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false); // For booking modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // For feedback modal
  const [selectedSchedule, setSelectedSchedule] = useState(null); // To know which schedule to give feedback for
  const [rating, setRating] = useState(0); // State for star rating

  const patientData = {
    username: "omsahu1394",
    fullName: "Om Sahu",
    profilePic: null, // Set to a URL string to display an image, e.g., 'https://example.com/profile.jpg'
  };

  // Example schedule data.
  const schedules = [
    { id: 1, doctor: "Dr. Anjali Sharma", time: "Tomorrow, 10:00 AM", type: "Upcoming" },
    { id: 2, doctor: "Dr. Rohan Mehta", time: "Sept 20, 4:30 PM", type: "Upcoming" },
    { id: 3, doctor: "Dr. Sohan Mehta", time: "Sept 15, 11:00 AM", type: "Completed" },
    { id: 4, doctor: "Dr. Anjali Sharma", time: "Sept 12, 2:00 PM", type: "Completed" },
    { id: 5, doctor: "Dr. Rohan Mehta", time: "Sept 10, 4:30 PM", type: "Cancelled" },
  ];

  const handleFeedbackClick = (scheduleItem) => {
    setSelectedSchedule(scheduleItem);
    setIsFeedbackOpen(true);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Feedback Submitted for:", selectedSchedule);
    console.log("Rating:", rating);
    // You can get other form values similarly using e.target.elements
    alert("Thank you for your feedback!");
    setIsFeedbackOpen(false);
    setRating(0); // Reset rating
  };

  return (
    <div className='pat-sched-page'>
      <nav className="pat-nav">
        <NavLink to="/dashboard/Patient" className="logo-link">
          <img src={logo} alt="AyurSutra" className="logo-small" />
        </NavLink>

        <div className="tags-desktop">
          <NavLink to='/dashboard/Patient' className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to='/analytics/Patient' className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
          <NavLink to='/schedules/Patient' className={({ isActive }) => isActive ? 'active' : ''}>Schedules</NavLink>
          <NavLink to='/info/Patient' className={({ isActive }) => isActive ? 'active' : ''}>Info</NavLink>
        </div>

        {/* --- Mobile Navigation Toggle --- */}
        <div className="menu-toggle" onClick={() => setIsNavOpen(!isNavOpen)}>
          <FontAwesomeIcon icon={isNavOpen ? faTimes : faBars} />
        </div>

        {/* --- Mobile Navigation Dropdown --- */}
        {isNavOpen && (
          <div className="tags-mobile">
            <NavLink to='/dashboard/Patient' onClick={() => setIsNavOpen(false)}>Dashboard</NavLink>
            <NavLink to='/analytics/Patient' onClick={() => setIsNavOpen(false)}>Analytics</NavLink>
            <NavLink to='/schedules/Patient' onClick={() => setIsNavOpen(false)}>Schedules</NavLink>
            <NavLink to='/info/Patient' onClick={() => setIsNavOpen(false)}>Info</NavLink>
          </div>
        )}

        <div className="prof">
          <div className="pat-user-ico" title="Messages">
            <FontAwesomeIcon icon={faMessage} />
          </div>
          <div className="pat-user-ico" title="Notifications">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="userprof" title="Your Profile">
            <div className="name">{patientData.username}</div>
            <div className="profpic">
              {patientData.profilePic ? (
                <img src={patientData.profilePic} alt="Profile" />
              ) : (
                <FontAwesomeIcon icon={faUser} className='iconprof' />
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className='schedule-pat-main'>
        <div className="card sched">
          <div className="sched-header">
            <h3>Your Schedules</h3>
            <button className="book-btn" onClick={() => setIsBookingOpen(true)}>
              <FontAwesomeIcon icon={faPlus} className='pluss' />
              Book Appointment
            </button>
          </div>
          <div className="list">
            {schedules.length > 0 ? (
              <ul>
                {schedules.map(item => (
                  <li key={item.id} className={`sched-item-li ${item.type.toLowerCase()}`}>
                    <div className='sched-info'>
                      <span className='sched-time'>{item.time}</span>
                      <span className='sched-doctor'>with {item.doctor}</span>
                      <span className={`sched-type ${item.type.toLowerCase()}`}>{item.type}</span>
                    </div>
                    <div className='sched-actions'>
                      {item.type === 'Upcoming' && (
                        <button className="cancel-btn" onClick={() => alert(`Appointment with ${item.doctor} cancelled.`)}>
                          Cancel
                        </button>
                      )}
                      {item.type === 'Completed' && (
                        <button className="feedback-btn" onClick={() => handleFeedbackClick(item)}>
                          Feedback
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="sched-empty">
                <h4>No schedules found.</h4>
                <p>Book your first therapy session now to get started.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ====== Appointment Booking Modal ====== */}
      {isBookingOpen && (
        <div className="modal-overlay" onClick={() => setIsBookingOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setIsBookingOpen(false)}>&times;</span>
            <h2>Appointment Booking Form</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert("Appointment Booked!"); setIsBookingOpen(false); }} className="form">
              {/* Form content from PatientDashboard */}
              <div className="form-group"><label>Select Therapy:</label><select required><option value="">-- Select Therapy --</option><option value="vaman">Vaman</option><option value="virechna">Virechna</option></select></div>
              <div className="form-group"><label>Select Practitioner:</label><select required><option value="">-- Select Practitioner --</option><option value="dr1">Dr. Sharma</option><option value="dr2">Dr. Gupta</option></select></div>
              <div className="form-group"><label>Select Date:</label><input type="date" required /></div>
              <div className="form-group"><label>Select Time Slot:</label><select required><option value="">-- Select Time Slot --</option><option value="9-10">09:00 AM - 10:00 AM</option><option value="10-11">10:00 AM - 11:00 AM</option></select></div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* ====== Feedback Modal ====== */}
      {isFeedbackOpen && selectedSchedule && (
        <div className="modal-overlay" onClick={() => setIsFeedbackOpen(false)}>
          <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={() => setIsFeedbackOpen(false)}>&times;</span>
            <h2>Feedback for your session with {selectedSchedule.doctor}</h2>
            <p>on {selectedSchedule.time}</p>
            <form onSubmit={handleFeedbackSubmit} className="form">

              {/* 1. Star Rating */}
              <div className="form-group">
                <label>1. How would you rate your session?</label>
                <div className="star-rating">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FontAwesomeIcon
                        key={ratingValue}
                        icon={faStar}
                        className={ratingValue <= rating ? 'star-filled' : 'star-empty'}
                        onClick={() => setRating(ratingValue)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* 2. Digestion Improved */}
              <div className="form-group">
                <label>2. Is your digestion improved?</label>
                <div className='radio-group'>
                  <label><input type="radio" name="digestion" value="yes" /> Yes</label>
                  <label><input type="radio" name="digestion" value="no" /> No</label>
                </div>
              </div>

              {/* 3. Sleep Cycle Improved */}
              <div className="form-group">
                <label>3. Is your sleep cycle improved?</label>
                <div className='radio-group'>
                  <label><input type="radio" name="sleep" value="yes" /> Yes</label>
                  <label><input type="radio" name="sleep" value="no" /> No</label>
                </div>
              </div>

              {/* 4. Stress Reduced */}
              <div className="form-group">
                <label>4. Is your stress reduced?</label>
                <div className='radio-group'>
                  <label><input type="radio" name="stress" value="yes" /> Yes</label>
                  <label><input type="radio" name="stress" value="no" /> No</label>
                </div>
              </div>

              {/* 5. Post-therapy Symptoms */}
              <div className="form-group">
                <label htmlFor="symptoms">5. Any post-therapy symptoms? (e.g., headache, fatigue)</label>
                <textarea id="symptoms" name="symptoms" rows="3" placeholder='Let us know...'></textarea>
              </div>

              {/* 6. Feedback */}
              <div className="form-group">
                <label htmlFor="feedback">6. Any other feedback?</label>
                <textarea id="feedback" name="feedback" rows="3" placeholder='Your overall experience...'></textarea>
              </div>

              <button type="submit" className="submit-btn">Submit Feedback</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientSchedule