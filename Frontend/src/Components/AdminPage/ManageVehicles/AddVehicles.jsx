import React from 'react'

function AddVehicles() {
  return (
<div className='bg-white w-[50vh] h-full p-3'>
        <div className=''>
            <form>
                <h1 className='text-gray-800 font-bold text-[20px] mb-5'>Register Vehicles</h1>
                <p className='text-gray-800 font-bold text-[15px]'>Enter Vehicle Model</p>
                <input
                placeholder='Enter Vehicle Model'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Color</p>
                <input
                placeholder='Enter Color'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Plate Number</p>
                <input
                minLength={7}
                maxLength={7}
                placeholder='Enter plate number'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Expiration </p>
                <input
                type='date'
                placeholder='Enter Expiration'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Upload OR/CR </p>
                <input
                type='file'
                placeholder='Upload OR/CR'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Upload Image </p>
                <input
                type='file'
                placeholder='Upload Vehicle Image'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>
                
                <p className='text-gray-800 font-bold text-[15px]'>Number of Seater </p>
                <input
                type='number'
                placeholder='Enter number of Seater'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <button className='bg-blue-900 text-white font-bold text-[15px] p-3 rounded w-full hover:bg-blue-800 duration-300 transition-colors'>
                    Register
                </button>
            </form>

            
        </div>
    </div>
      )
}

export default AddVehicles