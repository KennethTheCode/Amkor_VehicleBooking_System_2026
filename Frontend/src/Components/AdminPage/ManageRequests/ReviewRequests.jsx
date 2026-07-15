import React, { useState, useEffect } from "react";

function ReviewRequests() {
    const [showModal, setShowModal] = useState(false)
  return (
    <div>
        <button 
        onClick={() => setShowModal(true)}
        className="w-full bg-green-500 hover:bg-green-400 duration-300 text-white font-bold rounded cursor-pointer">
            Review
        </button>
        {showModal && (
            <div className="bg-black/20 fixed inset-0 h-screen flex items-center justify-center z-100">
                <div className="bg-white h-[70vh] h-[50vh] rounded w-[80vh]">

                </div>
            </div>
        )}
    </div>
  )
}

export default ReviewRequests