import React from 'react'

function AddDrivers() {
    
  return (
    <div className='bg-white w-[50vh] h-full p-3'>
        <div className=''>
            <form>
                <h1 className='text-gray-800 font-bold text-[20px] mb-5'>Register Drivers</h1>
                <p className='text-gray-800 font-bold text-[15px]'>Enter Username</p>
                <input
                placeholder='Username'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Password</p>
                <input
                placeholder='Password'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter License No.</p>
                <input
                placeholder='License No.'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Upload Driver's License</p>
                <input
                placeholder='Drivers License'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Expiration Date</p>
                <input
                placeholder='Expiration Date'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Upload 2x2 picture</p>
                <input
                type='file'
                placeholder='2x2 picture'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>
            
                <button className='bg-blue-900 text-white font-bold text-[15px] p-3 rounded w-full'>
                    Register
                </button>
            </form>

            
        </div>
    </div>
  )
}

export default AddDrivers