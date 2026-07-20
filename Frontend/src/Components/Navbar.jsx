import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AmkorLogo from '../Images/AmkorLogo.png'
import { API_BASE } from '../config'


function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("user")
        // If you store a token separately, clear it too:
        // localStorage.removeItem("token")
        navigate("/")
    }

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className='h-[7vh] border-b border-gray-300 bg-gray-100 shadow flex justify-between sticky top-0 z-50'>

            <div className='w-[20vh] h-full flex items-center justify-center'>
                <img
                    src={AmkorLogo}
                    alt="Logo"
                    className='h-[4vh] object-contain'
                />
            </div>

            <div className='relative w-[30vh] h-full p-1 flex justify-center items-center gap-3' ref={dropdownRef}>

                <div
                    className='flex items-center gap-3 cursor-pointer select-none'
                    onClick={() => setShowDropdown((prev) => !prev)}
                >
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
                                    ? `${API_BASE}/${user.picture}`
                                    : AmkorLogo
                            }
                            alt="Profile"
                            className='w-full h-full object-cover'
                        />
                    </div>
                </div>

                {showDropdown && (
                    <div className='absolute top-[7vh] right-2 bg-white border border-gray-300 rounded shadow-md w-40 py-1 z-50'>
                        <button
                            onClick={handleLogout}
                            className='w-full text-left px-4 py-2 text-sm font-semibold hover:bg-gray-100 transition-colors cursor-pointer'
                        >
                            Logout
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Navbar;