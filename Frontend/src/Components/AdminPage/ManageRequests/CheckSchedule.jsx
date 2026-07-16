import React, { useEffect, useState } from "react";

function CheckSchedule({ summary }) {
    console.log(summary)
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        if (!summary.date_needed) return;

        fetch(
            `http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageRequests/GetScheduleByDate.php?date=${summary.date_needed}`
        )
            .then((res) => res.json())
            .then((data) => {
                setSchedule(data);
            })
            .catch((err) => console.error(err));
    }, [summary.date_needed]);

    return (
        <div className="mt-4">

            <div className="w-full px-5">
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
                        <div>
                            <b>Driver:</b> <span className="text-gray-500">{item.driver_username ?? "No Driver"}</span>
                        </div>

                        <div>
                            <b>Vehicle:</b> <span className="text-gray-500">{item.vehicle_model}</span>
                        </div>

                        <div>
                            <b>Time:</b> <span className="text-gray-500">{item.time_needed}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default CheckSchedule;