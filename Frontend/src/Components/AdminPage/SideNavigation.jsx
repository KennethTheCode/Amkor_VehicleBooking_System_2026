import React, { useState, useEffect } from "react";
import OngoingVehicles from "./OngoingVehicles";
import AvailableDrivers from "./AvailableDrivers";
import AvailableVehicles from "./AvailableVehicles";

function SideNavigation() {
    const [showModal, setShowModal] = useState(false);
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

    return (
        <div className="bg-white shadow-lg h-[80vh] w-[45vh] flex flex-col items-center">

            <button
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center bg-blue-900 p-2 w-full hover:bg-blue-800 transition-colors duration-300 cursor-pointer"
            >
                <p className="text-white font-bold text-[18px]">
                    View History
                </p>
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black/20">
                </div>
            )}

            <OngoingVehicles />

            <div className="flex flex-col gap-3 p-5 w-full">
                <AvailableDrivers />

                <AvailableVehicles vehicles={vehicles} />
            </div>

        </div>
    );
}

export default SideNavigation;