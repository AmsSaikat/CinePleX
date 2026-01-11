import React, { useEffect } from 'react'
import Input from './components/Input'
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

export default function App() {
  const dispatch=useDispatch()
  const {loading}=useSelector((state)=>state.auth)

  useEffect(()=>{
    const fetchUser=async ()=>{
      dispatch(setLoading(true))
      try {
        const res=await axios.get("http://localhost:3000/api/auth/me",{
          withCredentials:true
        });
        dispatch(setUser(res.data.user))
      } catch (error) {
        dispatch(clearUser())
      }
    }

    fetchUser()
  },[dispatch])

  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div>
      <Routes>
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/theater' element={<Theater/>} />
        <Route path='/squad' element={<TheSquad/>} />
        <Route path='/join-theater' element={<JoinTheater/>} />
        <Route path='/active-theater' element={<ActiveTheater/>} />
      </Routes>
    </div>
  )
}
