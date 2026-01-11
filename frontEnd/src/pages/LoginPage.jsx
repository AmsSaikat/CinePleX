import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {Mail,Lock} from 'lucide-react'
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

export default function LoginPage() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
        { withCredentials: true }
      );

      // ✅ Update Redux auth state
      dispatch(setUser(res.data.user));

      alert(res.data.message);
      navigate("/");

    } catch (error) {
      alert(error.response?.data?.message || error.message);
      console.log(
        "Errors in login form:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
    <fieldset className="border border-gray-500 rounded-lg p-6">
      <legend className="px-2 text-lg font-semibold text-gray-700">Login</legend>

      
  <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
    <Input
      icon={Mail}
      type="email"
      field="email"
      placeholder="Enter your email"
      register={register}
      errors={errors}
      validations={{ required: "Email is required" }}
    />

    <Input
      icon={Lock}
      type="password"
      field="password"
      placeholder="Enter your password"
      register={register}
      errors={errors}
      validations={{ required: "Password is required" }}
    />

    <button
      type="submit"
      disabled={loading}
      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg transition-colors duration-200 hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Logging in..." : "Submit"}
    </button>
  </form>

    </fieldset>
  </div>
  );
}
