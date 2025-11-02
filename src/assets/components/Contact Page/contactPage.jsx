import React, { useState } from "react";
import "./ContactPage.css";

const ContactPage = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending...");
    const formData = new FormData(event.target);

    // 🔑 Add your Web3Forms Access Key
    formData.append("access_key", "35209dca-e96b-4023-9a18-57c1719ae388");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult("✅ Form Submitted Successfully!");
      event.target.reset();
      setTimeout(() => setResult(""), 4000); // clear after 4s
    } else {
      console.error("Error:", data);
      setResult("❌ Something went wrong. Try again!");
    }
  };

  return (
    <div className="pageContact">
      <h1 className="contactTitle">Contact Us</h1>

      <form className="contactForm" onSubmit={onSubmit}>
        <div className="formGroup">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" placeholder="Enter your full name" required />
        </div>

        <div className="formGroup">
          <label htmlFor="number">Phone Number</label>
          <input type="tel" id="number" name="number" placeholder="Enter your phone number" required />
        </div>

        <div className="formGroup">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" required />
        </div>

        <div className="formGroup">
          <label htmlFor="query">Your Query</label>
          <textarea id="query" name="query" placeholder="Type your message or question here..." rows="5" required></textarea>
        </div>

        <button type="submit" className="submitBtn">Submit</button>

        {/* 📨 Submission Status */}
        {result && <p style={{ textAlign: "center", marginTop: "1rem", color: "#00eaff" }}>{result}</p>}
      </form>
    </div>
  );
};

export default ContactPage;
