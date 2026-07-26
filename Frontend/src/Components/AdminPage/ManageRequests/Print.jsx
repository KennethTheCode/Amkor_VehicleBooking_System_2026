import React from 'react'

function Print({ ticketId, getTarget }) {
    const handlePrint = () => {
        const cardEl = getTarget ? getTarget() : null;
        if (!cardEl) return;

        const printWindow = window.open("", "_blank", "width=1000,height=900");
        if (!printWindow) {
            // Popup blocked by the browser
            alert("Please allow pop-ups to print this ticket.");
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Ticket ${ticketId ?? ""}</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>
                        body { margin: 0; padding: 16px; font-family: sans-serif; }
                        button { display: none !important; }
                    </style>
                </head>
                <body>
                    ${cardEl.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();

        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
        };

        printWindow.onafterprint = () => {
            printWindow.close();
        };
    };

    return (
        <div>
            <button
                onClick={handlePrint}
                className="text-white px-1 py-1 rounded text-[10px] hover:bg-blue-400 duration-300 transition-colors cursor-pointer"
            >
                <p className="flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined">print</span>
                </p>
            </button>
        </div>
    )
}

export default Print