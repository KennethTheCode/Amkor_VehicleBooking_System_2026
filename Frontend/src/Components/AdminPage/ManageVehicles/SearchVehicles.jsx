import React, { useEffect, useRef, useState } from "react";

import { API_BASE } from '../../../config'

function SearchVehicles( {onSearch} ) {
  const [keyword, setKeyword] = useState("");
  const debounceRef = useRef(null);

  const doSearch = async (value) => {
    try {
      const response = await fetch(
        `${API_BASE}/ManageVehicles/SearchVehicles.php`,
        {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ keyword: value }),
          }
      );

      const data = await response.json();
      onSearch(data);
    } catch (error) {
      console.error(error);
      alert("Unable to connect");
    }
  };

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      doSearch(keyword);
    }, 300);

    return () => {
      if (debounceRef.current){
        clearTimeout(debounceRef.current);
      };
    };
  }, [keyword]);
  
  return (
    <div className='top-0 sticky z-50 bg-white w-full p-2'>
      <input
      type="text"
      name="keyword"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      placeholder='Search Vehicles'
      className='p-1 text-[15px] font-bold text-gray-700 border-gray-200 border-b-2 w-full bg-gray-100'>
      </input>
    </div>
    
  )
}

export default SearchVehicles