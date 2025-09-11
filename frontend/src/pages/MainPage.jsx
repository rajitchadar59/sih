import React from 'react';
import './MainPage.css';
import { FaStethoscope, FaUserInjured } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"; 

import logo from '../assets/logo.png'; 

const MainPage = () => {
  const navigate = useNavigate();   

  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={logo} alt="Small Logo" className="logo-small" />
      </header>

      <main className="landing-main">
        <img src={logo} alt="Main Logo" className="logo-main" />
        <h1>Welcome to Ayursutra</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        <div className="options-container">
          <button
            onClick={() => navigate("/login/patient")}
            className="option-button patient"
          >
            <FaUserInjured className="icon" /> Patient
          </button>

          <button
            onClick={() => navigate("/login/doctor")}
            className="option-button doctor"
          >
            <FaStethoscope className="icon" /> Doctor
          </button>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
