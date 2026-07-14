import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import Dashboard from "../Dashboard";
import AddDrivers from "./AddDrivers";
import SearchDrivers from "./SearchDrivers";
import AmkorLogo from "../../../Images/AmkorLogo.png";

function ManageDrivers({ drivers = null }) {
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const BACKEND_URL =
        (typeof import.meta !== "undefined" &&
            import.meta.env &&
            import.meta.env.VITE_BACKEND_URL) ||
        "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageDrivers/LoadDrivers.php";

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

            <div className="bg-gray-100 px-[20vh] pt-3 py-4 h-screen flex flex-col gap-3">

                <Dashboard />

                <div className="w-full h-[75vh] flex gap-3 items-center justify-center">

                    <div className="bg-gray-200 w-full h-full p-3">

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
                                        key={driver.driver_id}
                                        className="w-full flex justify-between h-[15vh] p-3 bg-gray-200 rounded mb-3"
                                    >
                                        <div className="flex gap-5">

                                            <div className="flex flex-col items-center justify-center">

                                                <div className="w-20 h-20 rounded-full border-4 border-gray-500 overflow-hidden">

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
                                            <div className="pt-2">

                                                <p className="text-gray-400 font-bold text-sm">
                                                    Username
                                                </p>

                                                <p className="text-gray-700 font-bold">
                                                    {driver.username}
                                                </p>

                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    Password
                                                </p>

                                                <p className="text-gray-700 font-bold">
                                                    {driver.password}
                                                </p>

                                            </div>
                                                                                    

                                        </div>

                                          <div className="h-full flex flex-col justify">
                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    License No.
                                                </p>

                                                <p className="text-gray-700 font-bold">
                                                    {driver.license_no}
                                                </p>

                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    Expiration
                                                </p>

                                                <p className="text-gray-700 font-bold">
                                                    {driver.expiration_date}
                                                </p>

                                            </div>  

                                        <div className="flex flex-col justify-center gap-2">

                                            <button className="bg-green-500 hover:bg-green-400 duration-300 text-white rounded px-5 py-2 font-bold">
                                                Edit
                                            </button>

                                            <button className="bg-red-500 hover:bg-red-400 duration-300 text-white rounded px-5 py-2 font-bold">
                                                Delete
                                            </button>

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