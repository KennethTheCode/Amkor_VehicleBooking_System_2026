import React from 'react'
import Navbar from '../Components/Navbar.jsx'
import RequestRide from '../Components/LandingPage/RequestRide.jsx'
import Map from '../Components/LandingPage/Map.jsx'

function UserPage() {
  return (
    <div>
        <Navbar/>
        <div className='flex'>
        <RequestRide user={loggedInUser}/>
        <Map/>

        </div>
    </div>
  )
}

export default UserPage