import React, { useState } from "react"
import { useForm } from "react-hook-form"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function CreateTheater() {
  const navigate = useNavigate()
  const [generatedCode, setGeneratedCode] = useState(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setLoading(true)

      const result = await axios.post(
        import.meta.env.VITE_API_URL+"theater/create-theater",
        {
          title: data.theaterName,
        },
        { withCredentials: true }
      )

      const code = result.data.data.code
      setGeneratedCode(code)

      // Small delay so user sees the code before redirect
      setTimeout(() => {
        navigate(`/active-theater/${code}`)
      }, 1200)

    } catch (error) {
      alert(error.response?.data?.message || error.message)
      console.log(
        "Errors in creating theater:",
        error.response?.data?.message || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#050914] text-white font-sans">
      <Navbar />

      <div className="flex flex-col items-center justify-center px-4 py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-500">
            Create Your Theater
          </h1>
          <p className="text-gray-400 mt-2">
            Set the stage for your next big screening.
          </p>
        </div>

        {/* Card */}
        <div className="relative group w-150 max-w-full">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative w-full bg-[#0b1320]/80 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl"
          >
            <div className="space-y-6">
              {/* Theater Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300 ml-1">
                  Theater Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Sci-Fi Club"
                  {...register("theaterName", { required: true })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                {errors.theaterName && (
                  <span className="text-red-400 text-sm">
                    Theater name is required
                  </span>
                )}
              </div>

              {/* Max Audience */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300 ml-1">
                  Max Audience
                </label>
                <input
                  type="number"
                  {...register("maxAudience", {
                    required: true,
                    min: 1,
                    max: 100,
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition-all"
                />
                {errors.maxAudience && (
                  <span className="text-red-400 text-sm">
                    Audience must be between 1 and 100
                  </span>
                )}
              </div>

              {/* Generated Code Display */}
              {generatedCode && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-6">
                  <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">
                    Your Unique Access Code
                  </p>
                  <p className="text-lg font-mono text-white">
                    {generatedCode}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-bold py-4 rounded-lg shadow-lg shadow-blue-900/20 transform active:scale-[0.98] transition-all"
              >
                {loading ? "Creating..." : "Launch Theater"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-gray-500 text-sm">
          Privacy Tip: Only people with the code can join your session.
        </p>
      </div>
    </div>
  )
}