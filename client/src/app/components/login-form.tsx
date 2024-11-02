'use client';

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useUserContext } from "../dashboard/Context/UserContext";
import { useRouter } from 'next/navigation';

import "./styles/login-form.css";

// Define validation schema using yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const { setUser, setIsAuthenticated,user,fetchUserDetails } = useUserContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      // Send login request to the server
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email: data.email,
        password: data.password,
        role: "user",
      });
      // console.log(response.data.jwtToken)

      if (response.status === 200) {
        // Store user data and token
        // setUser(response.data.user);
        const token = response.data.jwtToken;
        // console.log(user);
        fetchUserDetails(token)
        
        // Set token in HttpOnly cookie (assuming backend handles this)
        document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;

        // Set authentication state
        setIsAuthenticated(true);
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "Login failed"}`);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-cont">
        <div className="login-content">
          <div className="login-image-cont">
            <Image
              src="/image/vtu_banner6.jpeg"
              alt="Banner"
              className="login-image"
              width={300}
              height={300}
            />
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="form-data">
                <h1 className="title">Welcome Back!</h1>
              </div>
              <div className="form-data">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  {...register("email")}
                  aria-describedby="email-error"
                />
                <p id="email-error" className="error-message">{errors.email?.message}</p>
              </div>
              <div className="form-data">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  {...register("password")}
                  aria-describedby="password-error"
                />
                <p id="password-error" className="error-message">{errors.password?.message}</p>
                <Link href="/forget_password_mail" className="forget">
                  Forget password
                </Link>
              </div>
              <div className="button-cont">
                <button className="button" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
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

export default LoginForm;
