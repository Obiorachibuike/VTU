"use client"
import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import "../components/styles/login-form.css";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token", data.token); // Store token in localStorage
        window.location.href = "/home"; // Redirect to home or user dashboard
      } else {
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-cont">
        <div className="login-content">
          <div className="login-image-cont">
            <Image
              src="/image/vtu_banner6.jpeg"
              alt="Login Banner"
              className="login-image"
              width={300}
              height={300}
            />
          </div>
          <div className="login-form">
            <form className="form" onSubmit={handleSubmit}>
              <div className="form-data">
                <h1 className="title">Welcome Back!</h1>
              </div>
              {error && <div className="error">{error}</div>}
              <div className="form-data">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-data">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Link href="/forget_password_mail" className="forget">
                  Forget password?
                </Link>
              </div>
              <div className="button-cont">
                <button className="button" type="submit">
                  Login
                </button>
              </div>
              <center>
                Don't have an account? <Link href="/sign_up">Sign up</Link>
              </center>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginForm;
