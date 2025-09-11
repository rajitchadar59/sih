import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // If no user, redirect to login
      navigate("/login/patient");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-blue-600 text-white px-6 py-4">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Welcome, {user.name || "Patient"} 👋
        </h2>

        <div className="bg-white shadow rounded p-6">
          <h3 className="text-lg font-bold mb-2">Your Details</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        {/* Placeholder for future sections */}
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Upcoming Features</h3>
          <ul className="list-disc list-inside">
            <li>Book Doctor Appointments</li>
            <li>View Appointment History</li>
            <li>Therapy Progress Tracking</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;
