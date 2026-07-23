import React, { useState } from "react";

import { API_BASE } from '../../../config'

function AddVehicles( {onVehicleAdded} ) {
    const [vehicle, setVehicle] = useState({
        vehicle_model: "",
        color: "",
        platenumber: "",
        expiration: "",
        orcr: null,
        image: null,
        seater: "",
        rfid_balance: "",
        availability: 1,
        status: "Enabled",
    });

    const handleChange = (e) => {
        setVehicle({
            ...vehicle,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !vehicle.vehicle_model ||
            !vehicle.color ||
            !vehicle.platenumber ||
            !vehicle.expiration ||
            !vehicle.orcr ||
            !vehicle.image ||
            !vehicle.seater ||
            !vehicle.rfid_balance
        ) {
            alert("Please fill in all fields.");
            return;
        }

        const formData = new FormData();

        formData.append("vehicle_model", vehicle.vehicle_model);
        formData.append("color", vehicle.color);
        formData.append("platenumber", vehicle.platenumber);
        formData.append("expiration", vehicle.expiration);
        formData.append("orcr", vehicle.orcr);
        formData.append("image", vehicle.image);
        formData.append("seater", vehicle.seater);
        formData.append("rfid_balance", vehicle.rfid_balance);
        formData.append("availability", vehicle.availability);
        formData.append("status", vehicle.status);

        try {
            const response = await fetch(
                `${API_BASE}/ManageVehicles/AddVehicle.php`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await response.json();

            alert(data.message);

            if (data.success) {
                setVehicle({
                    vehicle_model: "",
                    color: "",
                    platenumber: "",
                    expiration: "",
                    orcr: null,
                    image: null,
                    seater: "",
                    rfid_balance: "",
                    availability: 1,
                    status: "Active",
                });
                if (onVehicleAdded) {
                    onVehicleAdded();
                }   
            }
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server.");
        }
    };

    return (
        <div className="bg-white w-full sm:w-[50vh] h-full p-3">
            <form onSubmit={handleSubmit}>

                <h1 className="text-gray-800 font-bold text-[20px] mb-5">
                    Register Vehicles
                </h1>
                <div className="h-[60vh] flex flex-col overflow-y-auto">
                <p className="font-bold">Vehicle Model</p>
                <input
                    type="text"
                    name="vehicle_model"
                    value={vehicle.vehicle_model}
                    onChange={handleChange}
                    placeholder="Vehicle Model"
                    className="mb-5 w-full bg-gray-100 p-2 border-b"
                />

                <p className="font-bold">Color</p>
                <input
                    type="text"
                    name="color"
                    value={vehicle.color}
                    onChange={handleChange}
                    placeholder="Color"
                    className="mb-5 w-full bg-gray-100 p-2 border-b"
                />

                <p className="font-bold">Plate Number</p>
                <input
                    type="text"
                    name="platenumber"
                    value={vehicle.platenumber}
                    onChange={handleChange}
                    minLength={7}
                    maxLength={7}
                    placeholder="ABC1234"
                    className="mb-5 w-full bg-gray-100 p-2 border-b"
                />

                <p className="font-bold">Expiration</p>
                <input
                    type="date"
                    name="expiration"
                    value={vehicle.expiration}
                    onChange={handleChange}
                    className="mb-5 w-full bg-gray-100 p-2 border-b"
                />

                <p className="font-bold">Upload OR/CR</p>
                <input
                    type="file"
                    name="orcr"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                        setVehicle({
                            ...vehicle,
                            orcr: e.target.files[0],
                        })
                    }
                    className="mb-5 w-full"
                />

                <p className="font-bold">Vehicle Image</p>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) =>
                        setVehicle({
                            ...vehicle,
                            image: e.target.files[0],
                        })
                    }
                    className="mb-5 w-full"
                />

                <p className="font-bold">Number of Seaters</p>
                <input
                    type="number"
                    name="seater"
                    value={vehicle.seater}
                    onChange={handleChange}
                    placeholder="4"
                    className="mb-5 w-full bg-gray-100 p-2 border-b"
                />

                <p className="font-bold">RFID Balance</p>
                <input
                    type="number"
                    name="rfid_balance"
                    value={vehicle.rfid_balance}
                    onChange={handleChange}
                    placeholder="Available Balance"
                    className="mb-5 w-full bg-gray-100 p-2 border-b"
                />               

                </div>                
                <button
                    type="submit"
                    className="bg-blue-900 text-white w-full p-3 rounded hover:bg-blue-800"
                >
                    Register
                </button>

            </form>
        </div>
    );
}

export default AddVehicles;