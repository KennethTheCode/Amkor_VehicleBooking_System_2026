import React, { useEffect, useState } from "react";

import { API_BASE } from '../../../config'

function CheckSchedule({ summary }) {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
    if (!summary.date_needed) return;

    fetch(
        `${API_BASE}/ManageRequests/GetScheduleByDate.php?date=${summary.date_needed}`
    )
        .then((res) => res.json())
        .then((data) => {
            const approvedOnly = (data || []).filter(
                (item) => item.status === "Approved"
            );
            setSchedule(approvedOnly);
        })
        .catch((err) => console.error(err));
}, [summary.date_needed]);

    return (
        <div className="mt-4 gap-2 flex flex-col h-[20vh] overflow-y-auto">
            <div className="w-full px-5  flex">
                <h2 className="font-bold text-blue-900">
                    Schedule for {summary.date_needed}
                </h2>
            </div>

            {schedule.length === 0 ? (
                <div className="px-5 text-gray-500">
                    No scheduled bookings.
                </div>
            ) : (
                schedule.map((item) => (
                    <div
                        key={item.ticket_id}
                        className="mx-5 mt-2 p-3 bg-gray-100 rounded shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                            <p className="font-bold">Driver:</p>
                            <p className="text-gray-500 font text-[14px]">{item.driver_username ?? "No Assigned Driver"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-bold">Vehicle Model:</p>
                            <p className="text-gray-500 font text-[14px]">{item.vehicle_model ?? "No Assigned Driver"}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="font-bold">Date Scheduled:</p>
                            <p className="text-gray-500 font text-[14px]">{item.date_needed ?? "No Assigned Driver"}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="font-bold">Time Needed:</p>
                            <p className="text-gray-500 font text-[14px]">{item.time_needed ?? "No Assigned Driver"}</p>
                        </div>            

                    </div>
                ))
            )}
        </div>
    );
}

export default CheckSchedule;