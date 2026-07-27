import React, { useEffect, useRef, useState } from "react";

import { API_BASE } from '../../../config'
import LoadOdometerID from "./LoadOdometerID";
import Print from "./Print";


function GridViewDefault({ searchTerm = "", searchResults = null, onTicketDeleted }) {
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const cardRefs = useRef({});


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

    const displayedTickets =
        searchResults !== null
            ? Array.from(
                  new Map(searchResults.map((item) => [item.ticket_id, item])).values()
              )
            : tickets;

    if (displayedTickets.length === 0) {
        return (
            <p className="text-center font-bold text-gray-500 py-10">
                No tickets match "{searchTerm}"
            </p>
        );
    }

    return (
        <div className="border-t border-pink-300 flex flex-col columns-1 sm:flex-row sm:columns-4 gap-4 py-4 w-[150vh] h-[110vh] overflow-y-auto">
            {displayedTickets.map((item) => (
                <div
                    key={item.ticket_id}
                    ref={(el) => (cardRefs.current[item.ticket_id] = el)}
                    className="bg-white shadow rounded-lg flex flex-col border border-gray-200 h-fit w-full mb-4 break-inside-avoid"
                >
                    {/* Header */}
                    <div className="bg-pink-500 text-white border-b-3 border-pink-400 p-2 flex justify-between items-center">
                        <p className="font-bold">Ticket ID: {item.ticket_id}</p>
                        <div className="flex gap-1 no-print">
                            <Print
                                ticketId={item.ticket_id}
                                getTarget={() => cardRefs.current[item.ticket_id]}
                            />
                            <button
                                onClick={() => handleDelete(item.ticket_id)}
                                disabled={deletingId === item.ticket_id}
                                className="text-white px-1 py-1 rounded text-[10px] hover:bg-red-400 duration-300 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                <p className="flex items-center justify-center gap-1">
                                    <span className="material-symbols-outlined">
                                        {deletingId === item.ticket_id ? "hourglass_empty" : "delete"}
                                    </span>
                                </p>
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
                                    <p className="break-all text-gray-500">{item.username}</p>
                                </div>

                                <div className="flex justify-between text-[12px]">
                                    <p>Passengers:</p>
                                    <p className="text-gray-500 break-word w-20 text-end">{item.passengers}</p>
                                </div>

                                
                            </div>

                            <div className="border border-gray-300 p-1 flex flex-col gap-1 w-full h-25 overflow-y-auto">
                                <p className="text-[14px] font-bold">Driver Details</p>

                                <div className="flex justify-between text-[12px]">
                                    <p>Username:</p>
                                    <p className="break-all text-gray-500 w-20">{item.driver_username}</p>
                                </div>

                                <div className="flex justify-between text-[12px]">
                                    <p>Vehicle:</p>
                                    <p className="break-all text-gray-500">{item.vehicle_model}</p>
                                </div>
                            </div>
                        </div>
                        {/* Purpose */}
                        <div className="p-2 bg-white bg-pink-100 border-b-2 border-pink-200 ">
                            <p className="text-[14px] font-semibold text-gray-700">Purpose of Request:</p>
                            <p className="text-[12px] text-gray-500 font-bold break-word">{item.purpose}</p>
                        </div>

                        {/* Odometer — LoadOdometerID fetches its own data by ticket_id */}
                        <LoadOdometerID ticket={item.ticket_id} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default GridViewDefault;