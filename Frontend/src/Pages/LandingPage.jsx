import React, { useState } from "react";
import AmkorLogo from "../Images/AmkorLogo.png";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    const [login, setLogin] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!login.username || !login.password) {
            alert("Please enter your username and password.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost/Amkor_VehicleBooking_System_2026/Backend/LoginAuthentication.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(login),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert(data.message);

                if (data.user.account_type.toLowerCase() === "admin") {
                    navigate("/admin");
                } else if (data.user.account_type.toLowerCase() === "user") {
                    navigate("/user");
                } else {
                    alert("Unknown account type.");
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };

    return (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
            <div className="bg-white p-4 shadow-xl w-[50vh] h-[45vh] rounded">
                <div className="flex gap-2 flex-col justify-center items-center p-2">
                    <img
                        src={AmkorLogo}
                        alt="Logo"
                        className="h-[8vh] object-contain"
                    />

                    <p className="font-bold text-[12px]">
                        Vehicle Booking System, Book now!
                    </p>
                </div>

                <div className="h-[30vh] flex flex-col items-center justify-center">
                    <form
                        className="text-[12px]"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-5 w-[40vh]">

                            <input
                                type="text"
                                name="username"
                                value={login.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className="bg-yellow-100/50 border-2 border-yellow-300 rounded py-2 px-2 placeholder:text-[13px] font-bold text-gray-900"
                            />

                            <input
                                type="password"
                                name="password"
                                value={login.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="bg-yellow-100/50 border-2 border-yellow-300 rounded py-2 px-2 placeholder:text-[13px] font-bold text-gray-900"
                            />

                            <button
                                type="submit"
                                className="bg-yellow-500 rounded p-2 hover:bg-yellow-400 duration-300 transition-colors"
                            >
                                <p className="font-bold text-[14px] text-white">
                                    Login
                                </p>
                            </button>

                        </div>
                    </form>

                    <div className="mt-7 border-t border-gray-200 h-[5vh] w-[40vh] flex items-center justify-center">
                        <p className="text-gray-500 text-[12px]">
                            © 2026 Amkor Coop Technology, Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;