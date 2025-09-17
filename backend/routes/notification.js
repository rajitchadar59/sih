
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com",
    pass: "yourapppassword", 
  },
});


router.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await transporter.sendMail({
      from: "youremail@gmail.com",
      to,
      subject,
      text,
    });
    res.json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
