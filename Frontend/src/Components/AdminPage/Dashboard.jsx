import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const navigate = useNavigate()
    // Load Vehicles
    const [vehicles, setVehicles] = useState([]);
    useEffect(() => {
        fetch(
            "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageVehicles/LoadVehicles.php",
            {
                cache: "no-store",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setVehicles(data);
                } else {
                    setVehicles([]);
                }
            })
            .catch((err) => console.error(err));
    }, []);    

    const availableVehicles = vehicles.filter(
            vehicle => Number(vehicle.availability) === 1
        ).length;

    // Load Drivers
    const [drivers, setDrivers] = useState([]);
    useEffect(() => {
        fetch(
            "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageDrivers/LoadDrivers.php",
            {
                cache: "no-store",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setDrivers(data);
                } else {
                    setDrivers([]);
                }
            })
            .catch((err) => console.error(err));
    }, []);    

    const availableDrivers = drivers.filter(
            driver => Number(driver.availability) === 1
        ).length;

    // Load Requests
    const [requests, setRequests] = useState([]);
    useEffect(() => {
        fetch(
            "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageRequests/LoadRequests.php",
            {
                cache: "no-store",
            }
        )
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setRequests(data);
                } else {
                    setRequests([]);
                }
            })
            .catch((err) => console.error(err));
    }, []);    

    const ongoingRequests = requests.filter(
            request => request.status === "Ongoing"
        ).length;
    
    const pendingRequests = requests.filter(
            request => request.status === "Pending"
    ).length;

  return (
    <div>
        <div className='w-full py-2 h-[10vh] flex items-center justify-between rounded-lg border-2 border-gray-300 p-2'>
                <div className=' rounded-full w-[25vh] h-full flex flex-col items-center justify-center'>
                    <p className='text-gray-500 font-bold text-[35px]'>{availableVehicles}</p>
                    <p className='text-gray-500 font-bold text-[15px]'>Available Vehicles</p>
                </div>
            <div className=' rounded-full w-[25vh] h-full flex flex-col items-center justify-center'>
                <p className='text-gray-500 font-bold text-[35px]'>{availableDrivers}</p>
                <p className='text-gray-500 font-bold text-[15px]'>Available Drivers</p>
            </div>

            <div className=' rounded-full w-[25vh] h-full flex flex-col items-center justify-center'>
                <p className='text-gray-500 font-bold text-[35px]'>{ongoingRequests}</p>
                <p className='text-gray-500 font-bold text-[15px]'>Ongoing Requests</p>
            </div>

             <div className=' rounded-full w-[25vh] h-full flex flex-col items-center justify-center'>
                <p className='text-gray-500 font-bold text-[35px]'>{pendingRequests}</p>
                <p className='text-gray-500 font-bold text-[15px]'>Pending Requests</p>
            </div>
        </div>
        <div className='w-full h-[2vh] mt-2 flex gap-1 flex justify-between'>
            <div className='flex'>
                <div 
                onClick={() => navigate('/manageusers')}
                className='border-r-2 border-gray-400 px-1'>
                    <p className='text-gray-500 font-bold text-[12px] hover:text-gray-400 duration-300 transition-colors cursor-pointer'>Manage Users</p>
                </div>
                <div className='border-r-2 border-gray-400 px-1'>
                    <p 
                    onClick={() => navigate('/managedrivers')}
                    className='text-gray-500 font-bold text-[12px] hover:text-gray-400 duration-300 transition-colors cursor-pointer'>Manage Drivers</p>
                </div>
                <div className=' px-1'>
                    <p 
                    onClick={() => navigate('/managevehicles')}
                    className='text-gray-500 font-bold text-[12px] hover:text-gray-400 duration-300 transition-colors cursor-pointer'>Manage Vehicles</p>
                </div>
            </div>
             <div className='flex'>
                <div className='px-1'>
                    <p 
                    onClick={() => navigate('/admin')}
                    className='text-gray-500 font-bold text-[12px] hover:text-gray-400 duration-300 transition-colors cursor-pointer'>Manage Requests</p>
                </div>
                
            </div>
            
        </div>
    </div>
    
  )
}

export default Dashboard