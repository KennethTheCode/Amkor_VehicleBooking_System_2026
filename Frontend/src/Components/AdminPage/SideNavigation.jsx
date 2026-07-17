import React, { useState, useEffect } from "react";

import OngoingVehicles from "./OngoingVehicles";
import AvailableDrivers from "./AvailableDrivers";
import AvailableVehicles from "./AvailableVehicles";


function SideNavigation({ requests = null }) {

    const [showModal, setShowModal] = useState(false);

    const [data, setData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);


    // Load Vehicles
    useEffect(() => {

        fetch(
            "http://amkor-vehicle-booking-system-2026.ct.ws/Backend/ManageVehicles/LoadVehicles.php",
            {
                cache: "no-store",
            }
        )
        .then((res) => res.json())
        .then((json) => {

            if (Array.isArray(json)) {
                setVehicles(json);
            } else {
                setVehicles([]);
            }

        })
        .catch((err) => {
            console.error("Vehicle Error:", err);
        });

    }, []);



    // Load Drivers
    useEffect(() => {

        fetch(
            "http://amkor-vehicle-booking-system-2026.ct.ws/Backend/ManageDrivers/LoadDrivers.php",
            {
                cache: "no-store",
            }
        )
        .then((res) => res.json())
        .then((json) => {

            if (Array.isArray(json)) {
                setDrivers(json);
            } else {
                setDrivers([]);
            }

        })
        .catch((err) => {
            console.error("Driver Error:", err);
        });

    }, []);




    const BACKEND_URL =
        "http://amkor-vehicle-booking-system-2026.ct.ws/Backend/ManageRequests/LoadRequests.php";



    // Load Requests
    const loadRequests = () => {

        setIsSearching(true);


        // If requests are passed from parent
        if (Array.isArray(requests) && requests.length > 0) {

            console.log("Using passed requests:", requests);

            setData(requests);

            setIsSearching(false);

            return;
        }



        fetch(BACKEND_URL, {
            cache: "no-store",
        })

        .then((res) => res.json())

        .then((json) => {

            console.log("LoadRequests result:", json);


            if (Array.isArray(json)) {

                setData(json);

            } else {

                setData([]);

            }


            setIsSearching(false);

        })


        .catch((err) => {

            console.error("Request Error:", err);

            setData([]);

            setIsSearching(false);

        });

    };




    useEffect(() => {

        loadRequests();

    }, [requests]);




    return (

        <div className="bg-white shadow-lg h-[80vh] w-[45vh] flex flex-col items-center">


            <button
                onClick={() => setShowModal(true)}
                className="
                    flex 
                    items-center 
                    justify-center 
                    bg-blue-900 
                    p-2 
                    w-full 
                    hover:bg-blue-800 
                    transition-colors 
                    duration-300 
                    cursor-pointer
                "
            >

                <p className="text-white font-bold text-[18px]">
                    View History
                </p>

            </button>



            {showModal && (

                <div 
                    className="
                        fixed 
                        inset-0 
                        bg-black/20
                    "
                    onClick={() => setShowModal(false)}
                >

                </div>

            )}

            <OngoingVehicles requests={data} />

            <div className="flex flex-col gap-3 p-5 w-full">


                <AvailableDrivers 
                    drivers={drivers} 
                />



                <AvailableVehicles 
                    vehicles={vehicles} 
                />


            </div>


        </div>

    );

}


export default SideNavigation;