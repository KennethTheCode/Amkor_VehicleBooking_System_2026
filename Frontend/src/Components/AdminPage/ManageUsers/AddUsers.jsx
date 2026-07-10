import React, { useState } from 'react'

function AddUsers() {
    const [user, setUser] = useState({
        username:'',
        password:'',
        account_type:'',
        picture:'',
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.prevent.Default();

        if (!user.username || !user.password || !user.account_type) {
            alert("All fields are required.")
            return;
        }

         try {
        const response = await fetch(
            "http://localhost/Amkor_VehicleBooking_System_2026/Backend/ManageUsers/addUsers.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            }
        );

        const data = await response.json();

        alert(data.message);

        if (data.success) {
            setEmployee({
                username:'',
                password:'',
                account_type:'',
                picture:'',
            });

            window.location.reload();
        } else {
            console.error("Failed to add employee:", data.message);
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
                <h1 className='text-gray-800 font-bold text-[20px] mb-5'>Register Users</h1>
                <p className='text-gray-800 font-bold text-[15px]'>Enter Username</p>
                <input
                name="username"
                value={user.username}
                onChange={handleChange}
                placeholder='Username'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Enter Password</p>
                <input
                name="password"
                value={user.password}
                onChange={handleChange}
                placeholder='Password'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <p className='text-gray-800 font-bold text-[15px]'>Choose Account Type</p>
                <select
                name="account_type"
                value={user.account_type}
                onChange={handleChange}
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                    <option
                    value="">
                    Select
                    </option>

                    <option
                    value="User"
                    >
                    User
                    </option>

                    <option
                    value="Admin"
                    >
                    Admin
                    </option>
                </select>

                <p className='text-gray-800 font-bold text-[15px]'>Upload 2x2 picture</p>
                <input
                name="picture"
                value={user.picture}
                onChange={handleChange}
                type='file'
                placeholder='2x2 picture'
                className='mb-5 w-full bg-gray-100 text-gray-500 font-bold text-[13px] p-2 border-b border-gray-300'>
                </input>

                <button 
                type='submit'
                className='bg-blue-900 text-white font-bold text-[15px] p-3 rounded w-full'>
                    Register
                </button>
            </form>

            
        </div>
    </div>
  )
}

export default AddUsers