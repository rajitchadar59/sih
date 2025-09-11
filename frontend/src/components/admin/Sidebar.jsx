import React from "react";
import "./Sidebar.css";

const Sidebar = ({ setActiveTab, activeTab }) => {
  const tabs = ["Doctors", "Therapies"];

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={activeTab === tab ? "active" : ""}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
