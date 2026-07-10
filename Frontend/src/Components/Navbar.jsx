import React from 'react'
import AmkorLogo from '../Images/AmkorLogo.png'

function Navbar() {
  return (
    <div className='h-[7vh] border-b border-gray-300 bg-gray-100 shadow flex justify-between z-100 top-0 sticky'>
        <div className='w-[20vh] h-full flex items-center justify-center'>
            <img src={AmkorLogo} alt="Logo" className='h-[4vh] object-contain' />
        </div>
        <div className='w-[25vh] h-full p-1 flex justify-center items-center gap-2'>
            <p className='font-bold text-[12px]'>
                Welcome Back!
            </p>
            <div className='border-2 w-[6vh] h-full rounded-full flex items-center justify-center'>
                <img src={AmkorLogo} alt="Logo" className='h-[8vh] object-contain' />
            </div>
        </div>

    </div>
  )
}

export default Navbar