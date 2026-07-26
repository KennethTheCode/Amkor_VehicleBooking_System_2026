import React, { useEffect, useState } from "react";

import { API_BASE } from '../../../config'

function LoadOdometerID({ ticket }) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!ticket) return;

        setIsLoading(true);

        fetch(`${API_BASE}/ManageRequests/FinalTickets.php?ticket_id=${ticket}`, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                const matches = Array.isArray(json)
                    ? json.filter((item) => String(item.ticket_id) === String(ticket))
                    : [];
                setData(matches);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, [ticket]);

    if (isLoading) {
        return <p className="text-[12px] text-gray-400 py-2">Loading odometer...</p>;
    }

    if (data.length === 0) {
        return <p className="text-[12px] text-gray-400 py-2">No odometer data found</p>;
    }

    return (
        <div className="p-2 bg-pink-50 border-t-2 border-pink-200 flex flex-col gap-2 -y-auto h-[20vh]overflow">
            <p className="text-[14px] font-semibold text-gray-700">Odometer</p>

            {data.map((item, index) => (
                <div
                    key={item.finished_id ?? index}
                    className="flex flex-col gap-1 pb-2 border-b border-pink-300 last:border-0 last:pb-0"
                >   
                <div className="flex justify-between">
                    <p className="font-bold truncate text-blue-800 w-50">{item.pick_up_final}</p>
                    <p className="font-bold truncate text-pink-700 w-50 text-end">{item.drop_off_final}</p>
                </div>
                    <div className="flex justify-between text-[12px]">
                        <p>Reading:</p>
                        <p className="font-bold text-gray-500">
                            {item.beginning} → {item.ending}
                        </p>
                    </div>

                    <div className="flex justify-between text-[12px]">
                        <p>Distance:</p>
                        <p className="font-bold text-gray-500">
                            {item.distance_travelled !== null
                                ? `${item.distance_travelled} km`
                                : "—"}
                        </p>
                    </div>

                    <div className="flex justify-between text-[12px]">
                        <p>Time Out:</p>
                        <p className="font-bold text-gray-500">{item.time_out}</p>
                    </div>

                    <div className="flex justify-between text-[12px]">
                        <p>Time In:</p>
                        <p className="font-bold text-gray-500">{item.time_in}</p>
                    </div>

                    <div className="flex justify-between text-[12px]">
                        <p>RFID Balance:</p>
                        <p className="font-bold text-gray-500">{item.rfid_balance ?? "—"}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LoadOdometerID