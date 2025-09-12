// Notification.jsx
import React, { useEffect, useState } from "react";

const Notification = ({ appointment }) => {
  const [showPre, setShowPre] = useState(false);
  const [showPost, setShowPost] = useState(false);

  useEffect(() => {
    if (!appointment || !appointment.therapy || !appointment.date) return;

    const therapy = appointment.therapy;
    const appointmentDate = new Date(appointment.date);
    const today = new Date();

    // Difference in days (integer)
    const diffTime = appointmentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Show pre-precaution if appointment is in future or today (1 day before)
    if (diffDays >= 0) setShowPre(true);

    // Show post-precaution if appointment is today or past
    if (diffDays <= 0) setShowPost(true);

  }, [appointment]);

  if (!appointment || !appointment.therapy) return null;

  return (
    <div>
      {showPre && (
        <div style={{ border: "1px solid #2196f3", padding: "10px", margin: "10px 0", borderRadius: "6px", backgroundColor: "#e3f2fd" }}>
          <strong>Pre-Precaution for {appointment.therapy.name}:</strong>
          <p>{appointment.therapy.prePrecaution || "No specific pre-precaution."}</p>
        </div>
      )}
      {showPost && (
        <div style={{ border: "1px solid #4caf50", padding: "10px", margin: "10px 0", borderRadius: "6px", backgroundColor: "#e8f5e9" }}>
          <strong>Post-Precaution for {appointment.therapy.name}:</strong>
          <p>{appointment.therapy.postPrecaution || "No specific post-precaution."}</p>
        </div>
      )}
    </div>
  );
};

export default Notification;
