import React, { useState } from "react";
import { login } from "../store/authSlice";
import { Button, Input } from "./index.js";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function Signup() {
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();
  const signUp = async (data) => {
    setError("");
    setloading(true);
    if (data.password !== data.confirmPassword) {
      setError("Passwod Do not match.");
      setloading(false);
      return null;
    }
    try {
      const createUser = await fetch(
        "http://localhost:3000/api/v1/user/register",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const createdUser = await createUser.json();

      if (!createUser.ok) {
        setError(createdUser.message || "Failed to Create User");
        return null;
      }
      dispatch(login(createdUser.data));
      navigate("/");
    } catch (error) {
      setError("Something went wrong. Please try again later");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-200">
      <form
        onSubmit={handleSubmit(signUp)}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-xl font-bold mb-6 text-center">Sign Up</h2>
        <h2 className="text-lg font-bold">FullName</h2>
        <Input
          type="text"
          name="fullname"
          placeholder="Enter your fullName"
          autoComplete="off"
          {...register("fullname", { required: true })}
        />
        <h2 className="text-lg font-bold">Username</h2>
        <Input
          type="text"
          name="username"
          placeholder="Enter your username"
          autoComplete="off"
          {...register("username")}
        />
        <h2 className="text-lg font-bold">Email</h2>
        <Input
          type="text"
          name="email"
          placeholder="Enter your eamil"
          autoComplete="off"
          {...register("email", { required: true })}
        />
        <h2 className="text-lg font-bold">Password</h2>
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="off"
          {...register("password", { required: true })}
        />
        <h2 className="text-lg font-bold">Confirm Password</h2>
        <Input
          type="password"
          name="confrimPassword"
          placeholder="confirm your password"
          autoComplete="off"
          {...register("confirmPassword", { required: true })}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full mt-4 cursor-pointer">
          {loading ? "Signing in..." : "Sign Up"}
        </Button>
        <p className="text-center text-sm mt-4">
          Have an account?{""}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
