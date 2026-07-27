import React, { useEffect, useRef, useState } from "react";

import { API_BASE } from '../../../config'
import LoadOdometerID from "./LoadOdometerID";
import Print from "./Print";

function ListView({ searchTerm = "", searchResults = null, onTicketDeleted }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const cardRef = useRef(null);

    const loadTickets = () => {
        setIsLoading(true);

        fetch(`${API_BASE}/ManageRequests/FinalTickets.php`, {
            cache: "no-store",
        })
            .then((res) => res.json())
            .then((json) => {
                const finished = Array.isArray(json)
                    ? json.filter((item) => item.finished_id !== null)
                    : [];

               
                const uniqueTickets = Array.from(
                    new Map(finished.map((item) => [item.ticket_id, item])).values()
                );

                setTickets(uniqueTickets);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadTickets();
    }, []);

    // Reload the full list fresh from the server whenever the search bar
    // transitions from "active" back to "cleared", instead of just
    // falling back to whatever was already loaded before the search began.
    const prevSearchResults = useRef(searchResults);
    useEffect(() => {
        const wasSearching = prevSearchResults.current !== null;
        const isSearchingNow = searchResults !== null;

        if (wasSearching && !isSearchingNow) {
            loadTickets();
        }

        prevSearchResults.current = searchResults;
    }, [searchResults]);

    const handleDelete = async (ticket_id) => {
        if (
            !window.confirm(
                `Delete Ticket #${ticket_id}? This also removes its finished trip records. This cannot be undone.`
            )
        ) {
            return;
        }

        setDeletingId(ticket_id);

        try {
            const response = await fetch(`${API_BASE}/ManageRequests/DeleteTicket.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ticket_id }),
            });

            const raw = await response.text();

            let result;
            try {
                result = JSON.parse(raw);
            } catch (parseError) {
                console.error("Server did not return JSON:", raw);
                alert(`Server error (HTTP ${response.status}) while deleting.`);
                return;
            }

            if (!response.ok || !result.success) {
                console.error("Delete failed:", response.status, result);
                alert(result.message || "Failed to delete this ticket.");
                return;
            }

            setTickets((prev) => prev.filter((t) => t.ticket_id !== ticket_id));
            onTicketDeleted?.(ticket_id);

            setSelectedTicket((prev) =>
                prev && prev.ticket_id === ticket_id ? null : prev
            );

            if (result.message) alert(result.message);
        } catch (error) {
            console.error(error);
            alert("Unable to connect to the server. Is Apache/XAMPP running?");
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return <p className="text-center font-bold py-10">Loading...</p>;
    }

    if (tickets.length === 0) {
        return (
            <p className="text-center font-bold text-gray-500 py-10">
                No Finished Tickets Found
            </p>
        );
    }

    // When a search is active (searchResults !== null), show exactly what
    // came back, even if empty. Otherwise show everything loaded above.
    const displayedTickets = searchResults !== null ? searchResults : tickets;

    return (
    <div className="w-full">
        <div className="flex items-center  border-b border-pink-500 pb-1 text-pink-600 font-semibold text-[12px] sm:text-[14px]">
            <div className="w-[15vh] sm:w-[10vh]">Ticket #</div>
            <div className="w-[53vh]">
                Location
            </div>
            <div className="sm:w-[35vh] hidden sm:block">
                Date Requested
            </div>
            <div className="flex justify-between sm:w-[25vh] hidden sm:block">
                <p>Requestor</p>
                <p>Driver</p>
               
            </div>
        </div>

        {displayedTickets.length === 0 ? (
            <p className="text-center font-bold text-gray-500 py-10">
                No tickets match "{searchTerm}"
            </p>
        ) : (
        <div className="flex flex-col overflow-y-auto  w-full h-[90vh] px-2">
            {displayedTickets.map((item) => (
                <div
                    key={item.ticket_id}
                    className="border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer duration-300 transition-colors">
                            <div className="flex justify-betwen items-center">
                                
                                {/* Ticket */}
                                <div className="w-[6vh] flex justify-center items-center text-[15px] text-gray-500 font-semibold">
                                    {item.ticket_id}
                                </div>

                                {/* Pick Up */}
                                <div className=" ml-[5vh] sm:ml-[4vh] items-center flex justify-between w-[20vh] sm:w-[52vh] text-[14px] pr-6">
                                    <p className="font-semibold truncate break-word w-50">{item.pick_up}</p>
                                    <p> →</p>                                    
                                    <p className="font-semibold text-end  truncate w-50">{item.drop_off}</p>                                                                        
                                </div>
                                
                                {/* Date Requested */}
                                <div className="text-gray-400  items-center flex gap-3  ml-2  hidden sm:block sm:w-[35vh] text-[12px]">
                                    <p className="font-semibold">{item.date_needed}</p>
                                    <p className="font-semibold">{item.time_needed}</p>                                                                        
                                </div>

                                {/* Date Requested */}
                                <div className="text-gray-500  items-center flex gap-3 text-[14px]  w-[20vh] hidden sm:block">
                                    <div className="bg-gray-500 rounded-full p-1">

                                    </div>
                                    <p className="font-semibold text-gray-500 break-truncate">{item.username}</p>                                                                        
                                </div>

                                <div className="text-gray-500  items-center flex gap-3 text-[14px]  w-[15vh] hidden sm:block">
                                        <div className="bg-gray-500 rounded-full p-1">

                                        </div>
                                    <p className="font-semibold text-gray-500 truncate">{item.driver_username}</p>                                                                        
                                </div>
                                
                                <div className="flex justify-end w-[20vh]">
                                    <div className="flex gap-1 text-gray-400">
                                        <button
                                        onClick={() => setSelectedTicket(item)}
                                        className="px-1 py-1 rounded text-[10px] hover:bg-blue-400 duration-300 transition-colors cursor-pointer"><p className="flex items-center justify-center gap-1"><span className="material-symbols-outlined">print</span></p></button>
                                        <button
                                        onClick={() => handleDelete(item.ticket_id)}
                                        disabled={deletingId === item.ticket_id}
                                        className="px-1 py-1 rounded text-[10px] hover:bg-red-400 duration-300 transition-colors cursor-pointer disabled:opacity-50"><p className="flex items-center justify-center gap-1"><span className="material-symbols-outlined">{deletingId === item.ticket_id ? "hourglass_empty" : "delete"}</span> </p></button>
                                    </div>
                                </div>
                            </div>                                                
                </div>
            ))}
        </div>
        )}

        {selectedTicket && (
            <div
                onClick={() => setSelectedTicket(null)}
                className="z-100 h-screen bg-black/20 inset-0 fixed flex items-center justify-center"
            >
                <div
                    ref={cardRef}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white shadow rounded-lg flex flex-col border border-gray-200 h-fit w-[45vh]"
                >
                    {/* Header */}
                    <div className="bg-pink-500 text-white border-b-3 border-pink-400 p-2 flex justify-between items-center">
                        <p className="font-bold">Ticket ID: {selectedTicket.ticket_id}</p>
                        <div className="flex gap-1 no-print">
                            <Print
                                ticketId={selectedTicket.ticket_id}
                                getTarget={() => cardRef.current}
                            />
                            <button
                                onClick={() => handleDelete(selectedTicket.ticket_id)}
                                disabled={deletingId === selectedTicket.ticket_id}
                                className="text-white px-1 py-1 rounded text-[10px] hover:bg-red-400 duration-300 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">
                                    {deletingId === selectedTicket.ticket_id ? "hourglass_empty" : "delete"}
                                </span>
                            </button>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-white px-1 py-1 rounded text-[10px] hover:bg-red-400 duration-300 transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    {/* Requestor / Driver details */}
                    <div className="p-2 flex flex-col gap-1">
                        <div className="flex justify-between gap-2">
                            <div className="border border-gray-300 p-1 px-2 flex flex-col gap-1 w-full h-25 overflow-y-auto">
                                <p className="text-[14px] font-bold">Requestor Details</p>

                                <div className="flex justify-between text-[12px]">
                                    <p>Username:</p>
                                    <p className="break-all text-gray-500">{selectedTicket.username}</p>
                                </div>

                                <div className="flex justify-between text-[12px]">
                                    <p>Passengers:</p>
                                    <p className="text-gray-500 break-word w-20 text-end">{selectedTicket.passengers}</p>
                                </div>
                            </div>

                            <div className="border border-gray-300 p-1 flex flex-col gap-1 w-full h-25 overflow-y-auto">
                                <p className="text-[14px] font-bold">Driver Details</p>

                                <div className="flex justify-between text-[12px]">
                                    <p>Username:</p>
                                    <p className="break-all text-gray-500 w-20">{selectedTicket.driver_username}</p>
                                </div>

                                <div className="flex justify-between text-[12px]">
                                    <p>Vehicle:</p>
                                    <p className="break-all text-gray-500">{selectedTicket.vehicle_model}</p>
                                </div>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="p-2 bg-white bg-pink-100 border-b-2 border-pink-200 ">
                            <p className="text-[14px] font-semibold text-gray-700">Purpose of Request:</p>
                            <p className="text-[12px] text-gray-500 font-bold break-word">{selectedTicket.purpose}</p>
                        </div>

                        {/* Odometer — LoadOdometerID fetches its own data by ticket_id */}
                        <LoadOdometerID ticket={selectedTicket.ticket_id} />
                    </div>
                </div>
            </div>
        )}
    </div>
    );
}

export default ListView;