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
                        <table className='bg-gray-200 w-full h-[15vh] rounded p-1'>
                        </table>
                    </div>
                </div>
                    <AddVehicles/>
            </div>
        </div>
    </div>
  )
}

export default ManageVehicles