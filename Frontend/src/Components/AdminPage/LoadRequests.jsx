import React from 'react'
import FilterRequests from './FilterRequests/FilterRequests'

function LoadRequests() {
  return (
    <div className='h-[80vh] w-full flex flex-col overflow-y-auto'>
        <div className='flex justify-between items-center p-1'>
            <p className='text-gray-500 font-bold text-[15px]'>331 Pending</p>
            <FilterRequests/>
        </div>

        <div className='w-full h-[95%] py-1 flex flex-col gap-3 '>
        {/* Load all Requests */}
            <div className='bg-white rounded-lg h-[17vh] p-2 flex flex-col gap-3'>
                <div className='w-full border-b border-gray-200 pb-1 h-[10] flex items-center justify-between gap-1'>
                    <p className='text-gray-500 font-bold text-[13px]'>Requested By: Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Vehicle Needed: Avanza</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Purpose: Pick up remaining supplies</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Passengers: 6</p>
                </div>

                    <div className='h-full w-full  flex justify-between items-center'>
                     <div className='h-full w-[35vh] flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Pick up at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[17px]'>Amkor Coop P1 Cupang Muntinlupa</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>July, 10 2026</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>09:00AM</p>
                     </div>

                     <div className=' w-[15vh] h-full flex flex-col gap-1 justify-center'>
                        <button className='w-full p-1 bg-green-500 rounded hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Review</p>
                        </button>

                        <button className='w-full p-1 bg-red-500 rounded hover:bg-red-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Reject</p>
                        </button>
                     </div>

                     <div className='h-full w-[35vh]  flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Drop off at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-red-800'>location_on</span>
                                <p className='text-red-800 font-bold text-[17px]'>Amkor P3 Santa Rosa Laguna</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>---</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>---</p>
                     </div>
                    </div>

                    
            </div>
            <div className='bg-white rounded-lg h-[17vh] p-2 flex flex-col gap-3'>
                <div className='w-full border-b border-gray-200 pb-1 h-[10] flex items-center justify-between gap-1'>
                    <p className='text-gray-500 font-bold text-[13px]'>Requested By: Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Vehicle Needed: Avanza</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Purpose: Pick up remaining supplies</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Passengers: 6</p>
                </div>

                    <div className='h-full w-full  flex justify-between items-center'>
                     <div className='h-full w-[35vh] flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Pick up at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[17px]'>Amkor Coop P1 Cupang Muntinlupa</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>July, 10 2026</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>09:00AM</p>
                     </div>

                     <div className=' w-[15vh] h-full flex flex-col gap-1 justify-center'>
                        <button className='w-full p-1 bg-green-500 rounded hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Review</p>
                        </button>

                        <button className='w-full p-1 bg-red-500 rounded hover:bg-red-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Reject</p>
                        </button>
                     </div>

                     <div className='h-full w-[35vh]  flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Drop off at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-red-800'>location_on</span>
                                <p className='text-red-800 font-bold text-[17px]'>Amkor P3 Santa Rosa Laguna</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>---</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>---</p>
                     </div>
                    </div>

                    
            </div>
            <div className='bg-white rounded-lg h-[17vh] p-2 flex flex-col gap-3'>
                <div className='w-full border-b border-gray-200 pb-1 h-[10] flex items-center justify-between gap-1'>
                    <p className='text-gray-500 font-bold text-[13px]'>Requested By: Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Vehicle Needed: Avanza</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Purpose: Pick up remaining supplies</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Passengers: 6</p>
                </div>

                    <div className='h-full w-full  flex justify-between items-center'>
                     <div className='h-full w-[35vh] flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Pick up at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[17px]'>Amkor Coop P1 Cupang Muntinlupa</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>July, 10 2026</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>09:00AM</p>
                     </div>

                     <div className=' w-[15vh] h-full flex flex-col gap-1 justify-center'>
                        <button className='w-full p-1 bg-green-500 rounded hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Review</p>
                        </button>

                        <button className='w-full p-1 bg-red-500 rounded hover:bg-red-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Reject</p>
                        </button>
                     </div>

                     <div className='h-full w-[35vh]  flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Drop off at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-red-800'>location_on</span>
                                <p className='text-red-800 font-bold text-[17px]'>Amkor P3 Santa Rosa Laguna</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>---</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>---</p>
                     </div>
                    </div>

                    
            </div>
            <div className='bg-white rounded-lg h-[17vh] p-2 flex flex-col gap-3'>
                <div className='w-full border-b border-gray-200 pb-1 h-[10] flex items-center justify-between gap-1'>
                    <p className='text-gray-500 font-bold text-[13px]'>Requested By: Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Vehicle Needed: Avanza</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Purpose: Pick up remaining supplies</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Passengers: 6</p>
                </div>

                    <div className='h-full w-full  flex justify-between items-center'>
                     <div className='h-full w-[35vh] flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Pick up at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[17px]'>Amkor Coop P1 Cupang Muntinlupa</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>July, 10 2026</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>09:00AM</p>
                     </div>

                     <div className=' w-[15vh] h-full flex flex-col gap-1 justify-center'>
                        <button className='w-full p-1 bg-green-500 rounded hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Review</p>
                        </button>

                        <button className='w-full p-1 bg-red-500 rounded hover:bg-red-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Reject</p>
                        </button>
                     </div>

                     <div className='h-full w-[35vh]  flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Drop off at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-red-800'>location_on</span>
                                <p className='text-red-800 font-bold text-[17px]'>Amkor P3 Santa Rosa Laguna</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>---</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>---</p>
                     </div>
                    </div>

                    
            </div>
            <div className='bg-white rounded-lg h-[17vh] p-2 flex flex-col gap-3'>
                <div className='w-full border-b border-gray-200 pb-1 h-[10] flex items-center justify-between gap-1'>
                    <p className='text-gray-500 font-bold text-[13px]'>Requested By: Paule Kenneth Dela Rosa</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Vehicle Needed: Avanza</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Purpose: Pick up remaining supplies</p>
                    <p className='text-gray-500 font-bold text-[13px]'>Passengers: 6</p>
                </div>

                    <div className='h-full w-full  flex justify-between items-center'>
                     <div className='h-full w-[35vh] flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Pick up at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                <p className='text-blue-800 font-bold text-[17px]'>Amkor Coop P1 Cupang Muntinlupa</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>July, 10 2026</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>09:00AM</p>
                     </div>

                     <div className=' w-[15vh] h-full flex flex-col gap-1 justify-center'>
                        <button className='w-full p-1 bg-green-500 rounded hover:bg-green-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Review</p>
                        </button>

                        <button className='w-full p-1 bg-red-500 rounded hover:bg-red-400 duration-300 transition-colors cursor-pointer'>
                            <p className='text-white font-bold text-[13px]'>Reject</p>
                        </button>
                     </div>

                     <div className='h-full w-[35vh]  flex flex-col items-center justify-center'>
                        <div className='flex flex-col items-center  w-full h-auto'>
                        <p className='text-gray-500 font-bold text-[15px]'>Drop off at:</p>
                            <div className='flex items-center'>
                                <span className='material-symbols-outlined text-red-800'>location_on</span>
                                <p className='text-red-800 font-bold text-[17px]'>Amkor P3 Santa Rosa Laguna</p>
                            </div>
                            <p className='text-gray-900 font-bold text-[15px]'>---</p>
                        </div>
                        <p className='text-gray-500 font-bold text-[15px]'>---</p>
                     </div>
                    </div>

                    
            </div>
        </div>
    </div>
  )
}

export default LoadRequests