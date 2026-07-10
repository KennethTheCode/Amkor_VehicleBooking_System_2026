import React from 'react'
import AmkorLogo from '../../Images/AmkorLogo.png'

function RequestRide() {
  return (
    <div className='w-[60vh] h-screen p-5 border-r border-gray-300'>
        <div className='flex flex-col'>

            {/* Select Location */}
            <h1 className='font-bold text-[15px] text-blue-900'>Select Location</h1>
            <form className='flex flex-col gap-5'>
                <div className='bg-white w-full h-[17vh] shadow-xl p-3 flex gap-3 justify-center items-center'>
                    <div className=''>
                        <div className='text-[14px] font-bold h-full flex flex-col gap-3'>
                            <div className='flex items-center gap-2 border-b border-gray-300 py-3 w-[50vh] cursor-pointer bg-gray-100 p-1'>
                                <span className='material-symbols-outlined text-gray-500'>location_on</span>
                                <input className='w-full outline-none' placeholder='Pick-up Location' />
                            </div>
                            <div className='flex items-center gap-2 border-b border-gray-300 py-3 w-[50vh cursor-pointer bg-gray-100 p-1'>
                                <span className='material-symbols-outlined text-gray-500'>distance</span>
                                <input className='w-full outline-none' placeholder='Drop-off Location' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Select Vehicle */}
                <div>
                    <h1 className='font-bold text-[15px] text-blue-900 mb-2'>Select Vehicle</h1>
                    <div className="w-full overflow-x-auto bg-gray-100">
                        <div className="flex gap-3 w-max  p-2 ">
                            <div className="bg-white h-[20vh] w-[15vh] border border-gray-300 rounded">
                                <div className='h-[15vh] flex items-center justify-center'>
                                    <img src={AmkorLogo} alt="Logo" className='h-[4vh] object-contain' />
                                </div>
                                <div className='flex items-center justify-center'>
                                    <h1 className='font-bold text-[13px] text-blue-900'>Motorcyle</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Select Purpose */}
                <div className='flex items-center gap-2 border-b border-gray-300 py-3 w-[55vh] cursor-pointer bg-gray-100 px-1'>
                    <input 
                    placeholder='Purpose of request'
                    className='w-full px-2 text-gray-900 font-bold'>
                    </input>
                </div>
                <div className='flex items-center gap-2 border-b border-gray-300 py-3 w-[55vh] cursor-pointer bg-gray-100 p-1'>
                    <input
                    className='w-full px-2 text-gray-900 font-bold'
                    type='date'>

                    </input>
                </div>
                <button 
                type='submit'
                className='bg-blue-900 p-3 rounded hover:bg-blue-800 transition-colors duration-300'>
                    <h1 className='font-bold text-[15px] text-white mb-2'>
                        Request Vehicle
                    </h1>
                </button>
            </form>
        </div>
    </div>
  )
}

export default RequestRide