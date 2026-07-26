import React, { useEffect, useState } from "react";

import { API_BASE } from '../../config'

function PrintInvoice({ ticket_id }) {
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!ticket_id) return;

        setIsLoading(true);

        fetch(
            `${API_BASE}/ManageRequests/LoadOdometer.php?ticket_id=${ticket_id}`,
            { cache: "no-store" }
        )
            .then((res) => res.json())
            .then((json) => {
                const match = Array.isArray(json)
                    ? json.find((item) => String(item.ticket_id) === String(ticket_id))
                    : null;
                setTrip(match ?? null);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, [ticket_id]);

    const handlePrint = () => window.print();

    if (isLoading) {
        return <p className="text-center font-bold py-10">Loading invoice...</p>;
    }

    if (!trip) {
        return (
            <p className="text-center font-bold text-gray-500 py-10">
                No finished trip found for this ticket.
            </p>
        );
    }

    const today = new Date().toLocaleDateString();

    return (
        <div className="max-w-3xl mx-auto p-6 print:p-0 print:max-w-full">

            {/* Tailwind has no utility for @page, so this stays as a real <style> tag */}
            <style>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                }
            `}</style>

            {/* Toolbar: fully hidden when printed */}
            <div className="flex justify-end gap-2 mb-4 print:hidden">
                <button
                    onClick={handlePrint}
                    className="bg-blue-800 text-white font-bold px-4 py-2 rounded shadow hover:bg-blue-900"
                >
                    Print Invoice
                </button>
            </div>

            {/* Invoice sheet */}
            <div className="bg-white shadow-lg rounded-lg print:shadow-none print:rounded-none border border-gray-200 print:border-0">

                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-blue-800 print:bg-white rounded-t-lg print:rounded-none">
                    <div>
                        <h1 className="text-white print:text-black text-2xl font-bold tracking-wide">
                            INVOICE
                        </h1>
                        <p className="text-white print:text-black text-sm mt-1">
                            Ticket ID: {trip.ticket_id}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-white print:text-black text-sm">Date Issued</p>
                        <p className="text-white print:text-black font-bold">{today}</p>
                    </div>
                </div>

                {/* Driver / vehicle / route info */}
                <div className="grid grid-cols-2 gap-4 p-6 text-sm border-b border-gray-200">
                    <div>
                        <p className="text-gray-500 font-bold mb-1">Driver</p>
                        <p className="font-bold">{trip.driver_username ?? "No Driver"}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 font-bold mb-1">Vehicle</p>
                        <p className="font-bold">{trip.vehicle_model ?? "N/A"}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-bold mb-1">Pick-up</p>
                        <p className="font-bold text-blue-800 print:text-black">{trip.pick_up}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 font-bold mb-1">Drop-off</p>
                        <p className="font-bold text-red-800 print:text-black">{trip.drop_off}</p>
                    </div>
                </div>

                {/* Trip breakdown table */}
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="p-3 font-bold text-gray-600">Description</th>
                            <th className="p-3 font-bold text-gray-600 text-right">Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-200 break-inside-avoid">
                            <td className="p-3">Odometer (Start → End)</td>
                            <td className="p-3 text-right font-bold">
                                {trip.beginning} → {trip.ending}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200 break-inside-avoid">
                            <td className="p-3">Distance Travelled</td>
                            <td className="p-3 text-right font-bold">
                                {trip.distance_travelled !== null
                                    ? `${trip.distance_travelled} km`
                                    : "—"}
                            </td>
                        </tr>
                        <tr className="border-b border-gray-200 break-inside-avoid">
                            <td className="p-3">Time Out</td>
                            <td className="p-3 text-right font-bold">{trip.time_out}</td>
                        </tr>
                        <tr className="border-b border-gray-200 break-inside-avoid">
                            <td className="p-3">Time In</td>
                            <td className="p-3 text-right font-bold">{trip.time_in}</td>
                        </tr>
                        <tr className="border-b border-gray-200 break-inside-avoid">
                            <td className="p-3">RFID Balance</td>
                            <td className="p-3 text-right font-bold">{trip.rfid_balance ?? "—"}</td>
                        </tr>
                        <tr className="border-b border-gray-200 break-inside-avoid">
                            <td className="p-3">Date Finished</td>
                            <td className="p-3 text-right font-bold">{trip.date_finished}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Signatures */}
                <div className="flex justify-between items-end p-6 text-sm print:break-inside-avoid">
                    <p className="border-t border-gray-400 pt-1 w-40 text-center">
                        Driver Signature
                    </p>
                    <p className="border-t border-gray-400 pt-1 w-40 text-center">
                        Authorized Signature
                    </p>
                </div>

            </div>

        </div>
    );
}

export default PrintInvoice;