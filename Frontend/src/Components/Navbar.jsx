import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AmkorLogo from '../Images/AmkorLogo.png'
import { API_BASE } from '../config'


function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()

    // ---- Vehicle alerts (admin-only) --------------------------------
    const isAdmin = user?.account_type === "Admin";
    const [alerts, setAlerts] = useState([]);
    const [showAlerts, setShowAlerts] = useState(false);
    const alertsRef = useRef(null);

    useEffect(() => {
        if (!isAdmin) return;
//fix api
        const fetchAlerts = () => {
            fetch(`http://localhost/Amkor_VehicleBooking_System_2026/Backend/Getvehiclealrts.php`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) setAlerts(data.alerts);
                })
                .catch((err) => console.error(err));
        };

        fetchAlerts();
        // Refresh every 5 minutes so the badge doesn't go stale on a long session
        const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [isAdmin]);

    // Close the alerts panel when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (alertsRef.current && !alertsRef.current.contains(e.target)) {
                setShowAlerts(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])
    // -------------------------------------------------------------------

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
        <div className='h-[7vh]  p-4 sm:p-0 border-b border-gray-300 bg-gray-100 shadow flex justify-between sticky top-0 z-50'>

            <div className='w-[10vh] sm:w-[20vh] h-full flex items-center justify-center'>
                <img
                    src={AmkorLogo}
                    alt="Logo"
                    className='h-[4vh] object-contain'
                />
            </div>

            <div className='flex items-center gap-2 pr-3'>

                {isAdmin && (
                    <div className='relative' ref={alertsRef}>
                        <button
                            onClick={() => setShowAlerts((prev) => !prev)}
                            className='relative p-2 rounded-full hover:bg-gray-200 duration-200 cursor-pointer'
                            aria-label="Vehicle alerts"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-6 h-6 text-gray-700"
                            >
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>

                            {alerts.length > 0 && (
                                <span className='absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                    {alerts.length > 9 ? "9+" : alerts.length}
                                </span>
                            )}
                        </button>

                        {showAlerts && (
                            <div className='absolute right-[-15vh] sm:right-[-20vh] sm:left-[0vh] top-[6vh] z-100  bg-white border border-gray-300 rounded shadow-md w-80 max-h-[60vh] overflow-y-auto z-50'>
                                <div className='px-4 py-2 border-b border-gray-200 font-bold text-sm text-blue-900'>
                                    Vehicle Alerts
                                </div>

                                {alerts.length === 0 ? (
                                    <p className='px-4 py-6 text-center text-sm text-gray-400'>
                                        No alerts right now.
                                    </p>
                                ) : (
                                    alerts.map((alert, idx) => (
                                        <div
                                            key={`${alert.id}-${alert.type}-${idx}`}
                                            className='px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50'
                                        >
                                            <p className='text-sm font-semibold text-gray-800'>
                                                {alert.vehicle_model}
                                            </p>
                                            <p className={`text-xs mt-0.5 ${
                                                alert.type === "balance"
                                                    ? "text-orange-600"
                                                    : "text-red-600"
                                            }`}>
                                                {alert.message}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className='relative w-[13vh] sm:w-[30vh] h-full p-1 flex justify-center items-center gap-3' ref={dropdownRef}>

                    <div
                        className='flex items-center gap-3 cursor-pointer select-none'
                        onClick={() => setShowDropdown((prev) => !prev)}
                    >
                        <div className='text-right'>
                            <p className='font-bold text-[10px] sm:text-[12px]'>
                                Welcome Back!
                           </p>

                            <p className='text-[10px] sm:text-[13px] text-blue-900 font-bold'>
                                {user?.username}
                            </p>
                        </div>

                        <div className='border-2 w-[7vh] h-[4vh] sm:w-[6vh] h-[6vh] rounded-full flex items-center justify-center overflow-hidden'>
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

        </div>
    );
}

export default Navbar;