import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sms.css";

function Sms() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendSms = async () => {
    if (!phone.trim() || !message.trim()) {
      alert("Please enter both a phone number and a message");
      return;
    }

    try {
      setSending(true);

      const response = await fetch(
        `http://localhost:8080/api/sms/send?phone=${encodeURIComponent(phone)}&message=${encodeURIComponent(message)}`,
        {
          method: "POST",
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || `Request failed with status ${response.status}`);
      }

      alert("SMS sent successfully. SID: " + result);
    } catch (error) {
      console.error(error);
      alert("Failed to send SMS: " + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sms-container">
      <div className="sms-box">

        <h2>Send SMS</h2>
        <p className="sms-subtitle">Deliver a message to any phone number</p>

        <div className="sms-form">

          <div className="sms-field">
            <label htmlFor="phone">Phone number</label>
            <input
              className="field"
              type="tel"
              id="phone"
              placeholder="+919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="sms-field">
            <label htmlFor="message">Message</label>
            <textarea
              className="field"
              id="message"
              placeholder="Enter message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="sms-actions">

            <button
              className="btn btn-ghost"
              onClick={() => navigate("/home")}
            >
              Back
            </button>

            <button
              className="btn btn-primary"
              onClick={sendSms}
              disabled={sending}
            >
              {sending ? "Sending..." : "Send SMS"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Sms;
