import React, { useEffect, useState } from "react";
import AmkorLogo from "../../Images/AmkorLogo.png";

function RequestRide() {
    // Logged in user
    const user = JSON.parse(localStorage.getItem("user"));

    // Available vehicles
    const [vehicles, setVehicles] = useState([]);

    // Selected vehicle
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Review modal
    const [showModal, setShowModal] = useState(false);

    // Booking details
    const [booking, setBooking] = useState({
        pick_up: "",
        drop_off: "",
        passengers: 1,
        purpose: "",
        date_needed: "",
        time_needed: "",
    });

    // Passenger names
    const [passengerNames, setPassengerNames] = useState([]);

    useEffect(() => {
        fetch(
            "http://amkor-vehicle-booking-system-2026.ct.ws/Backend/ManageVehicles/LoadVehicles.php"
        )
            .then((res) => res.json())
            .then((data) => {
                setVehicles(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        setPassengerNames(
            Array(Number(booking.passengers)).fill("")
        );
    }, [booking.passengers]);

    const handleVehicleClick = (vehicle) => {
        setSelectedVehicle(vehicle);
    };

    const handlePassengerChange = (index, value) => {
        const updated = [...passengerNames];
        updated[index] = value;
        setPassengerNames(updated);
    };

    const reviewBooking = () => {
        if (!selectedVehicle) {
            alert("Please select a vehicle.");
            return;
        }

        if (
            booking.pick_up === "" ||
            booking.drop_off === "" ||
            booking.date_needed === "" ||
            booking.time_needed === "" ||
            booking.purpose === ""
        ) {
            alert("Please complete all required fields.");
            return;
        }

        setShowModal(true);
    };

   const submitBooking = async () => {

    const payload = {
    user_id: user.user_id,
    vehicle_id: selectedVehicle.id, 
    pick_up: booking.pick_up,
    drop_off: booking.drop_off,
    purpose: booking.purpose,
    passengers: booking.passengers,
    date_needed: booking.date_needed,
    time_needed: booking.time_needed,
    passenger_names: passengerNames,
};

    try {

        const response = await fetch(
            "http://amkor-vehicle-booking-system-2026.ct.ws/Backend/ManageRequests/AddRequest.php",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        alert(data.message);

        if (data.success) {
            setShowModal(false);

            // Optional: reload or reset the form
            window.location.reload();
        }

    } catch (err) {
        console.error(err);
        alert("Unable to connect to the server.");
    }

};

    return (
        <div className="w-[60vh] h-screen p-5 border-r border-gray-300">

            <div className="flex flex-col">

                <h1 className="font-bold text-[16px] text-blue-900">
                    Select Location
                </h1>

                <div className="bg-white w-full shadow-xl p-3 mt-2">

                    <div className="flex items-center gap-2 border-b border-gray-300 py-3">

                        <span className="material-symbols-outlined text-gray-500">
                            location_on
                        </span>

                        <input
                            value={booking.pick_up}
                            onChange={(e) =>
                                setBooking({
                                    ...booking,
                                    pick_up: e.target.value,
                                })
                            }
                            placeholder="Pick-up Location"
                            className="w-full outline-none"
                        />

                    </div>

                    <div className="flex items-center gap-2 border-b border-gray-300 py-3">

                        <span className="material-symbols-outlined text-gray-500">
                            distance
                        </span>

                        <input
                            value={booking.drop_off}
                            onChange={(e) =>
                                setBooking({
                                    ...booking,
                                    drop_off: e.target.value,
                                })
                            }
                            placeholder="Drop-off Location"
                            className="w-full outline-none"
                        />

                    </div>

                </div>

                <h1 className="font-bold text-blue-900 mt-5 mb-2">
                    Select Vehicle
                </h1>

                <div className="bg-gray-100 overflow-x-auto">

                    <div className="flex gap-3 p-2 w-max">

                        {vehicles
                            .filter(v => Number(v.availability) === 1)
                            .map(vehicle => (

                                <div
                                    key={vehicle.vehicle_id}
                                    onClick={() => handleVehicleClick(vehicle)}
                                    className={`cursor-pointer rounded border bg-white h-[20vh] w-[15vh]
                                    ${
                                        selectedVehicle?.vehicle_id === vehicle.vehicle_id
                                            ? "border-blue-600 border-2"
                                            : "border-gray-300"
                                    }`}
                                >

                                    <div className="h-[15vh] flex justify-center items-center">

                                        <img
                                            src={
                                                vehicle.image
                                                    ? `http://amkor-vehicle-booking-system-2026.ct.ws/Backend/${vehicle.image}`
                                                    : AmkorLogo
                                            }
                                            alt={vehicle.vehicle_model}
                                            className="h-[10vh] object-contain"
                                        />

                                    </div>

                                    <div className="text-center">

                                        <p className="font-bold text-[12px] text-blue-900">
                                            {vehicle.vehicle_model}
                                        </p>

                                    </div>

                                </div>

                            ))}

                    </div>

                </div>

                {selectedVehicle && (

                    <div className="bg-blue-50 rounded mt-3 p-2">

                        <strong>Selected Vehicle:</strong>{" "}
                        {selectedVehicle.vehicle_model}

                    </div>

                )}

                <h1 className="font-bold text-blue-900 mt-5 mb-2">
                    Number of Passengers
                </h1>

                <input
                    type="number"
                    min={1}
                    value={booking.passengers}
                    onChange={(e) =>
                        setBooking({
                            ...booking,
                            passengers: e.target.value,
                        })
                    }
                    className="bg-gray-100 p-3 rounded outline-none"
                />

                <h1 className="font-bold text-blue-900 mt-5 mb-2">
                    Purpose of Request
                </h1>

                <textarea
                    rows={3}
                    value={booking.purpose}
                    onChange={(e) =>
                        setBooking({
                            ...booking,
                            purpose: e.target.value,
                        })
                    }
                    className="bg-gray-100 rounded p-3 resize-none outline-none"
                />
                <div className="flex flex-col ">
                    <h1 className="font-bold text-blue-900 mt-5 mb-2">
                    Number of Passengers
                    </h1>
                    <div className="flex gap-3 ">
                        <input
                            type="date"
                            value={booking.date_needed}
                            onChange={(e) =>
                                setBooking({
                                    ...booking,
                                    date_needed: e.target.value,
                                })
                            }
                            className="bg-gray-100 p-3 rounded w-1/2"
                        />
                        <input
                            type="time"
                            value={booking.time_needed}
                            onChange={(e) =>
                                setBooking({
                                    ...booking,
                                    time_needed: e.target.value,
                                })
                            }
                            className="bg-gray-100 p-3 rounded w-1/2"
                        />

                    </div>
                </div>
                <button
                    onClick={reviewBooking}
                    className="bg-blue-800 font-bold text-white p-3 rounded mt-5 hover:bg-blue-900 transition-colors duration-300"
                >
                    Review Booking
                </button>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-[70vh] max-h-[90vh] overflow-y-auto p-6">

                            <h1 className="text-2xl font-bold text-blue-900 mb-5 hover:duration-300 transition-colors ">
                                Review Booking
                            </h1>

                            {/* Booking Summary */}
                            <div className="bg-gray-100 rounded p-4 mb-5 space-y-2">

                                <div className="flex justify-between">
                                    <span className="font-bold">Vehicle</span>
                                    <span>
                                        {selectedVehicle
                                            ? selectedVehicle.vehicle_model
                                            : "None"}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Pick-up</span>
                                    <span>{booking.pick_up}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Drop-off</span>
                                    <span>{booking.drop_off}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Passengers</span>
                                    <span>{booking.passengers}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Date</span>
                                    <span>{booking.date_needed}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Time</span>
                                    <span>{booking.time_needed}</span>
                                </div>

                            </div>

                            {/* Passenger Names */}
                            <div className="mb-5">

                                <h2 className="font-bold text-blue-900 mb-3">
                                    Passenger Names
                                </h2>

                                <div className="space-y-3">

                                    {passengerNames.map((name, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            placeholder={`Passenger ${index + 1}`}
                                            value={name}
                                            onChange={(e) => {
                                                const updated = [...passengerNames];
                                                updated[index] = e.target.value;
                                                setPassengerNames(updated);
                                            }}
                                            className="w-full p-2 bg-gray-100 border rounded outline-none"
                                        />
                                    ))}

                                </div>

                            </div>

                            {/* Purpose */}
                            <div className="mb-5">

                                <h2 className="font-bold text-blue-900 mb-2">
                                    Purpose of Request
                                </h2>

                                <textarea
                                    rows="4"
                                    placeholder="Enter purpose..."
                                    value={booking.purpose}
                                    onChange={(e) =>
                                        setBooking({
                                            ...booking,
                                            purpose: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 bg-gray-100 border rounded outline-none resize-none"
                                />

                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold px-6 py-2 rounded"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    onClick={submitBooking}
                                    className="bg-blue-800 hover:bg-blue-900 duration-300 transition-colors text-white font-bold px-6 py-2 rounded"
                                >
                                    Submit Booking
                                </button>

                            </div>

                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

export default RequestRide;