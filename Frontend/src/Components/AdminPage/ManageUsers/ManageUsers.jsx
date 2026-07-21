import React, { useEffect, useState } from "react";
import Navbar from "../../Navbar";
import Dashboard from "../Dashboard";
import AddUsers from "./AddUsers";
import SearchUsers from "./SearchUsers";
import AmkorLogo from "../../../Images/AmkorLogo.png";

import { API_BASE } from '../../../config'
import DisableUsers from "./DisableUsers";
import UpdateUsers from "./UpdateUsers";


function ManageUsers({ users = null }) {
    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const BACKEND_URL =
        (typeof import.meta !== "undefined" &&
            import.meta.env &&
            import.meta.env.VITE_BACKEND_URL) ||
        `${API_BASE}/ManageUsers/LoadUsers.php`;

    const loadUsers = () => {
        setIsSearching(true);

        if (Array.isArray(users) && users.length > 0) {
            setData(users);
            setIsSearching(false);
            return;
        }

        fetch(BACKEND_URL, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                if (Array.isArray(json)) {
                    setData(json);
                } else {
                    setData([]);
                }

                setIsSearching(false);
            })
            .catch((err) => {
                console.error("Failed to fetch users:", err);
                setIsSearching(false);
            });
    };
    useEffect(() => {
        loadUsers();
    }, [users]);

    return (
        <div>
            <Navbar />

            <div className="bg-gray-100 px-[20vh] pt-3 py-4 h-screen flex flex-col gap-3">
                <Dashboard />

                <div className="w-full h-[75vh] flex gap-3">

                    {/* User List */}
                    <div className="bg-gray-200 w-full h-full rounded p-3">

                        <div className="bg-white w-full h-full rounded p-3 overflow-y-auto">

                            <SearchUsers
                                onSearch={(results) => {
                                    setData(Array.isArray(results) ? results : []);
                                    setIsSearching(false);
                                }}
                            />
                            {isSearching ? (
                                <p className="text-center mt-5 font-bold">
                                    Loading...
                                </p>
                            ) : data.length === 0 ? (
                                <p className="text-center mt-5 font-bold text-gray-500">
                                    No users found.
                                </p>
                            ) : (
                                data.map((user) => (
                                    <div
                                        key={user.user_id}
                                        className="w-full flex justify-between h-[15vh] p-3 bg-gray-200 rounded mb-3"
                                    >
                                        <div className="flex justify-center gap-5  ">
                                            <div className="flex flex-col items-center justify-center">

                                            <div className="w-20 h-20 rounded-full border-4 border-gray-500 overflow-hidden">

                                                    <img
                                                        src={
                                                            user.picture
                                                                ? `http://localhost/Amkor_VehicleBooking_System_2026/Backend/${user.picture}`
                                                                : AmkorLogo
                                                        }
                                                        alt={user.username}
                                                        className="w-full h-full object-cover"
                                                    />

                                                </div>

                                                <p className="font-bold text-gray-700 mt-2">
                                                    {user.account_type}
                                                </p>

                                            </div>
                                            <div className="flex  w-[10vh] flex-col ">
                                                <p className="text-gray-400 font-bold text-sm">
                                                    Username
                                                </p>

                                                <p className="text-gray-700 font-bold">
                                                    {user.username}
                                                </p>

                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    Password
                                                </p>

                                                <p className="text-gray-700 font-bold">
                                                    {user.password}
                                                </p>                                                                                               
                                            </div>
                                             <div className="flex flex-col">
                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    Email
                                                </p>
                                                <p className="text-gray-700 font-bold">
                                                    {user.email}
                                                </p>

                                                <p className="text-gray-400 font-bold text-sm mt-2">
                                                    Status
                                                </p>
                                                <p className="text-gray-700 font-bold">
                                                    {user.status}
                                                </p>

                                               
                                               
                                            </div>
                                        </div>
                                        

                                        <div className="flex flex-col justify-center gap-2">

                                            <UpdateUsers
                                                id={user.user_id}
                                                users={user}
                                                onUpdated={(id, updatedFields) =>
                                                    setData((prev) =>
                                                        prev.map((u) =>
                                                            u.user_id === id ? { ...u, ...updatedFields } : u
                                                        )
                                                    )
                                                }
                                            />

                                            <DisableUsers
                                                id={user.user_id}
                                                users={user}
                                                
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Add User */}
                    <AddUsers />

                </div>
            </div>
        </div>
    );
}

export default ManageUsers;