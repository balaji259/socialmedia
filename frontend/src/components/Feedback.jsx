import { useState, useEffect } from "react";
// import jwtDecode from "jwt-decode";
// import jwtDecode from "jwt-decode";

import { jwtDecode } from "jwt-decode";


export default function FeedbackForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    console.log("email");
    console.log(email);
    console.log("Feedback...");
    console.log(message);

    try {
      const response = await fetch("/feedback/sendmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });
      
      if (response.ok) {
        setStatus("Feedback sent successfully!");
        setMessage("");
    
      } else {
        setStatus("Failed to send feedback. Try again.");
      }
    } catch (error) {
      setStatus("Error sending feedback.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Your Feedback"
            className="w-full p-2 border rounded-md"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
          >
            Send Feedback
          </button>
          {status && <p className="text-center text-sm text-gray-600">{status}</p>}
        </form>
      </div>
    </div>
  );
}
