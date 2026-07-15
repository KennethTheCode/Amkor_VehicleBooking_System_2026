import React from 'react'
import AmkorLogo from '../Images/AmkorLogo.png'

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className='h-[7vh] border-b border-gray-300 bg-gray-100 shadow flex justify-between sticky top-0 z-50'>

            <div className='w-[20vh] h-full flex items-center justify-center'>
                <img
                    src={AmkorLogo}
                    alt="Logo"
                    className='h-[4vh] object-contain'
                />
            </div>

            <div className='w-[30vh] h-full p-1 flex justify-center items-center gap-3'>

                <div className='text-right'>
                    <p className='font-bold text-[12px]'>
                        Welcome Back!
                    </p>

                    <p className='text-[13px] text-blue-900 font-bold'>
                        {user?.username}
                    </p>

                </div>

                <div className='border-2 w-[6vh] h-[6vh] rounded-full flex items-center justify-center overflow-hidden'>
                    <img
                        src={
                            user?.picture
                                ? `http://localhost/Amkor_VehicleBooking_System_2026/Backend/${user.picture}`
                                : AmkorLogo
                        }
                        alt="Profile"
                        className='w-full h-full object-cover'
                    />
                </div>

            </div>

        </div>
    );
}

export default Navbar;