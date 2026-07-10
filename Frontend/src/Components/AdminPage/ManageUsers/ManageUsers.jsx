import React from 'react'
import Navbar from '../../Navbar'
import Dashboard from '../Dashboard'
import AddUsers from './AddUsers'
import SearchUsers from './SearchUsers'

function ManageUsers() {
  return (
    <div>
      <Navbar/>
      <div className='bg-gray-100 px-[20vh] pt-3  py-4 h-screen flex flex-col gap-3'>
        <Dashboard/>
        <div className='w-full h-[75vh] flex gap-3 items-center justify-center'>
            <div className='bg-gray-200 w-full h-full p-3'>
                <div className='bg-white w-[100%] h-full rounded p-3'>
                    <SearchUsers/>
                    <table className='bg-gray-200 w-full h-[15vh] rounded p-1'>
                    </table>
                </div>
            </div>
            <AddUsers/>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers