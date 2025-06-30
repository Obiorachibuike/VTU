"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "../components/styles/sign_up.css";

// Define the validation schema with yup
const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

function AdminSignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "user", // Set role to user by default
      });

      if (response.status === 200) {
        setSuccess(true);
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Signup failed"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="sign-up-container">
        <div className="sign-up-cont">
          <div className="sign-up-content">
            <div className="sign-up-image-cont">
              <img
                src="../image/vtu_banner5.jpeg"
                alt=""
                className="sign-up-image"
              />
            </div>
            <div className="sign-up-form">
              <form onSubmit={handleSubmit(onSubmit)} className="form">
                {success && <div className="success">Signup successful!</div>}

                <div className="form-data">
                  <h1 className="title">Register Admin</h1>
                </div>
                <div className="form-data">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Full Name"
                    {...register("name")}
                  />
                  <p className="error-message">{errors.name?.message}</p>
                </div>
                <div className="form-data">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  <p className="error-message">{errors.email?.message}</p>
                </div>
                <div className="form-data">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    {...register("password")}
                  />
                  <p className="error-message">{errors.password?.message}</p>
                </div>
                <div className="form-data">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    {...register("confirmPassword")}
                  />
                  <p className="error-message">{errors.confirmPassword?.message}</p>
                </div>
                <div className="button-cont">
                  <button className="sign-up-button" type="submit" disabled={isLoading}>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
                <center>
                  Already have an account? <a href="/login">Login</a>
                </center>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignUpForm;
