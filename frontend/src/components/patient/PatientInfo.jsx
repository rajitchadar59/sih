import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMessage, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
// This is our main component
const PatientInfo = () => {
  // --- Data Store ---
  // Moved the therapy details object directly into the component.
  const [isNavOpen, setIsNavOpen] = useState(false);
  const patientData = {
    username: "omsahu1394",
    fullName: "Om Sahu",
    profilePic: null, // Set to a URL string to display an image, e.g., 'https://example.com/profile.jpg'
    progressPercent: 78,
    therapyFrequency: 12,
  };
  const therapyDetails = {
    vamana: {
      title: "A Guide to Vamana",
      icon: "https://img.icons8.com/plasticine/100/lungs.png",
      alt: "Lungs Icon",
      description: "A therapeutic process to eliminate excess Kapha dosha, clearing congestion from the respiratory and digestive tract.",
      info: {
        target: "Kapha Dosha",
        bestFor: "Asthma, Psoriasis, Allergies",
        duration: "8-10 Days"
      },
      journey: `
                <h3>Phase 1: Preparation (Purvakarma)</h3>
                <p>Your journey begins with a 5 to 7-day preparatory phase. You will drink a prescribed medicated ghee each morning and receive relaxing daily massages and herbal steam therapies. This essential first step lubricates the body and gently loosens deep-seated toxins.</p>
                <h3>Phase 2: The Procedure</h3>
                <p>On the therapy day, under the close supervision of our physician, a specific herbal decoction is given to induce therapeutic emesis. This process painlessly and effectively expels the mobilized toxins and excess Kapha dosha from your body.</p>
                <h3>Phase 3: Recovery (Samsarjana Krama)</h3>
                <p>After the cleanse, your digestive fire is like a delicate ember. This crucial phase involves a carefully managed diet that slowly progresses from light broths to solid foods, rekindling your digestive strength and ensuring lasting results.</p>
            `
    },
    virechana: {
      title: "Understanding Virechana",
      icon: "https://img.icons8.com/plasticine/100/stomach.png",
      alt: "Stomach Icon",
      description: "A controlled purgation therapy that cleanses the body of excess Pitta dosha, purifying the blood and liver.",
      info: {
        target: "Pitta Dosha",
        bestFor: "Skin Inflammation, Liver Detox",
        duration: "10-12 Days"
      },
      journey: `
                <h3>Phase 1: Preparation (Purvakarma)</h3>
                <p>To begin, you will enter a 7 to 10-day preparatory phase. This involves drinking a prescribed medicated ghee and receiving daily therapeutic massages with herbal steam. This vital process mobilizes deep-seated, Pitta-related toxins and brings them to the digestive tract for elimination.</p>
                <h3>Phase 2: The Procedure</h3>
                <p>On the designated day, a gentle herbal purgative is administered. This induces a series of controlled bowel movements that efficiently flush toxins from the liver, gallbladder, and intestines, thereby purifying the blood and cooling the entire system.</p>
                <h3>Phase 3: Recovery (Samsarjana Krama)</h3>
                <p>Following the purification, a specific dietary regimen is followed to nourish the newly cleansed system. This restorative phase rebuilds your digestive fire (Agni), enhances metabolism, and helps you integrate the full benefits of the therapy.</p>
            `
    },
    basti: {
      title: "The Art of Basti",
      icon: "https://img.icons8.com/plasticine/100/lotus.png",
      alt: "Lotus Icon",
      description: "A deeply nourishing and healing therapy using medicated enemas to balance Vata dosha and calm the nervous system.",
      info: {
        target: "Vata Dosha",
        bestFor: "Joint Pain, Anxiety, Constipation",
        duration: "Course of 8-30 Days"
      },
      journey: `
                <h3>Phase 1: Understanding Basti</h3>
                <p>Often called the 'mother of all treatments,' Basti is a profoundly healing therapy. It involves the gentle introduction of medicated oils or herbal decoctions into the colon, which serves as a powerful pathway to nourish the entire body, especially the nervous system and bones.</p>
                <h3>Phase 2: The Therapeutic Course</h3>
                <p>Basti is administered as a course of treatments, typically alternating between nourishing oil-based enemas and cleansing decoction-based enemas. Each session is painless, deeply relaxing, and works to ground the body and mind by calming Vata dosha.</p>
                <h3>Phase 3: Supporting Lifestyle</h3>
                <p>Throughout your Basti course, you will follow a Vata-pacifying diet rich in warm, moist, and grounding foods. This holistic approach enhances the therapy's effects, leading to profound relief from chronic conditions and a restored sense of well-being.</p>
            `
    },
    nasya: {
      title: "The Clarity of Nasya",
      icon: "https://img.icons8.com/plasticine/100/brain.png",
      alt: "Brain Icon",
      description: "Administration of herbal oils through the nasal passage to cleanse and rejuvenate the head, neck and senses.",
      info: {
        target: "Doshas of the Head",
        bestFor: "Sinusitis, Migraines, Insomnia",
        duration: "Course of 7-14 Days"
      },
      journey: `
                <h3>Phase 1: Preparation</h3>
                <p>Each Nasya session begins with a soothing massage of the face, head, and neck, followed by a gentle steam application. This relaxing preparation helps to open up the micro-channels of the head and enhances the absorption of the herbal medicine.</p>
                <h3>Phase 2: The Administration</h3>
                <p>You will lie down comfortably as a few drops of prescribed herbal oil are gently administered into each nostril. In Ayurveda, the nose is considered the direct gateway to the mind. This process cleanses, lubricates, and rejuvenates the entire head region.</p>
                <h3>Phase 3: Integration & Benefits</h3>
                <p>Following a course of Nasya, clients often experience clearer breathing, sharper senses, reduced mental fog, and better sleep. Simple dietary precautions during the course help to support and prolong the therapy's clarifying effects.</p>
            `
    },
    raktamokshana: {
      title: "Purification via Raktamokshana",
      icon: "https://img.icons8.com/plasticine/100/drop-of-blood.png",
      alt: "Blood Drop Icon",
      description: "A precise blood purification therapy to treat skin disorders and inflammatory conditions caused by toxins in the blood.",
      info: {
        target: "Vitiated Blood (Rakta)",
        bestFor: "Eczema, Gout, Abscesses",
        duration: "Single Session + Recovery"
      },
      journey: `
                <h3>Phase 1: Expert Consultation</h3>
                <p>Raktamokshana is a highly specialized and precise therapy. The process begins with an in-depth consultation with our physician to determine if it is the most suitable treatment for your specific, often stubborn, blood-borne conditions.</p>
                <h3>Phase 2: The Procedure</h3>
                <p>Performed by our expert doctor in a completely sterile environment, this therapy involves removing a small, controlled amount of blood. This is done using precise techniques to eliminate deep-seated toxins that circulate in the bloodstream, providing relief where other treatments may not.</p>
                <h3>Phase 3: Recovery and Diet</h3>
                <p>Post-procedure care is focused on healing and preventing re-toxification. This involves following a strict, cooling (Pitta-pacifying) diet. This final step is crucial for supporting the body's healing process and leads to remarkable relief from chronic inflammatory and skin conditions.</p>
            `
    }
  };

  // --- State Management ---
  // 'modalTherapyKey' stores which therapy is selected (e.g., 'vamana'). null means no modal.
  const [modalTherapyKey, setModalTherapyKey] = useState(null);

  const selectedTherapy = modalTherapyKey ? therapyDetails[modalTherapyKey] : null;

  // --- Event Handlers ---
  const handleOpenModal = (therapyKey) => {
    setModalTherapyKey(therapyKey);
  };

  const handleCloseModal = () => {
    setModalTherapyKey(null);
  };

  // --- Effect for Keyboard (Escape key) ---
  // This effect adds an event listener when the modal opens and removes it when it closes.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    if (modalTherapyKey) {
      window.addEventListener("keydown", handleKeyDown);
    }

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalTherapyKey]); // Re-run effect only when modalTherapyKey changes


  return (
    <>
      {/* The CSS from your original file is placed in a <style> tag.
                For larger apps, this would go in a separate .css file. */}
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
                    :root {
                        --primary-green: #3A6B35;
                        --secondary-green: #609966;
                        --light-beige: #F7F5F2;
                        --dark-text: #333333;
                        --light-text: #FFFFFF;
                        --shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    }
                    .panchakarma-page-body {
                        font-family: 'Zain', sans-serif;
                        margin: 0;
                        background-color: var(--light-beige);
                        color: var(--dark-text);
                        line-height: 1.6;
                    }
                    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
                    .hero { text-align: center; padding: 4rem 2rem; background-color: white; border-bottom: 1px solid #e0e0e0; }
                    .hero h1 { font-size: 3rem; color: var(--primary-green); margin-bottom: 1rem; }
                    .hero p { font-size: 1.1rem; max-width: 700px; margin: 0 auto; color: #666; }
                    .therapies-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
                    .therapy-card { background-color: white; border-radius: 15px; box-shadow: var(--shadow); text-align: center; padding: 2rem; transition: transform 0.3s ease, box-shadow 0.3s ease; }
                    .therapy-card:hover { transform: translateY(-10px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
                    .therapy-card img { width: 80px; height: 80px; margin-bottom: 1rem; }
                    .therapy-card h3 { font-size: 1.5rem; color: var(--primary-green); margin-bottom: 0.5rem; text-transform: capitalize; }
                    .therapy-card p { font-size: 0.95rem; color: #555; margin-bottom: 1.5rem; }
                    .details-btn { background-color: var(--primary-green); color: var(--light-text); border: none; padding: 0.75rem 1.5rem; border-radius: 50px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; }
                    .details-btn:hover { background-color: var(--secondary-green); }
                    .modal { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.6); align-items: center; justify-content: center; opacity: 0; transition: opacity 0.4s ease-in-out; }
                    .modal.active { display: flex; opacity: 1; }
                    .modal-content { background-color: #fefefe; margin: auto; padding: 3rem; border-radius: 15px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; position: relative; transform: scale(0.9); transition: transform 0.4s ease-in-out; }
                    .modal.active .modal-content { transform: scale(1); }
                    .close-button { color: #aaa; position: absolute; top: 1rem; right: 1.5rem; font-size: 2rem; font-weight: bold; cursor: pointer; transition: color 0.3s; }
                    .close-button:hover, .close-button:focus { color: var(--dark-text); }
                    .modal-content h2 { color: var(--primary-green); font-size: 2.2rem; margin-top: 0; }
                    .modal-quick-info { background-color: var(--light-beige); padding: 1rem 1.5rem; border-radius: 10px; margin: 2rem 0; display: flex; justify-content: space-around; flex-wrap: wrap; gap: 1rem; }
                    .modal-quick-info div { text-align: center; }
                    .modal-quick-info strong { display: block; color: var(--primary-green); font-size: 1rem; margin-bottom: 0.25rem; }
                    .modal-content h3 { color: var(--secondary-green); border-left: 4px solid var(--primary-green); padding-left: 1rem; margin-top: 2rem; }
                    .modal-content p { color: #444; }
                `}
      </style>

      <div className="panchakarma-page-body">
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
        <main>
          <section className="hero">
            <h1>The Panchakarma Therapies</h1>
            <p>Discover the ancient Ayurvedic art of detoxification and rejuvenation. Each therapy is a unique journey towards restoring your body's natural balance and vitality.</p>
          </section>

          <section className="container">
            <div className="therapies-grid">
              {/* Dynamically create a card for each therapy */}
              {Object.entries(therapyDetails).map(([key, therapy]) => (
                <div className="therapy-card" key={key}>
                  <img src={therapy.icon} alt={therapy.alt} />
                  <h3>{key}</h3>
                  <p>{therapy.description}</p>
                  <button className="details-btn" onClick={() => handleOpenModal(key)}>
                    Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* The Modal: Renders only if a therapy is selected */}
        {selectedTherapy && (
          <div
            className={`modal ${selectedTherapy ? 'active' : ''}`}
            onClick={handleCloseModal} // Click on backdrop closes modal
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()} // Prevents click inside modal from closing it
            >
              <span className="close-button" onClick={handleCloseModal}>&times;</span>

              <h2>{selectedTherapy.title}</h2>
              <div className="modal-quick-info">
                <div>
                  <strong>Primary Target</strong>
                  <span>{selectedTherapy.info.target}</span>
                </div>
                <div>
                  <strong>Best For</strong>
                  <span>{selectedTherapy.info.bestFor}</span>
                </div>
                <div>
                  <strong>Duration</strong>
                  <span>{selectedTherapy.info.duration}</span>
                </div>
              </div>

              {/* Safely render the HTML string for the journey details */}
              <div dangerouslySetInnerHTML={{ __html: selectedTherapy.journey }} />

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PatientInfo;