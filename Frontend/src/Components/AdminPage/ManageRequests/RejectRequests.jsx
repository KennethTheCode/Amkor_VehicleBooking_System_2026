import React, { useState } from "react";
import CheckSchedule from "./CheckSchedule";

import { API_BASE } from '../../../config'

function RejectRequests({ summary, onRejected }) {
    const [showModal, setShowModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setDeleting(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/ManageRequests/RejectTicket.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticket_id: summary.ticket_id }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to reject the ticket.");
            }

            setShowModal(false);

            if (onRejected) {
                onRejected(summary.ticket_id);
                window.location.reload()
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-red-500 hover:bg-red-400 duration-300 text-white font-bold rounded cursor-pointer"
            >
                Reject
            </button>

            {showModal && (
                <div className="inset-0 h-screen flex items-center justify-center fixed z-100 bg-black/20">
                    <div className="bg-white rounded shadow">

                        <div className="flex p-5 border-b-2 border-blue-800">
                            <h1 className="font-bold text-blue-800">Are you sure you want to Reject this Ticket?</h1>
                        </div>

                        <h1 className="px-5 mt-2 font-bold text-gray-500 text-[14px]">Passengers:</h1>
                        <p className="px-5 mt-2 font-bold text-gray-400 text-[13px]">{summary.passengers}</p>

                        <div className="flex flex-col p-5">
                            <div className="gap-4 border border-gray-100 flex flex-col bg-white shadow p-3">

                                <div className="flex justify-between items-center">
                                    <p className="font-bold">Ticket ID:</p>
                                    <p className="text-gray-500 font-bold text-[15px]">{summary.ticket_id}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="font-bold">Pick up:</p>
                                    <p className="text-gray-500 font-bold text-[15px]">{summary.pick_up}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="font-bold">Drop off:</p>
                                    <p className="text-gray-500 font-bold text-[15px]">{summary.drop_off}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="font-bold">Date needed:</p>
                                    <p className="text-gray-500 font-bold text-[15px]">{summary.date_needed}</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <p className="font-bold">Time needed:</p>
                                    <p className="text-gray-500 font-bold text-[15px]">{summary.time_needed}</p>
                                </div>

                            </div>
                        </div>

                        <CheckSchedule summary={summary} />

                        {error && (
                            <p className="px-5 text-red-600 font-bold text-[13px]">{error}</p>
                        )}

                        <div className="mt-5 flex gap-3 items-center p-5">
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="bg-red-500 disabled:bg-red-300 text-white px-2 py-1 w-full font-bold rounded hover:bg-red-600 duration-300 transition-colors cursor-pointer"
                            >
                                {deleting ? "Rejecting..." : "Reject Request"}
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                disabled={deleting}
                                className="bg-blue-100 text-blue-800 px-2 py-1 w-full font-bold rounded hover:bg-blue-200 duration-300 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default RejectRequests;