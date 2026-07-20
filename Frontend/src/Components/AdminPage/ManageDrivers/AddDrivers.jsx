import React, { useState } from "react";

import { API_BASE } from '../../../config'

function AddDrivers( {onDriverAdded}) {

const [driver, setDriver] = useState({
        username: "",
        password: "",
        license_no: "",
        expiration_date: "",
        picture: null,
        availability: 1,
    });

    const handleChange = (e) => {
        setDriver({
            ...driver,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !driver.username ||
            !driver.password
        ) {
            alert("All fields are required.");
            return;
        }

        const formData = new FormData();

        formData.append("username", driver.username);
        formData.append("password", driver.password);
        formData.append("license_no", driver.license_no);
        formData.append("expiration_date", driver.expiration_date);
        formData.append("picture", driver.picture);
        formData.append("availability", driver.availability);

        try {
            const response = await fetch(
                `${API_BASE}/ManageDrivers/AddDrivers.php`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                setDriver({
                    username: "",
                    password: "",
                    license_no: "",
                    expiration_date: "",
                    picture: null,
                    availability: 1,
                });

                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };
    
  return (
    <div className='bg-white w-[50vh] h-full p-3'>
        <div className=''>
            <form onSubmit={handleSubmit}>
                <h1 className='text-gray-800 font-bold text-[20px] mb-5'>Register Drivers</h1>
                <p className='text-gray-800 font-bold text-[15px]'>Enter Username</p>
                <input
                type="text"
                name="username"
                value={driver.username}
                onChange={handleChange}
                placeholder='Username'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Password</p>
                <input
                type="text"
                name="password"
                value={driver.password}
                onChange={handleChange}
                placeholder='Password'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter License No.</p>
                <input
                type="text"
                name="license_no"
                value={driver.license_no}
                onChange={handleChange}
                maxLength={11}
                minLength={11}
                placeholder='License No.'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                

                <p className='text-gray-800 font-bold text-[15px]'>Enter Expiration Date</p>
                <input
                type="text"
                name="expiration_date"
                value={driver.expiration_date}
                onChange={handleChange}
                type="date"
                placeholder='Expiration Date'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Upload 2x2 picture</p>
                <input
                    type="file"
                    name="picture"
                    accept="image/*"
                    onChange={(e) =>
                        setDriver({
                            ...driver,
                            picture: e.target.files[0],
                        })
                    }               
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>
            
                <button 
                type="submit"
                className='bg-blue-900 text-white font-bold text-[15px] p-3 rounded w-full'>
                    Register
                </button>
            </form>

            
        </div>
    </div>
  )
}

export default AddDrivers