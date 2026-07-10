import React from 'react'

function FilterRequests() {
  return (
    <div>
        <select className='bg-white w-[15vh] p-2 border border-gray-300 text-gray-500 font-bold text-[14px]'>
            <option
            value=""
            >
            Filter By
            </option>

            <option
            value="Most Recent"
            >
            Most Recent
            </option>

            <option
            value="Oldest"
            >
            Oldest
            </option>

            <option
            value="Priority"
            >
            Priority
            </option>

            <option
            value="Other location"
            >
            Other location
            </option>
        </select>
    </div>
  )
}

export default FilterRequests