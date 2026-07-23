import React, { useState } from "react";
import { API_BASE } from '../../../config'

function EditVehicles({ id, vehicles, onUpdated }) {
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        vehicle_model: vehicles.vehicle_model || "",
        color: vehicles.color || "",
        platenumber: vehicles.platenumber || "",
        expiration: vehicles.expiration || "",
        seater: vehicles.seater || "",
        rfid_balance: vehicles.rfid_balance || "",
        orcr: null,   // only set if a new file is picked
        image: null,  // only set if a new file is picked
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        if (
            !form.vehicle_model ||
            !form.color ||
            !form.platenumber ||
            !form.expiration ||
            !form.seater ||
            !form.rfid_balance
        ) {
            setError("All fields are required.")
            return
        }

        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("vehicle_id", id)
        formData.append("vehicle_model", form.vehicle_model)
        formData.append("color", form.color)
        formData.append("platenumber", form.platenumber)
        formData.append("expiration", form.expiration)
        formData.append("seater", form.seater)
        formData.append("rfid_balance", form.rfid_balance)
        if (form.orcr) {
            formData.append("orcr", form.orcr)
        }
        if (form.image) {
            formData.append("image", form.image)
        }

        try {
            const response = await fetch(`${API_BASE}/ManageVehicles/EditVehicles.php`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.message || "Failed to update vehicle.")
                setLoading(false)
                return
            }

            setShowModal(false)
            if (onUpdated) {
                onUpdated(id, {
                    vehicle_model: form.vehicle_model,
                    color: form.color,
                    platenumber: form.platenumber,
                    expiration: form.expiration,
                    seater: form.seater,
                    rfid_balance: form.rfid_balance,
                    ...(data.orcr ? { orcr: data.orcr } : {}),
                    ...(data.image ? { image: data.image } : {}),
                })
            } else {
                window.location.reload()
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.")
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 w-full hover:bg-blue-400 duration-300 text-white rounded px-3 py-1 text-[10px] sm:text-[14px] sm:px-5 sm:py-2 font-bold">
                <p>Edit</p>
            </button>

            {showModal && (
                <div className="bg-black/20 fixed flex items-center justify-center h-screen inset-0 z-100">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white rounded w-[40vh] max-h-[85vh] overflow-y-auto">
                        <div className="p-5 border-b-2 border-blue-800">
                            <p className="font-bold">Edit Vehicle</p>
                        </div>

                        <div className="p-5 flex flex-col gap-3">
                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Vehicle Model</p>
                                <input
                                    type="text"
                                    name="vehicle_model"
                                    value={form.vehicle_model}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Color</p>
                                <input
                                    type="text"
                                    name="color"
                                    value={form.color}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Plate Number</p>
                                <input
                                    type="text"
                                    name="platenumber"
                                    value={form.platenumber}
                                    onChange={handleChange}
                                    minLength={7}
                                    maxLength={7}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Expiration</p>
                                <input
                                    type="date"
                                    name="expiration"
                                    value={form.expiration}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Number of Seaters</p>
                                <input
                                    type="number"
                                    name="seater"
                                    value={form.seater}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">RFID Balance</p>
                                <input
                                    type="number"
                                    name="rfid_balance"
                                    value={form.rfid_balance}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">
                                    Replace OR/CR (optional)
                                </p>
                                <input
                                    type="file"
                                    name="orcr"
                                    accept="image/*,.pdf"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            orcr: e.target.files[0] || null,
                                        })
                                    }
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">
                                    Replace Vehicle Image (optional)
                                </p>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            image: e.target.files[0] || null,
                                        })
                                    }
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>

                        <div className="flex gap-4 justify-between p-5">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-500 w-full hover:bg-green-400 duration-300 text-white rounded px-5 py-2 font-bold disabled:opacity-50">
                                <p>{loading ? "Saving..." : "Save"}</p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="bg-blue-100 w-full border border-blue-500 text-blue-500 hover:bg-blue-400 duration-300 rounded px-5 py-2 font-bold disabled:opacity-50">
                                <p>Close</p>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}

export default EditVehicles