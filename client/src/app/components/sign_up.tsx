"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import "./styles/sign_up.css";
import router from "next/router";

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

interface IFormInput {
  name: string;  // Full Name
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customError, setCustomError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setSuccess(false);
    setCustomError("");

    // Prepare data excluding 'confirmPassword'
    const { confirmPassword, ...dataToSend } = data;

    console.log("Data to send:", dataToSend); // Log the data being sent to the backend

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        ...dataToSend,
        role: "user", // Set role to user by default
      });
      if (response.data) {
        
        setSuccess(true);
        console.log(response.data); // Log response data
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
        setCustomError("");
        router.push("/login")
        setSuccessMessage(response.data)
      }else{
        
        setCustomError("Invalid Credential");
      }
    } catch (error: any) {
      console.error("Error response data:", error.response?.data);
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        console.error("Axios error:", error.message);
        console.error("Error response data:", error.response?.data);

        if (error.response?.data) {
          // Specific error message from the backend
          setCustomError(`${error.response.data.error || "Signup failed"}`);
        } else {
          // General error message
          setCustomError(` ${error.message}`);
          console.log(error.message);
          
        }
      } else {
        // General error handling for non-Axios errors
        console.error("Non-Axios error:", error);
        setCustomError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-up-container">
      <div className="sign-up-cont">
        <div className="sign-up-content">
          <div className="sign-up-image-cont">
            <img src="../image/vtu_banner5.jpeg" alt="Banner" className="sign-up-image" />
          </div>
          <div className="sign-up-form">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              {Object.values(errors).length > 0 && (
                <div className="error">
                  {Object.values(errors).map((err) => (
                    <p key={err.message}>{err.message}</p>
                  ))}
                </div>
              )}

              <div className="form-data">
                <h1 className="title">Sign Up</h1>
              </div>
              <center className="display_error">

              {customError && <div className="error">{customError}</div>} 
             
              {success && <div className="success">Signup successful!</div>} 
              </center>
              <div className="form-data">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Full Name"
                  {...register("name")}  // Registered field
                />
              </div>
              <div className="form-data">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email")}
                />
              </div>
              <div className="form-data">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              <div className="form-data">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                />
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
  );
};

export default SignUpForm;
