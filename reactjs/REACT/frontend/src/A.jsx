import React, { useState } from 'react';
import axios from 'axios';

const OTPForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Function to handle phone number submission
  const handlePhoneNumberSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { phoneNumber });
      setMessage(response.data.message);
      setIsOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  // Function to handle OTP submission
  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { phoneNumber, otp });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      {!isOtpSent ? (
        <div>
          <input 
            type="text" 
            placeholder="Enter phone number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
          />
          <button onClick={handlePhoneNumberSubmit}>Send OTP</button>
        </div>
      ) : (
        <div>
          <input 
            type="text" 
            placeholder="Enter OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
          />
          <button onClick={handleOtpSubmit}>Verify OTP</button>
        </div>
      )}
      <p>{message}</p>
    </div>
  );
};

export default OTPForm;
