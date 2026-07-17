import React, { useState } from "react";

function AddUsers() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        account_type: "",
        picture: null,
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !user.username ||
            !user.password ||
            !user.account_type 
        ) {
            alert("All fields are required.");
            return;
        }

        const formData = new FormData();

        formData.append("username", user.username);
        formData.append("password", user.password);
        formData.append("account_type", user.account_type);
        formData.append("picture", user.picture);

        try {
            const response = await fetch(
                "http://amkor-vehicle-booking-system-2026.ct.ws/Backend/ManageUsers/AddUsers.php",
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                setUser({
                    username: "",
                    password: "",
                    account_type: "",
                    picture: null,
                });

                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };

    return (
        <div className="bg-white w-[50vh] h-full p-3">
            <form onSubmit={handleSubmit}>
                <h1 className="text-gray-800 font-bold text-[20px] mb-5">
                    Register Users
                </h1>

                <p className="text-gray-800 font-bold text-[15px]">
                    Enter Username
                </p>

                <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className="mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                />

                <p className="text-gray-800 font-bold text-[15px]">
                    Enter Password
                </p>

                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                />

                <p className="text-gray-800 font-bold text-[15px]">
                    Choose Account Type
                </p>

                <select
                    name="account_type"
                    value={user.account_type}
                    onChange={handleChange}
                    className="mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                >
                    <option value="">Select</option>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>

                <p className="text-gray-800 font-bold text-[15px]">
                    Upload 2x2 Picture
                </p>

                <input
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={(e) =>
                        setUser({
                            ...user,
                            picture: e.target.files[0],
                        })
                    }
                    className="mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300"
                />

                <button
                    type="submit"
                    className="bg-blue-900 text-white font-bold text-[15px] p-3 rounded w-full"
                >
                    Register
                </button>
            </form>
        </div>
    );
}

export default AddUsers;