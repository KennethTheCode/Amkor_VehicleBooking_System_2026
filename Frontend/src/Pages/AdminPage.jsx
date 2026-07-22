import React from 'react'
import Navbar from '../Components/Navbar'
import LoadRequests from '../Components/AdminPage/LoadRequests'
import Dashboard from '../Components/AdminPage/Dashboard'
import SideNavigation from '../Components/AdminPage/SideNavigation'

function Admin() {
  return (
    <div>
      <Navbar/>
      <div className='bg-gray-100 px-5 sm:px-[20vh] pt-3  py-4  sm:h-screen flex flex-col gap-3'>
        <Dashboard/>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
          <SideNavigation/>
          <LoadRequests/>
        </div>
      </div>
    </div>
    
  )
}

export default Admin