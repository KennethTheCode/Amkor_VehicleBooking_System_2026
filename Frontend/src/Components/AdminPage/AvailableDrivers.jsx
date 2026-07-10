import React from 'react'
import AmkorLogo from '../../Images/AmkorLogo.png'

function AvailableDrivers() {
  return (
    <div className='w-full flex flex-col items-center justify-center gap-2'>
        <p className='text-blue-800 font-bold text-[15px]'>Available Drivers</p>
            <div className='bg-gray-100 w-[30vh] h-[13vh] p-1 flex overflow-x-auto gap-4'>
                {/* Available Drivers Card*/}
                <div className='text-center w-[10vh] h-full flex flex-col items-center'>
                    <div className='bg-white w-[8vh] h-[8vh] rounded-full flex items-center border-2 border-blue-500'>
                        <img src={AmkorLogo} alt="Logo" className='h-[4vh] object-contain' />
                    </div>
                    <p className='text-blue-800 font-bold text-[10px]'>Carl Angelo Hernandez</p>
                </div>

                <div className='text-center w-[10vh] h-full flex flex-col items-center'>
                    <div className='bg-white w-[8vh] h-[8vh] rounded-full flex items-center border-2 border-blue-500'>
                        <img src={AmkorLogo} alt="Logo" className='h-[4vh] object-contain' />
                    </div>
                    <p className='text-blue-800 font-bold text-[10px]'>Carl Angelo Hernandez</p>
                </div>

                <div className='text-center w-[10vh] h-full flex flex-col items-center'>
                    <div className='bg-white w-[8vh] h-[8vh] rounded-full flex items-center border-2 border-blue-500'>
                        <img src={AmkorLogo} alt="Logo" className='h-[4vh] object-contain' />
                    </div>
                    <p className='text-blue-800 font-bold text-[10px]'>Carl Angelo Hernandez</p>
                </div>
                <div className='text-center w-[10vh] h-full flex flex-col items-center'>
                    <div className='bg-white w-[8vh] h-[8vh] rounded-full flex items-center border-2 border-blue-500'>
                        <img src={AmkorLogo} alt="Logo" className='h-[4vh] object-contain' />
                    </div>
                    <p className='text-blue-800 font-bold text-[10px]'>Carl Angelo Hernandez</p>
                </div>
            </div>
            <button className='rounded border-blue-800 border-2 p-2 w-full hover:bg-gray-100 text-white duration-300 transition-colors cursor-pointer'>
                <p className='text-blue-800 font-bold text-[15px]'>Driver Schedules</p>
            </button>
    </div>
  )
}

export default AvailableDrivers