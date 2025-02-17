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
      to: "friendsbook.team@gmail.com-,d", // Change this to the recipient's email
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

module.exports=router;