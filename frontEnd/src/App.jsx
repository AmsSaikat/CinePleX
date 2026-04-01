import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setLoading, setUser } from './redux/slices/authSlice'
import Theater from './pages/Theater'
import TheSquad from './pages/TheSquad'
import JoinTheater from './pages/JoinTheater'
import ActiveTheater from './pages/ActiveTheater'
import ChatBox from './components/ChatBox'
import SchedulePage from './pages/SchedulePage'
import UploadMovieModal from './pages/movieModal/UploadMovieModal'
import CreateTheater from './pages/CreateTheater'
import ProtectedRoute from './hooks/ProtectedRoutes'
import MoviePage from './pages/MoviePage'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'

export default function App() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true))
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}auth/me`, {
          withCredentials: true
        });
        dispatch(setUser(res.data.user))
      } catch (error) {
        dispatch(clearUser())
      }
    }

    fetchUser()
  }, [dispatch])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />

        {/* Protected routes */}
        <Route path="/theater" element={<ProtectedRoute><Theater /></ProtectedRoute>}/>
        <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>}/>
        <Route path="/squad" element={<ProtectedRoute><TheSquad /></ProtectedRoute>}/>
        <Route path="/join-theater" element={<ProtectedRoute><JoinTheater /></ProtectedRoute>}/>
        <Route path="/create-theater" element={<ProtectedRoute><CreateTheater /></ProtectedRoute>}/>
        <Route path="/active-theater/:code" element={<ProtectedRoute><ActiveTheater /></ProtectedRoute>}/>
        <Route path="/chatbox" element={<ProtectedRoute><ChatBox /></ProtectedRoute>} />
        <Route path="/movies" element={<ProtectedRoute><MoviePage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />

        {/* Test route (could be protected too if needed) */}
        <Route path="/test" element={<UploadMovieModal />} />
      </Routes>
    </div>
  )
}
