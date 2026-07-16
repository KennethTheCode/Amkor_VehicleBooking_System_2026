import React from "react";
import AmkorLogo from "../../Images/AmkorLogo.png";

function AvailableDrivers({ drivers }) {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-2">

            <p className="text-blue-800 font-bold text-[15px]">
                Available Vehicles
            </p>

            <div className="bg-gray-100 w-[30vh] h-[13vh] p-1 flex overflow-x-auto gap-5">

                {drivers
                    .filter((drivers) => drivers.availability == 1)
                    .map((drivers) => (
                        <div
                            key={drivers.id}
                            className="text-center w-[10vh] h-full flex flex-col items-center justify-center"
                        >
                            <div className="bg-white w-[7vh] h-[7vh] rounded-full flex items-center justify-center border-2 border-blue-500 overflow-hidden">

                                <img
                                    src={
                                        drivers.picture
                                            ? `http://localhost/Amkor_VehicleBooking_System_2026/Backend/${drivers.picture}`
                                            : AmkorLogo
                                    }
                                    className="w-full h-full object-contain"
                                />

                            </div>

                            <p className="text-blue-800 truncate w-[8vh] font-bold text-[10px] mt-1">
                                {drivers.username}
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

export default AvailableDrivers;