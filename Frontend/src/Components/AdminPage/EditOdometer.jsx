import React, { useEffect, useState } from "react";

// Change this if your folder name is different on disk (case-sensitive on some setups)
const API_BASE = "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageRequests";

function EditOdometer({ request }) {
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        ticket_id: "",
        pick_up: "",
        drop_off: "",
        beginning: "",
        ending: "",
        time_in: "",
        time_out: "",
        date_finished: "",
    });

    useEffect(() => {
        if (request) {
            setForm({
                ticket_id: request.ticket_id,
                pick_up: request.pick_up,
                drop_off: request.drop_off,
                beginning: "",
                ending: "",
                time_in: "",
                time_out: "",
                date_finished: new Date().toISOString().split("T")[0],
            });
        }
    }, [request]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/UpdateOdometer.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            // Read the raw text first so we can diagnose non-JSON
            // responses (404 pages, PHP fatal errors, etc.) instead of
            // just throwing an opaque "Unable to connect" error.
            const raw = await response.text();

            let data;
            try {
                data = JSON.parse(raw);
            } catch (parseError) {
                console.error("Server did not return JSON:", raw);
                alert(
                    `Server error (HTTP ${response.status}). ` +
                    `Check the browser console and confirm the PHP file path is correct.`
                );
                return;
            }

            if (!response.ok) {
                console.error("HTTP error:", response.status, data);
            }

            alert(data.message);

            if (data.success) {
                setShowModal(false);
                window.location.reload();
            }

        } catch (error) {
            // This only fires for actual network failures (server down,
            // CORS block, wrong host/port) - not for 404s or PHP errors,
            // since those still return a response.
            console.error(error);
            alert("Unable to connect to the server. Is Apache/XAMPP running?");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>

            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-100 p-1 rounded w-full text-blue-700 font-bold text-[14px] hover:bg-blue-200 duration-300 transition-colors cursor-pointer"
            >
                Details
            </button>

            {showModal && (

                <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">

                    <div className="bg-white rounded w-[150vh]">

                        <div className="flex justify-between items-center border-b-2 border-blue-500 p-5">

                            <div>

                                <p className="font-bold text-blue-900 text-xl">
                                    Vehicle Trip Ticket #{request.ticket_id}
                                </p>

                                <p className="text-gray-500">
                                    Driver: {request.driver_username}
                                </p>

                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col"
                        >

                            <div className="grid grid-cols-3 gap-6 p-6">

                                {/* Destination */}

                                <div>

                                    <p className="font-bold text-blue-900 text-lg mb-3">
                                        Destination
                                    </p>

                                    <div className="space-y-3">

                                        <div>

                                            <p className="font-semibold">
                                                From
                                            </p>

                                            <input
                                                type="text"
                                                name="pick_up"
                                                value={form.pick_up}
                                                readOnly
                                                className="w-full bg-gray-100 border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                To
                                            </p>

                                            <input
                                                type="text"
                                                name="drop_off"
                                                value={form.drop_off}
                                                readOnly
                                                className="w-full bg-gray-100 border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Odometer */}

                                <div>

                                    <p className="font-bold text-blue-900 text-lg mb-3">
                                        Odometer
                                    </p>

                                    <div className="space-y-3">

                                        <div>

                                            <p className="font-semibold">
                                                Beginning
                                            </p>

                                            <input
                                                type="number"
                                                name="beginning"
                                                value={form.beginning}
                                                onChange={handleChange}
                                                required
                                                className="w-full border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                Ending
                                            </p>

                                            <input
                                                type="number"
                                                name="ending"
                                                value={form.ending}
                                                onChange={handleChange}
                                                required
                                                className="w-full border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                    </div>

                                </div>

                                {/* Time */}

                                <div>

                                    <p className="font-bold text-blue-900 text-lg mb-3">
                                        Trip Time
                                    </p>

                                    <div className="space-y-3">

                                        <div>

                                            <p className="font-semibold">
                                                Time In
                                            </p>

                                            <input
                                                type="time"
                                                name="time_in"
                                                value={form.time_in}
                                                onChange={handleChange}
                                                required
                                                className="w-full border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                Time Out
                                            </p>

                                            <input
                                                type="time"
                                                name="time_out"
                                                value={form.time_out}
                                                onChange={handleChange}
                                                required
                                                className="w-full border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                Date Finished
                                            </p>

                                            <input
                                                type="date"
                                                name="date_finished"
                                                value={form.date_finished}
                                                onChange={handleChange}
                                                required
                                                className="w-full border-b-2 border-blue-500 px-2 py-2"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="p-5">

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-blue-800 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded w-full py-3 transition"
                                >
                                    {submitting ? "Saving..." : "Finish Trip"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default EditOdometer;