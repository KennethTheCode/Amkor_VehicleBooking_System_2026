import React, { useEffect, useState } from "react";
import FilterRequests from "./FilterRequests/FilterRequests";
import ReviewRequests from "./ManageRequests/ReviewRequests";
import RejectRequests from "./ManageRequests/RejectRequests";
import ExportXSLX from "../Export/ExportXSLX";
import ExportToday from "../Export/ExportToday";

import { API_BASE } from '../../config'

function LoadRequests({ requests = null }) {
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filter, setFilter] = useState("");

    const BACKEND_URL =
        `${API_BASE}/ManageRequests/LoadRequests.php`;
    const FILTER_URL =
        `${API_BASE}/ManageRequests/FilterRequests.php`;

    // Hide tickets that are already Finished or Ongoing
    const filterOutCompleted = (list) =>
        list.filter(
            (r) => r.status !== "Finished" && r.status !== "Ongoing"
        );

    const loadRequests = () => {
        setIsSearching(true);

        if (Array.isArray(requests) && requests.length > 0) {
            setData(filterOutCompleted(requests));
            setIsSearching(false);
            return;
        }

        const url = filter
            ? `${FILTER_URL}?filter=${encodeURIComponent(filter)}`
            : BACKEND_URL;

        fetch(url, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                const list = Array.isArray(json) ? json : [];
                setData(filterOutCompleted(list));
                setIsSearching(false);
            })
            .catch((err) => {
                console.error(err);
                setIsSearching(false);
            });
    };

    useEffect(() => {
        loadRequests();
    }, [requests, filter]);

    return (
        <div className="h-[80vh] w-full flex flex-col overflow-y-auto">

            <div className="flex justify-between items-center p-1 bg-gray-100">
                <p className="text-gray-500 font-bold text-[10px] sm:text-[15px]">
                    Ticket Count: {data.length}
                </p>
                <div className="flex items-center gap-1 sm:justify-center gap-3">
                    <ExportToday/>
                    <ExportXSLX />                    
                    <FilterRequests onFilterChange={setFilter} />                
                </div>                
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
                            className="bg-white shadow rounded-lg pb-1 flex flex-col "
                        >

                            <div className={`w-full border-b px-3 border-gray-200 py-1 flex gap-5 sm:gap-0 justify-between
                             ${
                                            request.status === "Approved"
                                                ? "bg-green-500 text-green-700 border border-green-200"
                                                : request.status === "Rejected"
                                                ? "bg-red-500  border border-red-200"
                                                : request.status === "Pending"
                                                ? "bg-orange-500 text-orange-700 border border-orange-200"
                                                : "bg-blue-500 border border-blue-200"
                                        }`
                                
                            }>
                                <p className="text-white font-bold text-[8px] sm:text-[13px]">
                                    Ticket ID: {request.ticket_id}
                                </p>

                                <p className="text-white font-bold text-[8px] sm:text-[13px]">
                                    Requested By: {request.username}
                                </p>

                                <p className="text-white font-bold text-[8px] sm:text-[13px]">
                                    Vehicle Needed: {request.vehicle_model}
                                </p>

                                <p className="text-white font-bold text-[8px] sm:text-[13px]">
                                    Created at: {request.created_at}
                                </p>

                            </div>

                            <div className="flex px-1  sm:justify-between h-full px-3">

                                {/* Pickup */}
                                <div className="w-[15vh] sm:w-[35vh] flex flex-col justify-center items-center">

                                    <p className="text-[10px] sm:text-[14px] text-gray-500 font-bold">
                                        Pick up at:
                                    </p>

                                    <div className="flex justify-center w-[28vh]">
                                        <div className="hidden sm:block">
                                        <span className="material-symbols-outlined text-blue-800 ">
                                            location_on
                                        </span>
                                        </div>

                                        <p className="text-[14px] truncate sm:text-[14px] text-blue-800  sm:truncate font-bold text-center">
                                            {request.pick_up}
                                        </p>
                                    </div>

                                    <p className="font-bold text-[10px] sm:text-[14px]">
                                        {request.date_needed}
                                    </p>

                                    <p className="text-gray-500 text-[10px] sm:text-[14px]">
                                        {request.time_needed}
                                    </p>
                                
                                </div>

                                
                                

                                {/* Drop Off */}
                                <div className="w-[35vh] flex flex-col justify-center items-center py-3">

                                    <p className="text-gray-500 font-bold text-[10px] sm:text-[14px]">
                                        Drop off at:
                                    </p>

                                    <div className="flex justify-center w-[28vh]">
                                        <div className="hidden sm:block">
                                            <span className="material-symbols-outlined text-red-800">
                                                location_on
                                            </span>
                                        </div>
                                        <p className="text-red-800 font-bold truncate text-[14px] sm:text-[14px] sm:truncate">
                                            {request.drop_off}
                                        </p>
                                        

                                    </div>
                                        <p className="text-gray-500 font-bold text-[10px] sm:text-[14px]">--</p>
                                        <p className="text-gray-400  text-[10px] sm:text-[14px]">--</p>
                                    </div>
                                {/* Buttons */}
                                <div className="w-[10vh] flex flex-col justify-center h-full py-5 items-center hidden sm:block">
                                    <ReviewRequests summary={request}/>

                                    <RejectRequests summary={request}/>

                                </div>
                            </div>
                                                  
                            <div className=" px-2">
                                <div
                                    className={`text-center font-bold rounded text-[10px] mb-1 sm:text-[14px] mb-3
                                        ${
                                            request.status === "Approved"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : request.status === "Rejected"
                                                ? "bg-red-100 text-red-700 border border-red-200"
                                                : request.status === "Pending"
                                                ? "bg-orange-100 text-orange-700 border border-orange-200"
                                                : "bg-blue-100 text-blue-700 border border-blue-200"
                                        }`}
                                >
                                    <p>{request.status}</p>
                                </div>
                            </div>

                            <div className="flex flex-col w-full px-2 justify-center  sm:hidden">
                                    <ReviewRequests summary={request}/>

                                    <RejectRequests summary={request}/>
                            </div>  
                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default LoadRequests;