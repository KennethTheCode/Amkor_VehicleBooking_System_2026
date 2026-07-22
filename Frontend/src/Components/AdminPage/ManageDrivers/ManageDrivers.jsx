import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import Dashboard from "../Dashboard";
import AddDrivers from "./AddDrivers";
import SearchDrivers from "./SearchDrivers";
import AmkorLogo from "../../../Images/AmkorLogo.png";

import { API_BASE } from '../../../config'
import DisableDrivers from "./DisableDrivers";
import UpdateDrivers from "./UpdateDrivers";

function ManageDrivers({ drivers = null }) {
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const BACKEND_URL =
        (typeof import.meta !== "undefined" &&
            import.meta.env &&
            import.meta.env.VITE_BACKEND_URL) ||
        `${API_BASE}/ManageDrivers/LoadDrivers.php`;

    const loadDrivers = () => {
        setIsSearching(true);

        if (Array.isArray(drivers) && drivers.length > 0) {
            setData(drivers);
            setIsSearching(false);
            return;
        }

        fetch(BACKEND_URL, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                if (Array.isArray(json)) {
                    setData(json);
                } else {
                    setData([]);
                }

                setIsSearching(false);
            })
            .catch((err) => {
                console.error("Failed to fetch drivers:", err);
                setIsSearching(false);
            });
    };

    useEffect(() => {
        loadDrivers();
    }, [drivers]);

    return (
        <div>
            <Navbar />

            <div className="bg-gray-100 px-2 flex flex-col sm:px-[20vh] pt-3 py-4 h-screen  gap-3">

                <Dashboard />

                <div className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">

                    <div className="bg-gray-200 w-[45vh] sm:w-[250vh] h-full p-3">

                        <div className="bg-white w-full h-full rounded p-3 overflow-y-auto">

                            <SearchDrivers
                                onSearch={(results) => {
                                    setData(Array.isArray(results) ? results : []);
                                    setIsSearching(false);
                                }}
                            />

                            {isSearching ? (
                                <p className="text-center mt-5 font-bold">
                                    Loading...
                                </p>
                            ) : data.length === 0 ? (
                                <p className="text-center mt-5 font-bold text-gray-500">
                                    No drivers found.
                                </p>
                            ) : (
                                data.map((driver) => (
                                    <div
                                        key={driver.id}
                                        className="w-full flex flex-col justify-between  p-3 bg-gray-100 rounded mb-3"
                                    >
                                        <div className="flex">
                                        <div className="flex gap-3 sm:gap-5">

                                            <div className="flex flex-col items-center justify-center ">

                                                <div className="w-[7vh] h-[7vh]  sm:w-20 h-20 rounded-full border-4 border-gray-500 overflow-hidden">
                                                     {/* fix api */}
                                                    <img
                                                        src={
                                                            driver.picture
                                                                ? `http://localhost/Amkor_VehicleBooking_System_2026/Backend/${driver.picture}`
                                                                : AmkorLogo
                                                        }
                                                        alt={driver.username}
                                                        className="w-full h-full object-cover"
                                                    />

                                                </div>


                                            </div>
                                            <div className="pt-2 mr-2 sm:mr-5">

                                                <p className="text-gray-400 font-bold text-[10px] sm:text-sm">
                                                    Username
                                                </p>

                                                <p className="text-gray-700 font-bold text-[10px] sm:text-sm">
                                                    {driver.username}
                                                </p>

                                                <p className="text-gray-400 font-bold mt-2 text-[10px] sm:text-sm ">
                                                    Password
                                                </p>

                                                <p className="text-gray-700 font-bold text-[10px] sm:text-sm">
                                                    {driver.password}
                                                </p>

                                            </div>
                                                                                    

                                        </div>

                                          <div className="h-full flex flex-col justify mr-2 sm:mr-5">
                                                <p className="text-gray-400 font-bold mt-2 text-[10px] sm:text-sm ">
                                                    License No.
                                                </p>

                                                <p className="text-gray-700 font-bold text-[10px] sm:text-sm">
                                                    {driver.license_no}
                                                </p>

                                                <p className="text-gray-400 font-bold mt-2 text-[10px] sm:text-sm">
                                                    Expiration
                                                </p>

                                                <p className="text-gray-700 font-bold text-[10px] sm:text-sm">
                                                    {driver.expiration_date}
                                                </p>                                        

                                            </div>

                                                <div className="h-full flex flex-col justify sm:mr-5">
                                                <p className="text-gray-400 font-bold mt-2 text-[10px] sm:text-sm">
                                                    Email
                                                </p>

                                                <p className="text-gray-700 font-bold text-[10px] sm:text-sm">
                                                    {driver.email}
                                                </p>

                                              

                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    Status
                                                </p>

                                                <p className="text-gray-700 font-bold text-[10px] sm:text-sm">
                                                    {driver.status}
                                                </p>

                                            </div>    

                                        <div className="flex flex-col justify-center hidden sm:block">

                                            <UpdateDrivers
                                                id={driver.id}
                                                drivers={driver}
                                                onUpdated={(id, updatedFields) =>
                                                    setData((prev) =>
                                                        prev.map((d) =>
                                                            d.id === id ? { ...d, ...updatedFields } : d
                                                        )
                                                    )
                                                }
                                            />

                                            <DisableDrivers
                                                id={driver.id}
                                                drivers={driver}
                                                onStatusChanged={(id, newStatus) =>
                                                    setData((prev) =>
                                                        prev.map((d) =>
                                                            d.id === id ? { ...d, status: newStatus } : d
                                                        )
                                                    )
                                                }
                                            />

                                        </div>
                                        </div>
                                        <div className="flex justify-center pgap-2 sm:hidden">

                                            <UpdateDrivers
                                                id={driver.id}
                                                drivers={driver}
                                                onUpdated={(id, updatedFields) =>
                                                    setData((prev) =>
                                                        prev.map((d) =>
                                                            d.id === id ? { ...d, ...updatedFields } : d
                                                        )
                                                    )
                                                }
                                            />

                                            <DisableDrivers
                                                id={driver.id}
                                                drivers={driver}
                                                onStatusChanged={(id, newStatus) =>
                                                    setData((prev) =>
                                                        prev.map((d) =>
                                                            d.id === id ? { ...d, status: newStatus } : d
                                                        )
                                                    )
                                                }
                                            />

                                        </div>
                                    </div>
                                    
                                ))
                            )}

                        </div>

                    </div>

                    <AddDrivers onDriverAdded={loadDrivers} />

                </div>

            </div>
        </div>
    );
}

export default ManageDrivers;