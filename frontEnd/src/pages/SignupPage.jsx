import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';

export default function SignupPage() {
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await axios.post(import.meta.env.VITE_API_URL+'/auth/signup', data, { withCredentials: true });

        alert(result.data.message)

      if (result.status === 201) {
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.message)
      console.log("Errors in signup form: ", error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          field="name"
          placeholder="Enter your name"
          register={register}
          errors={errors}
          validations={{ required: "Name is required" }}
        />
        <Input
          type="email"
          field="email"
          placeholder="Enter your email"
          register={register}
          errors={errors}
          validations={{ required: "Email is required" }}
        />
        <Input
          type="password"
          field="password"
          placeholder="Enter your password"
          register={register}
          errors={errors}
          validations={{
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" }
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
