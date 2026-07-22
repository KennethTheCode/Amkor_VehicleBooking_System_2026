import React, { useState } from "react";

function FilterRequests({ onFilterChange }) {
    const [selected, setSelected] = useState("");

    const handleChange = (e) => {
        const value = e.target.value;
        setSelected(value);

        // Let the parent (e.g. LoadRequests) know the filter changed
        // so it can re-fetch data from FilterRequests.php.
        if (onFilterChange) {
            onFilterChange(value);
        }
    };

    return (
        <div>
            <select
                value={selected}
                onChange={handleChange}
                className="bg-white w-[10vh] text-[13px] sm:w-[15vh] p-2 border border-gray-300 text-gray-500 font-bold"
            >
                <option value="">
                    Filter By
                </option>

                <option value="Most Recent">
                    Most Recent
                </option>

                <option value="Oldest">
                    Oldest
                </option>

                <option value="Pending">
                    Pending
                </option>

                <option value="Rejected">
                    Rejected
                </option>

                <option value="Approved">
                    Approved
                </option>
            </select>
        </div>
    );
}

export default FilterRequests;