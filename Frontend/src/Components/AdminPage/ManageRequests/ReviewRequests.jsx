import React, { useState, useEffect } from "react";
import CheckSchedule from "./CheckSchedule";

import { API_BASE } from '../../../config'


function ReviewRequests({ summary }) {
    const [showModal, setShowModal] = useState(false);

    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetch(
            `${API_BASE}/ManageDrivers/LoadDrivers.php`
        )
            .then((res) => res.json())
            .then((data) => {
                setDrivers(data);
            })
            .catch((err) => console.error(err));
    }, []);

    const postAndHandle = async (url, payload) => {
        setSubmitting(true);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const raw = await response.text();

            let result;
            try {
                result = JSON.parse(raw);
            } catch (parseError) {
                console.error("Server did not return JSON:", raw);
                alert(`Server error (HTTP ${response.status}). Check the console for details.`);
                return;
            }

            if (result.success) {
                alert(result.message);
                setShowModal(false);
                // Only reload AFTER the request has actually completed,
                // otherwise the browser can cancel the fetch mid-flight.
                window.location.reload();
            } else {
                alert(result.message);
            }

        } catch (error) {
            console.error(error);
            alert("Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleApprove = async (e) => {
        e.preventDefault();

        // Require a driver to be picked before allowing approval —
        // this stops an empty selection from ever reaching the backend.
        if (!selectedDriver) {
            alert("Please select a driver.");
            return;
        }

        const schedule = {
            driver_id: selectedDriver, // fixed: was "id", didn't match backend's expected key
            vehicle_id: summary.vehicle_id,
            ticket_id: summary.ticket_id,
            date_needed: summary.date_needed,
        };
        {/* fix api */}
        await postAndHandle(
            `http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageRequests/UpdateAvailability.php`,
            schedule
        );
    };

    const handleSetOngoing = async (e) => {
        e.preventDefault();

        await postAndHandle(
            `${API_BASE}/ManageRequests/SetOngoing.php`,
            { ticket_id: summary.ticket_id }
        );
    };

    // Once a booking is Approved, the form's job switches from
    // "assign a driver" to "start the trip" — same form, different action.
    const isApproved = summary.status === "Approved";
    const handleSubmit = isApproved ? handleSetOngoing : handleApprove;

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="w-full bg-cyan-900 text-[9px] py-1 sm:text-[14px] sm:mb-3 hover:bg-blue-600 duration-300 text-white font-bold rounded cursor-pointer"
            >
                Review
            </button>

            {showModal && (
                <div className="bg-black/20 fixed inset-0 h-screen flex items-center justify-center z-100">
                    <div className="bg-white overflow-y-auto h-[65vh] sm:h-[80vh] rounded">

                        <div className="p-4 border-b-3 border-blue-500">
                            <p className="text-[12px] text-gray-500">Requested by: <span></span></p>
                            <p className="text-[25px] font-bold text-blue-900">{summary.username}</p>
                        </div>

                        <div className="px-5 py-2">
                            <p className="font-bold">
                                Passengers: {summary.passengers ? summary.passengers.split(", ").length : 0}
                            </p>
                            <p className="text-gray-500 font-bold text-[14px]">{summary.passengers}</p>
                        </div>

                        <div className="py-2 w-full h-full">

                            <div className="mx-5 bg-white shadow border-gray-200 border rounded flex flex-col p-2 gap-2">

                                <div className="flex justify-between">
                                    <p className="font-bold">Ticket ID:</p>
                                    <p className="w-[25vh] text-gray-400 text-[15px] text-end">
                                        {summary.ticket_id}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="font-bold">Pick up:</p>
                                    <p className="w-[25vh] text-gray-400 text-[15px] text-end">
                                        {summary.pick_up}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="font-bold">Drop off::</p>
                                    <p className="w-[25vh] text-gray-400 text-[15px] text-end">
                                        {summary.drop_off}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="font-bold">Vehicle Model:</p>
                                    <p className="w-[25vh] text-gray-400 text-[15px] text-end">
                                        {summary.vehicle_model}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="font-bold">Date needed:</p>
                                    <p className="w-[25vh] text-gray-400 text-[15px] text-end">
                                        {summary.date_needed}
                                    </p>
                                </div>

                                <div className="flex justify-between">
                                    <p className="font-bold">Time needed:</p>
                                    <p className="w-[25vh] text-gray-400 text-[15px] text-end">
                                        {summary.time_needed}
                                    </p>
                                </div>

                            </div>

                            <form onSubmit={handleSubmit}>

                                <div className="mt-4 bg-white shadow mx-5 p-5 border border-gray-200 rounded">
                                    <div className="border-b border-gray-300 pb-3">
                                        <p className="font-bold">Purpose of Request:</p>
                                        <p className="text-[15px] text-gray-500">{summary.purpose}</p>
                                    </div>

                                    <select
                                        value={selectedDriver}
                                        onChange={(e) => setSelectedDriver(e.target.value)}
                                        disabled={isApproved}
                                        className="text-gray-400 mt-1 bg-gray-100/50 rounded p-2 w-full disabled:opacity-70"
                                    >
                                        {isApproved ? (
                                            <option value="">
                                                Assigned Driver: {summary.driver_username ?? "N/A"}
                                            </option>
                                        ) : (
                                            <>
                                                <option value="">Select Driver</option>
                                                {drivers
                                                    .filter((driver) => Number(driver.availability) === 1 && driver.status === "Active")
                                                    .map((driver) => (
                                                        <option
                                                            key={driver.id}
                                                            value={driver.id}
                                                        >
                                                            {driver.username}
                                                        </option>
                                                    ))}
                                            </>
                                        )}
                                    </select>
                                </div>

                                <CheckSchedule summary={summary} />

                                <div
                                    className={`mx-5 shadow-lg text-center py-2 font-bold rounded mt-4
                                    ${
                                        summary.status === "Approved"
                                            ? "bg-green-100 text-green-700 border border-green-200"
                                            : summary.status === "Rejected"
                                            ? "bg-red-100 text-red-700 border border-red-200"
                                            : summary.status === "Pending"
                                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                                            : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }`}
                                >
                                    <p>{summary.status}</p>
                                </div>

                                <div className="flex justify-bottom gap-3 h-[10vh] mt-5 p-5 border-t-3 border-gray-200 rounded-lg bg-white">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className={`p-1 font-bold text-white rounded w-[70%] duration-300 transition-colors cursor-pointer
                                        ${
                                            isApproved
                                                ? "bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300"
                                                : "bg-blue-800 hover:bg-blue-700 disabled:bg-blue-300"
                                        }`}
                                    >
                                        {submitting
                                            ? (isApproved ? "Starting..." : "Approving...")
                                            : (isApproved ? "Set to Ongoing" : "Approve")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-red-500 p-1 font-bold text-white rounded w-[30%] hover:bg-red-600 duration-300 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>

                            </form>

                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default ReviewRequests;