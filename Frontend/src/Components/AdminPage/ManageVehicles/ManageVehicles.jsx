import React, { useState, useEffect } from "react";
import Navbar from "../../Navbar";
import AddVehicles from "./AddVehicles";
import SearchVehicles from "./SearchVehicles";
import Dashboard from "../Dashboard";
import AmkorLogo from "../../../Images/AmkorLogo.png";
import EditVehicle from "./EditVehicle";
import DisableVehicles from "./DisableVehicles";

import { API_BASE } from '../../../config'

function ManageVehicles({ vehicles = null }) {
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [visibleVehicles, setVisibleVehicles] = useState(5);

    const BACKEND_URL =
        (typeof import.meta !== "undefined" &&
            import.meta.env &&
            import.meta.env.VITE_BACKEND_URL) ||
        `${API_BASE}/ManageVehicles/LoadVehicles.php`;

    const loadVehicle = () => {
        setIsSearching(true);

        if (Array.isArray(vehicles) && vehicles.length > 0) {
            setData(vehicles);
            setVisibleVehicles(5);
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
                    setVisibleVehicles(5);
                } else {
                    setData([]);
                }

                setIsSearching(false);
            })
            .catch((err) => {
                console.error("Failed to fetch vehicles:", err);
                setIsSearching(false);
            });
    };

    useEffect(() => {
        loadVehicle();
    }, [vehicles]);

    return (
        <div>
            <Navbar />

            <div className="bg-gray-100 px-[1vh] sm:px-[20vh] pt-3 py-4 h-screen flex flex-col gap-3">

                <Dashboard />

                <div className="w-full sm:h-[75vh] flex flex-col sm:flex-row gap-3 items-center justify-center">

                    <div className="bg-gray-200 w-full h-[60vh] sm:h-full p-3">

                        <div className="bg-white w-full h-full overflow-y-auto rounded p-3">

                            <SearchVehicles
                                onSearch={(results) => {
                                    setData(Array.isArray(results) ? results : []);
                                    setVisibleVehicles(5);
                                    setIsSearching(false);
                                }}
                            />

                            {isSearching ? (
                                <p className="text-center mt-5 font-bold">
                                    Loading...
                                </p>
                            ) : data.length === 0 ? (
                                <p className="text-center mt-5 font-bold text-gray-500">
                                    No vehicles found.
                                </p>
                            ) : (
                                <>
                                    {data
                                        .slice(0, visibleVehicles)
                                        .map((vehicle) => (
                                            <div
                                                key={vehicle.id}
                                                className="w-full flex flex-col justify-between  p-2 bg-gray-200 rounded mb-3"
                                            >
                                            <div className="flex">
                                                <div className="flex gap-2 text-[10px] sm:text-[14px] mr-5 sm:mr-0">
                                                    <div className="flex flex-col items-center justify-center ">
                                                        <div className="w-[8vh] h-[8vh] sm:w-[20vh] sm:h-[15vh] rounded-lg border overflow-hidden">
                                                            <img
                                                                src={
                                                                    vehicle.image
                                                                        ? `${API_BASE}/${vehicle.image}`
                                                                        : AmkorLogo
                                                                }
                                                                alt={vehicle.vehicle_model}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col justify-center ">
                                                        <h2 className="font-bold text-lg text-gray-600 text-[10px] sm:text-[14px]">
                                                            {vehicle.vehicle_model}
                                                        </h2>

                                                        <p>
                                                            <strong>Color:</strong> {vehicle.color}
                                                        </p>

                                                        <p>
                                                            <strong>Plate No:</strong> {vehicle.platenumber}
                                                        </p>

                                                        <p>
                                                            <strong>Seats:</strong> {vehicle.seater}
                                                        </p>

                                                        <p>
                                                            <strong>Availability:</strong>{" "}
                                                            {vehicle.availability == 1
                                                                ? "Available"
                                                                : "Unavailable"}
                                                        </p>
                                                    </div>

                                                </div>

                                                <div className="w-auto flex gap-3">

                                                    <div className="h-[10vh] w-[10vh] mt-5 sm:mt-0 sm:ml-5 sm:h-[13vh] sm:w-[10vh] rounded-lg border p-1 flex justify-center items-center overflow-hidden">
                                                        <img
                                                            src={
                                                                vehicle.orcr
                                                                    ? `${API_BASE}/${vehicle.orcr}`
                                                                    : AmkorLogo
                                                            }
                                                            alt={vehicle.vehicle_model}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col justify-center text-[10px] sm:text-[14px]">
                                                        <p>
                                                            <strong>Expiration:</strong>{" "}
                                                            {vehicle.expiration}
                                                        </p>

                                                        

                                                        <p>
                                                            {/* Threshold*/}
                                                            <strong>RFID Balance:</strong>{" "}
                                                            <span
                                                                className={
                                                                    Number(vehicle.rfid_balance) <= 500
                                                                        ? "text-red-500 font-semibold"
                                                                        : Number(vehicle.rfid_balance) <= 1000
                                                                        ? "text-yellow-600 font-semibold"
                                                                        : "text-green-500"
                                                                }
                                                            >
                                                                ₱{vehicle.rfid_balance}
                                                            </span>
                                                        </p>

                                                        <p>
                                                            <strong>Status:</strong>{" "}
                                                            <span className=
                                                            {vehicle.status === "Enabled" 
                                                            ? "text-green-500": "text-red-500"}>
                                                                {vehicle.status}
                                                            </span>                                                                                                                       
                                                        </p>
                                                    </div>

                                                </div>

                                                <div className="flex flex-col gap-3 hidden sm:ml-5 sm:block">

                                                    <EditVehicle
                                                        id={vehicle.id}
                                                        vehicles={vehicle}
                                                        onUpdated={(id, updatedFields) =>
                                                            setData((prev) =>
                                                                prev.map((v) => (v.id === id ? { ...v, ...updatedFields } : v))
                                                            )
                                                        }
                                                    />

                                                    <DisableVehicles
                                                        id={vehicle.id}
                                                        vehicles={vehicle}
                                                        onStatusChanged={(id, newStatus) =>
                                                            setData((prev) =>
                                                                prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
                                                            )
                                                        }
                                                    />

                                                </div>
                                            </div>
                                            <div className="flex gap-3 sm:hidden">

                                                    <EditVehicle
                                                        id={vehicle.id}
                                                        vehicles={vehicle}
                                                        onUpdated={(id, updatedFields) =>
                                                            setData((prev) =>
                                                                prev.map((v) => (v.id === id ? { ...v, ...updatedFields } : v))
                                                            )
                                                        }
                                                    />

                                                    <DisableVehicles
                                                        id={vehicle.id}
                                                        vehicles={vehicle}
                                                        onStatusChanged={(id, newStatus) =>
                                                            setData((prev) =>
                                                                prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
                                                            )
                                                        }
                                                    />

                                                </div>
                                            </div>
                                        ))}

                                    {visibleVehicles < data.length && (
                                        <div className="flex justify-center mt-5">
                                            <button
                                                onClick={() =>
                                                    setVisibleVehicles(
                                                        (prev) => prev + 5
                                                    )
                                                }
                                                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded font-bold"
                                            >
                                                Load More
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                        </div>

                    </div>

                    <AddVehicles onVehicleAdded={loadVehicle} />

                </div>

            </div>
        </div>
    );
}

export default ManageVehicles;