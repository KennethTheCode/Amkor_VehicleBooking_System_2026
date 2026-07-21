import React, { useState } from "react";
import { API_BASE } from '../../../config'

function DisableDrivers({ id, drivers, onStatusChanged }) {
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const isDisabled = drivers.status === "Disabled"
    const targetStatus = isDisabled ? "Active" : "Disabled"
    const actionLabel = isDisabled ? "Enable" : "Disable"

    const handleToggle = async () => {
        setLoading(true)
        setError("")

        try {
            const response = await fetch(`${API_BASE}/ManageDrivers/DisableDrivers.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ driver_id: id, status: targetStatus }),
            });

            const data = await response.json();

            if (!data.success) {
                setError(data.message || `Failed to ${actionLabel.toLowerCase()} driver.`);
                setLoading(false)
                return;
            }

            setShowModal(false)
            if (onStatusChanged) {
                onStatusChanged(id, targetStatus)
            } else {
                window.location.reload()
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className={`${isDisabled ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"} duration-300 text-white rounded px-5 py-2 font-bold`}>
                <p>{actionLabel}</p>
            </button>

            {showModal && (
                <div className="bg-black/20 fixed flex items-center justify-center h-screen inset-0 z-100">
                    <div className="bg-white rounded">
                        <div className="p-5 border-b-2 border-blue-800">
                            <p className="font-bold">Are you sure you want to {actionLabel.toLowerCase()} this driver?</p>
                        </div>

                        <div className="p-5 flex flex-col gap-3">
                            <div className="flex justify-between">
                                <p className="font-bold">Username:</p>
                                <p className="text-gray-500">{drivers.username}</p>
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>

                        <div className="flex gap-4 justify-between p-5">
                            <button
                                onClick={handleToggle}
                                disabled={loading}
                                className={`${isDisabled ? "bg-green-500 hover:bg-green-400" : "bg-red-500 hover:bg-red-400"} w-full duration-300 text-white rounded px-5 py-2 font-bold disabled:opacity-50`}>
                                <p>{loading ? `${actionLabel}ing...` : actionLabel}</p>
                            </button>

                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="bg-blue-100 w-full border border-blue-500 text-blue-500 hover:bg-blue-400 duration-300 rounded px-5 py-2 font-bold disabled:opacity-50">
                                <p>Close</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DisableDrivers