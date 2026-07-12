import React from 'react'
import Navbar from '../../Navbar'
import AddVehicles from './AddVehicles'
import SearchVehicles from './SearchVehicles'
import Dashboard from '../Dashboard'

function ManageVehicles() {
  return (
    <div>
        <Navbar></Navbar>
        <div className='bg-gray-100 px-[20vh] pt-3  py-4 h-screen flex flex-col gap-3'>
            <Dashboard/>
            <div className='w-full h-[75vh] flex gap-3 items-center justify-center'>
                <div className='bg-gray-200 w-full h-full p-3'>
                    <div className='bg-white w-[100%] h-full rounded p-3'>
                        <SearchVehicles/>
                        <div className="w-full flex justify-between  h-[15vh] p-2 bg-gray-200 rounded">
                                <div className="h-full w-[20vh] gap-2 flex flex-col items-center justify-center">
                                    <div className="border-3 border-blue-400 w-[10vh] rounded-full h-[70%]">
                                        
                                    </div>
                                        <p className="text-gray-500 font-bold text-[15px]">Account Type: Admin</p>
                                </div>
                                <div className="flex flex-col  items-center">
                                    <p className="text-gray-400 font-bold text-[13px]">ID: 1</p>
                                    <p className="text-gray-500 font-bold text-[15px]">USR: Paule Kenneth Dela Rosa</p>
                                    <p className="text-gray-500 font-bold text-[15px]">PSW: Paule Kenneth Dela Rosa</p>
                                </div>                            
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <button className="bg-green-500 p-3 w-[10vh] text-white font-bold text-[13px] rounded hover:bg-green-400 cursor-pointer duration-300 transition-colors"> Edit</button>
                                    <button className="bg-red-500 p-3 w-[10vh] text-white font-bold text-[13px] rounded hover:bg-red-400 cursor-pointer duration-300 transition-colors"> Delete</button>
                                </div>
                            </div>
                    </div>
                </div>
                    <AddVehicles/>
            </div>
        </div>
    </div>
  )
}

export default ManageVehicles