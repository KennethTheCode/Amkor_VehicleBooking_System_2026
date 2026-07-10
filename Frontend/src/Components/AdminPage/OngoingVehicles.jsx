import React from 'react'

function OngoingVehicles() {
  return (
    <div className='w-full  flex flex-col items-center p-2'>
        <p className='text-blue-800 font-bold text-[15px]'>Completed Request History</p>
        <div className='w-full h-[20vh] bg-gray-100 rounded p-1 flex flex-col overflow-y-auto gap-2'>
            {/*Ongoing Cards*/}
            <div className='bg-white h-[10vh] flex justify-between p-1 border-gray-200 shadow-xl border'>
                <div className='h-full w-[10vh] flex flex-col gap-2'>
                    <div className='flex justify-center items-center flex-col'>
                            <div className='flex justify-center items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[14px]'>09:45PM</p>
                            </div>
                        <p className='text-gray-400 font-bold text-[10px]'>July, 10, 2026</p>
                    </div>
                    <div className='flex justify-center items-center flex-col'>

                        <div className='flex justify-center items-center'>
                            <span className='material-symbols-outlined text-red-800'>distance</span>
                            <p className='text-red-800 font-bold text-[14px]'>12:45AM</p>
                        </div>
                        <p className='text-gray-400 font-bold text-[10px]'>July, 11, 2026</p>
                    </div>
                </div>
                <div className='h-full w-[15vh]'>
                    <p className='text-gray-500 font-bold text-[15px]'>Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-400 font-bold text-[10px]'>Avanza 2018 - DAH4045</p>
                    <button className='bg-green-500 rounded w-full hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                        <p className='text-white font-bold text-[13px]'>Details</p>
                    </button>
                </div>
            </div>

            <div className='bg-white h-[10vh] flex justify-between p-1'>
                <div className='h-full w-[10vh] flex flex-col gap-2'>
                    <div className='flex justify-center items-center flex-col'>
                            <div className='flex justify-center items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[14px]'>09:45PM</p>
                            </div>
                        <p className='text-gray-400 font-bold text-[10px]'>July, 10, 2026</p>
                    </div>
                    <div className='flex justify-center items-center flex-col'>

                        <div className='flex justify-center items-center'>
                            <span className='material-symbols-outlined text-red-800'>distance</span>
                            <p className='text-red-800 font-bold text-[14px]'>12:45AM</p>
                        </div>
                        <p className='text-gray-400 font-bold text-[10px]'>July, 11, 2026</p>
                    </div>
                </div>
                <div className='h-full w-[15vh]'>
                    <p className='text-gray-500 font-bold text-[15px]'>Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-400 font-bold text-[10px]'>Avanza 2018 - DAH4045</p>
                    <button className='bg-green-500 rounded w-full hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                        <p className='text-white font-bold text-[13px]'>Details</p>
                    </button>
                </div>
            </div>

            <div className='bg-white h-[10vh] flex justify-between p-1'>
                <div className='h-full w-[10vh] flex flex-col gap-2'>
                    <div className='flex justify-center items-center flex-col'>
                            <div className='flex justify-center items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[14px]'>09:45PM</p>
                            </div>
                        <p className='text-gray-400 font-bold text-[10px]'>July, 10, 2026</p>
                    </div>
                    <div className='flex justify-center items-center flex-col'>

                        <div className='flex justify-center items-center'>
                            <span className='material-symbols-outlined text-red-800'>distance</span>
                            <p className='text-red-800 font-bold text-[14px]'>12:45AM</p>
                        </div>
                        <p className='text-gray-400 font-bold text-[10px]'>July, 11, 2026</p>
                    </div>
                </div>
                <div className='h-full w-[15vh]'>
                    <p className='text-gray-500 font-bold text-[15px]'>Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-400 font-bold text-[10px]'>Avanza 2018 - DAH4045</p>
                    <button className='bg-green-500 rounded w-full hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                        <p className='text-white font-bold text-[13px]'>Details</p>
                    </button>
                </div>
            </div>

        </div>
    </div>
  )
}

export default OngoingVehicles