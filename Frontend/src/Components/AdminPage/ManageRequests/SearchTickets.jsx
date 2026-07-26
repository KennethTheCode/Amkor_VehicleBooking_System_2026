import React, { useEffect, useRef } from "react";

import { API_BASE } from '../../../config'

const DEBOUNCE_MS = 300;

function SearchTickets({ value, onChange, onResults }) {
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = value.trim();

    // Empty box — tell the parent there's no active search, so it can
    // fall back to showing its full list.
    if (trimmed === "") {
      onResults(null);
      return;
    }

    const controller = new AbortController();

    debounceRef.current = setTimeout(() => {
      fetch(
        `${API_BASE}/ManageRequests/SearchTickets.php?q=${encodeURIComponent(trimmed)}`,
        { cache: "no-store", signal: controller.signal }
      )
        .then((res) => res.json())
        .then((json) => {
          onResults(Array.isArray(json) ? json : []);
        })
        .catch((err) => {
          if (err.name === "AbortError") return; // superseded by a newer search, ignore
          console.error(err);
          onResults([]);
        });
    }, DEBOUNCE_MS);

    // Cancel both the pending timer AND any in-flight request tied to the
    // previous value, so a slow response can never arrive after the term
    // has already changed (or been cleared) and overwrite fresher state.
    return () => {
      clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [value]);

  return (
    <div className="p-5 w-[70%] flex justify-center">
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
          search
        </span>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search ID..."
          className="w-full pl-12 pr-5 py-2 rounded-full shadow-xl bg-pink-50/40 border border-gray-200 focus:outline-none"
        />
      </div>
    </div>
  );
}

export default SearchTickets;