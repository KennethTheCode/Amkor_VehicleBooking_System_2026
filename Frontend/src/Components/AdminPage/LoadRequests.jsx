import React, { useEffect, useState } from "react";
import FilterRequests from "./FilterRequests/FilterRequests";

function LoadRequests({ requests = null }) {
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const BACKEND_URL =
        "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageRequests/LoadRequests.php";

    const loadRequests = () => {
        setIsSearching(true);

        if (Array.isArray(requests) && requests.length > 0) {
            setData(requests);
            setIsSearching(false);
            return;
        }

        fetch(BACKEND_URL, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                setData(Array.isArray(json) ? json : []);
                setIsSearching(false);
            })
            .catch((err) => {
                console.error(err);
                setIsSearching(false);
            });
    };

    useEffect(() => {
        loadRequests();
    }, [requests]);

    return (
        <div className="h-[80vh] w-full flex flex-col overflow-y-auto">

            <div className="flex justify-between items-center p-1">
                <p className="text-gray-500 font-bold text-[15px]">
                    Ticket Count: {data.length}
                </p>

                <FilterRequests />
            </div>

            <div className="w-full py-1 flex flex-col gap-3">

                {isSearching ? (

                    <p className="text-center font-bold">
                        Loading...
                    </p>

                ) : data.length === 0 ? (

                    <p className="text-center font-bold text-gray-500">
                        No Requests Found
                    </p>

                ) : (

                    data.map((request) => (

                        <div
                            key={request.ticket_id}
                            className="bg-white rounded-lg h-[20vh] p-2 flex flex-col "
                        >

                            <div className="w-full border-b border-gray-200 pb-1 flex justify-between">
                                <p className="text-gray-500 font-bold text-[13px]">
                                    Ticket ID: {request.ticket_id}
                                </p>

                                <p className="text-gray-500 font-bold text-[13px]">
                                    Requested By: {request.username}
                                </p>

                                <p className="text-gray-500 font-bold text-[13px]">
                                    Vehicle Needed: {request.vehicle_model}
                                </p>

                                <p className="text-gray-500 font-bold text-[13px]">
                                    Purpose: {request.created_at}
                                </p>

                            </div>

                            <div className="flex justify-between h-full">

                                {/* Pickup */}
                                <div className="w-[35vh] flex flex-col justify-center items-center">

                                    <p className="text-gray-500 font-bold">
                                        Pick up at:
                                    </p>

                                    <div className="flex items-center">

                                        <span className="material-symbols-outlined text-blue-800">
                                            location_on
                                        </span>

                                        <p className="text-blue-800 font-bold">
                                            {request.pick_up}
                                        </p>

                                    </div>

                                    <p className="font-bold">
                                        {request.date_needed}
                                    </p>

                                    <p className="text-gray-500">
                                        {request.time_needed}
                                    </p>

                                </div>

                               

                                {/* Drop Off */}
                                <div className="w-[35vh] flex flex-col justify-center items-center py-3">

                                    <p className="text-gray-500 font-bold">
                                        Drop off at:
                                    </p>

                                    <div className="flex items-center">

                                        <span className="material-symbols-outlined text-red-800">
                                            location_on
                                        </span>

                                        <p className="text-red-800 font-bold">
                                            {request.drop_off}
                                        </p>
                                        

                                    </div>
                                        <p className="text-gray-500 font-bold">--</p>
                                        <p className="text-gray-400 ">--</p>
                                </div>
                                {/* Buttons */}
                                <div className="w-[15vh] flex flex-col justify-center gap-2">
                                    <button className="bg-green-500 hover:bg-green-400 duration-300 text-white font-bold rounded cursor-pointer">
                                        Review
                                    </button>

                                    <button className="bg-red-500 hover:bg-red-400 duration-300 text-white font-bold rounded cursor-pointer">
                                        Reject
                                    </button>

                                </div>
                            </div>
                                <div
                                    className={`text-center font-bold rounded 
                                        ${
                                            request.status === "Approved"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : request.status === "Rejected"
                                                ? "bg-red-100 text-red-700 border border-red-200"
                                                : request.status === "Pending"
                                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                                : "bg-gray-100 text-gray-700 border border-gray-200"
                                        }`}
                                >
                                    <p>{request.status}</p>
                                </div>
                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default LoadRequests;