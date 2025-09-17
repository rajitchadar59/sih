import React from 'react'
import './MainPage.css'
import { Link, Navigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaStethoscope, FaUserInjured } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCalendar, faChartLine, faMessage } from "@fortawesome/free-solid-svg-icons";

const MainPage = () => {
  // 1. ADD THIS FUNCTION to handle the scroll
  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='MainPage'>
     <header className="header">
  <nav className="navbar">
    <a href="#home" onClick={handleSmoothScroll} className="logo-link">
      <img src={logo} alt="Small Logo" className="logo-small"  />
    </a>
    <div className="nav-links">
      <a href="#features" onClick={handleSmoothScroll}>Features</a>
      <a href="#how-it-works" onClick={handleSmoothScroll}>How It Works</a>
      <a href="#testimonials" onClick={handleSmoothScroll}>Testimonials</a>
   
    </div>
  </nav>
</header>

      <main>
        {/* Hero Section */}
        <section id="home">
          <div className='hero-cont'>
            <h1 >
              Experience Panchakarma, <span  >Reimagined.</span>
            </h1>
            <p>
              Seamlessly manage your therapy, track your wellness journey, and connect with your practitioner like never before. AyurSutra brings modern efficiency to traditional healing.
            </p>
            <div className='begin'>Begin Your Wellness Journey</div>
            <div className="options-container">
              <Link to="/login/patient" className="option-button patient">
                <FaUserInjured className="icon" />
                <span>Patient</span>
              </Link>
              <Link to="/login/doctor" className="option-button doctor">
                <FaStethoscope className="icon" />
                <span>Practitioner</span>
              </Link>
            </div>
          </div>
        </section>

        <section id='features'>
          <div className="feat-cont">
            <h2 className="section-title">The Future of Holistic Care</h2>
            <p className='section-subtitle'>AyurSutra is designed with both patients and practitioners in mind, providing tools that enhance every step of the Panchakarma process.</p>

            <div className="block-features">
              <div className="block">
                <div className="round">
                  <FontAwesomeIcon icon={faCalendar} className='icon-f' />
                </div>
                <h3>Automated Scheduling</h3>
                <p>Effortlessly book and manage therapy sessions. Receive automated reminders and pre-procedure guidelines via in-app, SMS, or email.</p>
              </div>
              <div className="block">
                <div className="round">
                  <FontAwesomeIcon icon={faChartLine} className='icon-f' />
                </div>
                <h3>Real-Time Tracking</h3>
                <p>Visualize your therapy progress with intuitive charts and milestones. See your wellness journey unfold session by session.</p>
              </div>
              <div className="block">
                <div className="round">
                  <FontAwesomeIcon icon={faMessage} className='icon-f' />
                </div>
                <h3 className="text-xl font-bold mb-2">Integrated Feedback Loop</h3>
                <p className="text-slate-500">Easily report symptoms and improvements after each session, allowing practitioners to refine your treatment plan for optimal results.</p>
              </div>
            </div>
          </div>
        </section>

        <section id='how-it-works'>
          <div className="how-cont">
            <h2 className="section-title">Get Started in 3 Simple Steps</h2>
            <p className="section-subtitle">
              Our intuitive platform makes managing your Panchakarma therapy
              straightforward and stress-free.
            </p>

            <div className="steps">
              {/* Step 1 */}
              <div className="step">
                <div className="step-number">1</div>
                <h3 className="step-title">Register & Create Profile</h3>
                <p className="step-text">
                  Sign up in minutes and complete your health profile to provide
                  your practitioner with the necessary background information.
                </p>
              </div>
              {/* Step 2 */}
              <div className="step">
                <div className="step-number">2</div>
                <h3 className="step-title">Schedule Your Therapy</h3>
                <p className="step-text">
                  Based on your practitioner's plan, view available slots and book
                  your therapy sessions at your convenience.
                </p>
              </div>

              {/* Step 3 */}
              <div className="step">
                <div className="step-number">3</div>
                <h3 className="step-title">Track & Give Feedback</h3>
                <p className="step-text">
                  Follow your progress on your personal dashboard and provide
                  valuable feedback after each session to enhance your care.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="testimonials">
          <div className="container">
            <h2 className="section-title">
              Trusted by Patients and Practitioners
            </h2>
            <p className="section-subtitle">
              Hear from those who have experienced the AyurSutra difference.
            </p>

            <div className="testimonial-grid">
              {/* Testimonial 1 */}
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "For the first time, I felt truly in control of my treatment.
                  Tracking my progress visually was incredibly motivating, and the
                  reminders meant I never missed important preparation steps.
                  AyurSutra has been a game-changer for my wellness journey."
                </p>
                <p className="testimonial-name">Priya Sharma</p>
                <p className="testimonial-role">Patient</p>
              </div>

              {/* Testimonial 2 */}
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "AyurSutra has streamlined our center's operations overnight.
                  The automated scheduling and instant access to patient feedback
                  have saved us hours of administrative work, allowing us to focus
                  on what truly matters: patient care and outcomes."
                </p>
                <p className="testimonial-name">Dr. Rajan Verma</p>
                <p className="testimonial-role">Panchakarma Practitioner</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta">
          <div className="container text-center">
            <h2 className="cta-title">
              Ready to Transform Your Panchakarma Experience?
            </h2>
            <p className="cta-subtitle">
              Whether you are a patient seeking a more empowered healing journey
              or a center looking to enhance efficiency, AyurSutra is your
              solution.
            </p>
            <a href="#home" className="cta-button" onClick={handleSmoothScroll}>
              Get Started for Free
            </a>
          </div>
        </section>

      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 AyurSutra. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainPage