import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Slider from '../components/Slider.jsx'

export default function HomePage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth
  )

  return (
    <div className='bg-[#0b1320] text-white min-h-screen'>

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className='w-full min-h-[70vh] flex items-center justify-center px-6'>
        <div className='max-w-4xl text-center space-y-6'>
          <h1 className='text-5xl md:text-6xl font-extrabold leading-tight'>
            The Theater of <span className='text-cyan-400'>Friends</span>
          </h1>

          <p className='text-lg md:text-xl text-blue-300'>
            Watch movies, series & anime together — synced, social, seamless.
          </p>

          <p className='text-blue-400 max-w-2xl mx-auto'>
            BOND_CinePLEX lets you watch-party, chat, react and voice-talk with
            your friends without ever breaking the flow.
          </p>

          <div className='flex justify-center gap-6 pt-4'>
            <button className='px-6 py-3 bg-cyan-500 text-black font-semibold rounded-xl hover:bg-cyan-400 transition'>
              Start Watching
            </button>
            <button className='px-6 py-3 border border-cyan-500 rounded-xl hover:bg-cyan-500/10 transition'>
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className='w-full py-16 bg-[#101a2f]'>
        <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
          <div className='p-6 rounded-2xl bg-[#0b1320] shadow-xl'>
            <h2 className='text-4xl font-bold text-cyan-400'>72+</h2>
            <p className='text-blue-300 mt-2'>Total Hours Streamed</p>
          </div>

          <div className='p-6 rounded-2xl bg-[#0b1320] shadow-xl'>
            <h2 className='text-4xl font-bold text-cyan-400'>Yesterday</h2>
            <p className='text-blue-300 mt-2'>Last Watch Party</p>
          </div>

          <div className='p-6 rounded-2xl bg-[#0b1320] shadow-xl'>
            <h2 className='text-4xl font-bold text-cyan-400'>1h</h2>
            <p className='text-blue-300 mt-2'>Current Session</p>
          </div>
        </div>
      </section>

      {/* ABOUT / EXPERIENCE */}
      <section className='w-full py-20 px-6'>
        <div className='max-w-4xl mx-auto text-center space-y-6'>
          <h2 className='text-4xl font-bold'>
            Experience Cinema <span className='text-lime-400'>Together</span>
          </h2>

          <p className='text-blue-300 leading-relaxed'>
            Create virtual rooms, invite friends, sync playback automatically,
            react live, comment freely and talk via voice — all in one shared
            cinematic space.
          </p>
        </div>
      </section>

      {/* FEATURES SLIDER */}
      <section className='w-full py-20 bg-[#101a2f]'>
        <h2 className='text-center text-4xl font-bold mb-10'>
          Platform Features
        </h2>
        <Slider />
      </section>

      {/* REQUEST MOVIE */}
      <section className='w-full py-20 px-6'>
        <div className='max-w-xl mx-auto text-center space-y-6'>
          <h2 className='text-3xl font-bold'>Request a Movie</h2>

          <form className='flex gap-4'>
            <input
              type='text'
              placeholder='Enter movie name'
              className='flex-1 p-3 rounded-lg text-gray-300 outline-none border border-cyan-900 focus:ring-2 focus:ring-offset-cyan-950'
            />
            <button className='px-6 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition'>
              Request
            </button>
          </form>
        </div>
      </section>

    </div>
  )
}
