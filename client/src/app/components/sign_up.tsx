"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./styles/sign_up.css";

// Define the validation schema with yup
const schema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
});

interface IFormInput {
  name: string;
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

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customError, setCustomError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    setSuccess(false);
    setCustomError("");

    const { confirmPassword, ...dataToSend } = data;

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        ...dataToSend,
        role: "user",
      });

      if (response.data) {
        setSuccess(true);
        localStorage.setItem("token", response.data.token);
        setCustomError("");
        router.push("/login");
        setSuccessMessage("Signup successful!");
      } else {
        setCustomError("Invalid credentials");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setCustomError(error.response?.data?.error || error.message);
      } else {
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
            <Image
              src="/image/vtu_banner5.jpeg"
              alt="Banner"
              className="sign-up-image"
              width={300}
              height={300}
            />
          </div>
          <div className="sign-up-form">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              {Object.keys(errors).length > 0 && (
                <div className="error">
                  {(Object.values(errors) as { message?: string }[]).map((err, i) => (
                    <p key={i}>{err.message}</p>
                  ))}
                </div>
              )}

              <div className="form-data">
                <h1 className="title">Sign Up</h1>
              </div>
              <center className="display_error">
                {customError && <div className="error">{customError}</div>}
                {success && <div className="success">{successMessage}</div>}
              </center>
              <div className="form-data">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="Full Name" {...register("name")} />
              </div>
              <div className="form-data">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Email" {...register("email")} />
              </div>
              <div className="form-data">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Password" {...register("password")} />
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