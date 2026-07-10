import React from 'react'
import AmkorLogo from '../Images/AmkorLogo.png'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const navigate = useNavigate()
  return (
    <div className='bg-gray-100 h-screen flex items-center justify-center'>
        <div className='bg-white p-4 shadow-xl w-[50vh] h-[45vh] rounded'>
            <div className='flex gap-2 flex-col justify-center items-center p-2'>
                <img src={AmkorLogo} alt="Logo" className='h-[8vh] object-contain' />
                <p className='font-bold text-[12px]'>Vehicle Booking System, Book now!</p>
            </div>
            <div className='h-[30vh] flex flex-col items-center justify-center '>
               <form className='text-[12px]'>
                    <div className='flex flex-col gap-5 w-[40vh]'>
                        <input
                        className='bg-yellow-100/50 border-2 border-yellow-300 rounded py-2 px-2  placeholder:text-[13px] font-bold text-gray-900'
                        placeholder='Email'>
                        </input>
                        <input
                        className='bg-yellow-100/50 border-2 border-yellow-300 rounded p-1 px-2 placeholder:text-[13px] font-bold text-gray-900'
                        placeholder='Password'
                        type='password'>
                        </input>
                        <button 
                        onClick={() => navigate('/user')}
                        className='bg-yellow-500 rounded p-2 hover:bg-yellow-400 duration-300 transition-colors'>
                            <p className='font-bold text-[14px] text-white'>Login</p>
                        </button>
                    </div>
               </form>
               <div className='mt-7 border-t border-gray-200 h-[5vh] w-[40vh] flex items-center justify-center'>
                 <p className='text-gray-500 text-[12px]'>© 2026 Amkor Coop Technology, Inc. All rights reserved.</p>
               </div>
            </div>
        </div>
    </div>
  )
}

export default LandingPage