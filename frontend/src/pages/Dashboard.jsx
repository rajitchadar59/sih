import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/"); // redirect to main page if no user
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  const renderContent = () => {
    switch (user.role) {
      case "admin":
        return <p>Welcome Admin! Manage Doctors & Patients here.</p>;
      case "doctor":
        return <p>Welcome Doctor! View your therapy schedule here.</p>;
      case "patient":
        return <p>Welcome Patient! View your upcoming therapy sessions here.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Dashboard</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <div className="mt-4 p-4 border rounded bg-gray-50">{renderContent()}</div>
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
