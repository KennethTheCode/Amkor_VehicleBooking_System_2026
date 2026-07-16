import React from "react";
import EditOdometer from "./EditOdometer";

function OngoingVehicles({ requests = [] }) {

    console.log("Ongoing data:", requests);

    const ongoing = requests.filter(
        (item) => item.status === "Ongoing"
    );

    return (
        <div className="w-full flex flex-col items-center p-2">

            <p className="text-blue-800 font-bold text-[15px]">
                Ongoing Requests
            </p>
            
            <div className="w-full h-[20vh] bg-gray-100 rounded p-1 flex flex-col overflow-y-auto gap-2">
            
                {ongoing.map((item)=>(
                    <div
                        key={item.ticket_id}
                         className='bg-white flex justify-between p-1 border-gray-200 shadow-xl border'>
                        <div className='h-full w-[10vh] flex flex-col gap-2'>
                        <div className='flex justify-center items-center flex-col'>
                                <div className='flex justify-center items-center'>
                                    <span className='material-symbols-outlined text-blue-800'>location_on</span>
                                    <p className='text-blue-800 font-bold text-[14px] truncate w-[8vh]'>{item.pick_up}</p>
                                </div>
                            <p className='text-gray-400 font-bold text-[10px]'>{item.date_needed}</p>
                        </div>
                        <div className='flex justify-center items-center flex-col'>

                            <div className='flex justify-center items-center'>
                                <span className='material-symbols-outlined text-red-800'>distance</span>
                                <p className='text-red-800 font-bold text-[14px] truncate w-[8vh]'>{item.drop_off ?? '00:00:00'}</p>
                            </div>
                            <p className='text-gray-400 font-bold text-[10px]'>{item.date_ended ?? '0000-00-00'}</p>
                        </div>
                        </div>
                        <div className="">
                            <p className='text-gray-500 font-bold text-[13px] w-[15vh] '>{item.username ?? '0000-00-00'}</p>
                            <p className='text-gray-400 font-bold text-[12px] w-[15vh] '>{item.vehicle_model ?? '0000-00-00'}</p>
                            <EditOdometer request={item}/>
                        </div>
                    </div>
                ))}

                

            </div>

        </div>
    );
}

export default OngoingVehicles;