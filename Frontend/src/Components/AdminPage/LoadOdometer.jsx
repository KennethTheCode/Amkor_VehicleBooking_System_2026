import React, { useEffect, useState } from "react";

import { API_BASE } from '../../config'

function LoadOdometer({ ticket_id }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadOdometer = () => {
        console.log(ticket_id)
        if (!ticket_id) return;

        setIsLoading(true);

        fetch(
            `${API_BASE}/ManageRequests/LoadOdometer.php?ticket_id=${ticket_id}`,
            {
                cache: "no-store",
            }
        )
            .then((res) => res.json())
            .then((json) => {
                setData(Array.isArray(json) ? json : []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadOdometer();
    }, [ticket_id]);

    // Only keep rows that actually belong to this card's ticket_id —
    // guards against the backend ever returning more than it should,
    // e.g. if the query param gets dropped or ignored server-side.
    const filtered = data.filter(
        (item) => String(item.ticket_id) === String(ticket_id)
    );

    return (
        <div className="h-[35vh] px-5 w-full flex flex-col overflow-y-auto">

            <div className="flex justify-between items-center p-1">
                <p className="text-gray-500 font-bold text-[15px]">
                    Finished Trips: {filtered.length}
                </p>
            </div>

            <div className="w-full py-1 flex flex-col gap-3">

                {isLoading ? (

                    <p className="text-center font-bold">
                        Loading...
                    </p>

                ) : filtered.length === 0 ? (

                    <p className="text-center font-bold text-gray-500">
                        No Finished Trips Found
                    </p>

                ) : (

                    filtered.map((item) => (

                        <div
                            key={item.ticket_id}
                            className="bg-white shadow rounded-lg pb-1 flex flex-col"
                        >

                            <div className="w-full border-b px-3 border-gray-200 py-1 flex justify-between bg-blue-800">
                                <p className="text-white font-bold text-[13px]">
                                    Ticket ID: {item.ticket_id}
                                </p>

                                <p className="text-white font-bold text-[13px]">
                                    Driver: {item.driver_username ?? "No Driver"}
                                </p>

                                <p className="text-white font-bold text-[13px]">
                                    Vehicle: {item.vehicle_model ?? "N/A"}
                                </p>

                                <p className="text-white font-bold text-[13px]">
                                    Finished: {item.date_finished}
                                </p>
                            </div>

                            <div className="flex justify-between h-full px-3 py-3">

                                <div className="w-[35vh] flex flex-col justify-center">

                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-blue-800">
                                            location_on
                                        </span>

                                        <p className="text-blue-800 truncate font-bold">
                                            {item.pick_up}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-red-800">
                                            location_on
                                        </span>

                                        <p className="text-red-800 truncate font-bold">
                                            {item.drop_off}
                                        </p>
                                    </div>

                                </div>

                                <div className="w-[25vh] flex flex-col justify-center items-center">
                                    <p className="text-gray-500 font-bold text-[13px]">
                                        Odometer
                                    </p>

                                    <p className="font-bold">
                                        {item.beginning} → {item.ending}
                                    </p>

                                    <p className="text-gray-400 text-[13px]">
                                        {item.distance_travelled !== null
                                            ? `${item.distance_travelled} km travelled`
                                            : "—"}
                                    </p>
                                </div>

                                <div className="w-[25vh] flex flex-col justify-center items-center">
                                    <p className="text-gray-500 font-bold text-[13px]">
                                        Trip Time
                                    </p>

                                    <p className="font-bold text-[13px]">
                                        Out: {item.time_out}
                                    </p>

                                    <p className="font-bold text-[13px]">
                                        In: {item.time_in}
                                    </p>
                                </div>

                                <div className="w-[20vh] flex flex-col justify-center items-center">
                                    <p className="text-gray-500 font-bold text-[13px]">
                                        RFID Balance
                                    </p>

                                    <p className="font-bold">
                                        {item.rfid_balance ?? "—"}
                                    </p>
                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default LoadOdometer;