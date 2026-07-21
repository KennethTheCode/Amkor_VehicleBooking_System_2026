import React, { useState } from "react";
import { API_BASE } from '../../../config'

function UpdateUsers({ id, users, onUpdated }) {
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        username: users.username || "",
        password: users.password || "",
        email: users.email || "",
        account_type: users.account_type || "",
        picture: null, // only set if user picks a new one
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleUpdate = async (e) => {
        e.preventDefault()

        if (!form.username || !form.password || !form.email || !form.account_type) {
            setError("All fields are required.")
            return
        }

        setLoading(true)
        setError("")

        const formData = new FormData()
        formData.append("user_id", id)
        formData.append("username", form.username)
        formData.append("password", form.password)
        formData.append("email", form.email)
        formData.append("account_type", form.account_type)
        if (form.picture) {
            formData.append("picture", form.picture)
        }

        try {
            const response = await fetch(`${API_BASE}/ManageUsers/UpdateUsers.php`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json()

            if (!data.success) {
                setError(data.message || "Failed to update user.")
                setLoading(false)
                return
            }

            setShowModal(false)
            if (onUpdated) {
                onUpdated(id, {
                    username: form.username,
                    password: form.password,
                    email: form.email,
                    account_type: form.account_type,
                    ...(data.picture ? { picture: data.picture } : {}),
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
                className="bg-blue-500 w-full hover:bg-blue-400 duration-300 text-white rounded px-5 py-2 font-bold">
                <p>Edit</p>
            </button>

            {showModal && (
                <div className="bg-black/20 fixed flex items-center justify-center h-screen inset-0 z-100">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white rounded w-[40vh]">
                        <div className="p-5 border-b-2 border-blue-800">
                            <p className="font-bold">Edit User</p>
                        </div>

                        <div className="p-5 flex flex-col gap-3">
                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Username</p>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Password</p>
                                <input
                                    type="text"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Email </p>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={form.contact_number}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                />
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">Account Type</p>
                                <select
                                    name="account_type"
                                    value={form.account_type}
                                    onChange={handleChange}
                                    className="w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                                >
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <p className="text-gray-800 font-bold text-[13px]">
                                    Replace Picture (optional)
                                </p>
                                <input
                                    type="file"
                                    name="picture"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            picture: e.target.files[0] || null,
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

export default UpdateUsers