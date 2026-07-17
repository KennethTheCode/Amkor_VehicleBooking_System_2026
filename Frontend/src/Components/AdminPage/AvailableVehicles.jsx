import React from "react";
import AmkorLogo from "../../Images/AmkorLogo.png";

function AvailableVehicles({ vehicles }) {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-2">

            <p className="text-blue-800 font-bold text-[15px]">
                Available Vehicles
            </p>

            <div className="bg-gray-100 w-[30vh] h-[13vh] p-1 flex overflow-x-auto gap-4">

                {vehicles
                    .filter((vehicle) => vehicle.availability == 1)
                    .map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="text-center w-[10vh] h-full flex flex-col items-center"
                        >
                            <div className="bg-white w-[8vh] h-[8vh] rounded-full flex items-center justify-center border-2 border-blue-500 overflow-hidden">

                                <img
                                    src={
                                        vehicle.image
                                            ? `http://amkor-vehicle-booking-system-2026.ct.ws/Backend/${vehicle.image}`
                                            : AmkorLogo
                                    }
                                    alt={vehicle.vehicle_model}
                                    className="w-full h-full object-contain"
                                />

                            </div>

                            <p className="text-blue-800 font-bold text-[10px] mt-1">
                                {vehicle.vehicle_model}
                            </p>
                        </div>
                    ))}

            </div>

            <button className="rounded border-blue-800 border-2 p-2 w-full hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="text-blue-800 font-bold text-[15px]">
                    Vehicle Schedules
                </p>
            </button>

        </div>
    );
}

export default AvailableVehicles;