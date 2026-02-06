import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
 const navigate=useNavigate()
  return (
    <div>
      <div className='w-full h-16 flex bg-black'>
          <div className='w-1/3 h-full flex items-center'>
            <h2 className='text-indigo-600 ml-7 font-semibold'>BOND_CinePLEX</h2>
          </div>
          <div className='w-2/3 h-full items-center flex '>
            <ul className='flex justify-evenly w-full text-indigo-600 font-bold hover:cursor-pointer'>
              <li className='hover:border-2 border-b-slate-900 px-2' onClick={()=>navigate('/')}>Home</li>
              <li className='hover:border-2 border-b-slate-900 px-2'>Movies</li>
              <li className='hover:border-2 border-b-slate-900 px-2' onClick={()=>navigate('/theater')}>Theaters</li>
              <li className='hover:border-2 border-b-slate-900 px-2'>Tickets</li>
              <li className='hover:border-2 border-b-slate-900 px-2' onClick={()=>navigate('/schedule')}>Schedule</li>
              <li className='hover:border-2 border-b-slate-900 px-2 underline' onClick={()=>navigate('/squad')}>#TheSQUAD</li>
            </ul>
          </div>
        </div>
    </div>
  )
}
