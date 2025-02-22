require("dotenv").config();
const express=require("express");
const nodemailer=require('nodemailer');
const router=express();



router.post("/sendmail", async (req, res) => {
  const { email, message } = req.body;
  console.log(email);
  console.log(message);
  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS)

  if (!email || !message) {
    return res.status(400).json({ error: "Email and message are required" });
  }

  try {
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email (configured in .env)
        pass: process.env.EMAIL_PASS, // Your app password (configured in .env)
      },
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email
      to: "friendsbook.team@gmail.com", // Change this to the recipient's email
      subject: "New Feedback Received",
      text: `You received feedback from: ${email}\n\nMessage:\n${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending feedback" });
  }
});


router.post("/senddata", async (req, res) => {
  const { feedbackType, feedbackPart, feedbackText, includeSessionData, contactMe, email } = req.body;

  console.log("Received Feedback:", req.body);

  if(!email)
      return res.status(404).json({error: "Error sending feedback.Try again!"})

  if (!feedbackType || !feedbackPart || !feedbackText) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "rr200259@rguktrkv.ac.in", // Change recipient email
      subject: "New Feedback Received",
      text: `Received a feedback from:${email}\nFeedback Type: ${feedbackType}\nFeedback Part: ${feedbackPart}\nMessage: ${feedbackText}\nInclude Session Data: ${includeSessionData}\nContact Me: ${contactMe}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Feedback sent successfully!" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ error: "Error sending feedback" });
  }
});

module.exports=router;