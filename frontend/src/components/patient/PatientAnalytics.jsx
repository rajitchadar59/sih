import React,{useState} from 'react';
import { NavLink } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMessage, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './PatientAnalytics.css';

// Register Chart.js components needed for this page
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// --- Dummy Data for Analytics ---
const appointmentHistory = [
    { id: 1, date: '2025-08-22', therapy: 'Nasya', doctor: 'Dr. Dipti Sharma', status: 'Completed' },
    { id: 2, date: '2025-08-15', therapy: 'Basti', doctor: 'Dr. Lalita Patel', status: 'Completed' },
    { id: 3, date: '2025-08-05', therapy: 'Vaman', doctor: 'Dr. Imly Chaturvedi', status: 'Missed' },
    { id: 4, date: '2025-07-28', therapy: 'Vaman', doctor: 'Dr. Javed Chaurasiya', status: 'Completed' },
    { id: 5, date: '2025-07-19', therapy: 'Vaman', doctor: 'Dr. Imly Chaturvedi', status: 'Completed' },
    { id: 6, date: '2025-06-20', therapy: 'Basti', doctor: 'Dr. Priyanka Patel', status: 'Completed' }
];

    const patientData = {
        username: "omsahu1394",
        fullName: "Om Sahu",
        profilePic: null, // Set to a URL string to display an image, e.g., 'https://example.com/profile.jpg'
        progressPercent: 78,
        therapyFrequency: 12,
    };

const monthlyAppointmentsData = {
  labels: ['April', 'May', 'June', 'July', 'August'],
  datasets: [
    {
      label: 'Appointments',
      data: [2, 3, 1, 2, 3],
      backgroundColor: 'rgba(74, 144, 226, 0.6)',
      borderColor: 'rgba(74, 144, 226, 1)',
      borderWidth: 1,
    },
  ],
};

const therapyDistributionData = {
    labels: ['Vaman', 'Nasya', 'Basti'],
    datasets: [
        {
            data: [12, 3, 8],
            backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623'],
            hoverBackgroundColor: ['#357ABD', '#41C4A5', '#D48D1D'],
        },
    ],
};

const PatientAnalytics = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <div className="pat-ana">

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
    <main className="analytics-view">
        <div className="kpi-grid">
            <div className="card kpi-card">
                <h4>Total Sessions</h4>
                <p>23</p>
            </div>
            <div className="card kpi-card">
                <h4>Attendance Rate</h4>
                <p>91%</p>
            </div>
            <div className="card kpi-card">
                <h4>Upcoming</h4>
                <p>2</p>
            </div>
            <div className="card kpi-card">
                <h4>Primary Therapy</h4>
                <p>PanchKarma</p>
            </div>
        </div>
        
        <div className="chart-grid">
            <div className="card chart-wrapper">
                <h3>Monthly Appointments</h3>
                <Bar data={monthlyAppointmentsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
            <div className="card chart-wrapper">
                <h3>Therapy Distribution</h3>
                <Pie data={therapyDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        </div>

        <div className="card">
            <h3>Appointment History</h3>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Therapy</th>
                        <th>Doctor</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {appointmentHistory.map(item => (
                        <tr key={item.id}>
                            <td>{item.date}</td>
                            <td>{item.therapy}</td>
                            <td>{item.doctor}</td>
                            <td><span className={`status-badge status-${item.status.toLowerCase()}`}>{item.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </main>
    </div>
  );
};

export default PatientAnalytics;