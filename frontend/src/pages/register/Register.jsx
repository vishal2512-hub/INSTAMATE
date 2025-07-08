import React, { useState } from "react";
import "./register.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateInputs = () => {
    if (!inputs.username || !inputs.email || !inputs.password || !inputs.name) {
      return "All fields are required!";
    }
    if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      return "Invalid email format!";
    }
    if (inputs.password.length < 6) {
      return "Password must be at least 6 characters!";
    }
    return null;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErr(null);
    setSuccess(null);

    const validationError = validateInputs();
    if (validationError) {
      setErr(validationError);
      return;
    }

    try {
    await axios.post("http://localhost:8801/api/auth/register", inputs); // ✅ Correct
      setSuccess("Registration successful! You can now login.");
    } catch (err) {
      setErr(err.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h2>Instamate</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={inputs.username}
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={inputs.password}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
            {err && <p className="error">{err}</p>}
            {success && <p className="success">{success}</p>}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
