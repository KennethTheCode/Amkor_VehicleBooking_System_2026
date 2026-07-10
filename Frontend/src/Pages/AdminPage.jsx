import React from 'react'
import Navbar from '../Components/Navbar'
import LoadRequests from '../Components/AdminPage/LoadRequests'
import Dashboard from '../Components/AdminPage/Dashboard'
import SideNavigation from '../Components/AdminPage/SideNavigation'

function Admin() {
  return (
    <div>
      <Navbar/>
      <div className='bg-gray-100 px-[20vh] pt-3  py-4 h-screen flex flex-col gap-3'>
        <Dashboard/>
        <div className='flex items-center justify-center gap-5'>
          <SideNavigation/>
          <LoadRequests/>
        </div>
      </div>
    </div>
    
  )
}

export default Admin