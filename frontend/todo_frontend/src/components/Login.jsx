import React, { useState } from "react";
import { login as authLogin } from "../store/authSlice";
import { Button, Input } from "./index.js";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function Login() {
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const login = async (data) => {
    setError("");
    setloading(true);
    console.log(data);

    const isEmail = /\S+@\S+\.\S+/.test(data.username);
    const payload = isEmail
      ? { email: data.username, password: data.password }
      : { username: data.username, password: data.password };
    try {
      const session = await fetch("http://localhost:3000/api/v1/user/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const activeSession = await session.json();

      if (!session.ok) {
        setError(activeSession.message || "Login Failed");
        return null;
      }

      dispatch(authLogin(activeSession.data));
      navigate("/");
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-purple-100 to-blue-50">
      <div className="w-full max-w-md bg-white/90 shadow-2xl backdrop-blur-lg rounded-2xl p-10 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit(login)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username or Email
            </label>
            <Input
              name="username"
              placeholder="Enter your username or email"
              {...register("username")}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              {...register("password")}
              autoComplete="off"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
