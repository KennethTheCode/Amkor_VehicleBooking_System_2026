import React, { useState } from 'react'
import Navbar from '../../Navbar'
import Dashboard from '../Dashboard'
import FilterFinished from '../FilterRequests/FilterFinished'
import GridViewDefault from './GridViewDefault'
import ListView from './ListView'
import SearchTickets from './SearchTickets'

function LoadFinishedTickets() {
    const [view, setView] = useState('grid'); // 'grid' | 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null); 


    const handleTicketDeleted = (ticket_id) => {
        setSearchResults((prev) =>
            prev !== null ? prev.filter((t) => t.ticket_id !== ticket_id) : prev
        );
    };

    return (
        <div>
            <Navbar/>
            {/* General div */}
            <div className="bg-gray-100 px-2 flex flex-col sm:px-[20vh] pt-3 py-4 h-screen gap-3">
                <Dashboard />

                {/* Parent div */}
                <div className='p-5 w-full bg-white rounded'>
                    <div className='flex justify-between items-center pb-4'>
                        <p className='font-bold text-[20px] text-pink-500'>Manage Finished Tickets</p>

                        <SearchTickets
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onResults={setSearchResults}
                        />
                        {/* Header */}
                        <div className='flex items-center justify-center gap-4'>
                            <FilterFinished />

                            {/* Switch Buttons */}
                            <div className='flex items-center justify-center'>
                                <button
                                    onClick={() => setView('grid')}
                                    className={`border border-gray-300 rounded-l-full text-[2px] flex items-center justify-center transition-colors duration-300 px-2 py-1 cursor-pointer ${
                                        view === 'grid'
                                            ? 'bg-pink-200 text-pink-500'
                                            : 'text-pink-500 hover:bg-pink-100'
                                    }`}
                                >
                                    <span className="material-symbols-outlined">grid_view</span>
                                </button>
                                <button
                                    onClick={() => setView('list')}
                                    className={`border border-pink-300 rounded-r-full text-[2px] flex items-center justify-center transition-colors duration-300 px-1 py-1 cursor-pointer ${
                                        view === 'list'
                                            ? 'bg-pink-200 text-pink-500'
                                            : 'text-pink-500 hover:bg-pink-100'
                                    }`}
                                >
                                    <span className="material-symbols-outlined">reorder</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Switch */}
                    <div className='flex overflow-y-auto h-[70vh]'>
                        {view === 'grid' ? (
                            <GridViewDefault
                                searchTerm={searchTerm}
                                searchResults={searchResults}
                                onTicketDeleted={handleTicketDeleted}
                            />
                        ) : (
                            <ListView
                                searchTerm={searchTerm}
                                searchResults={searchResults}
                                onTicketDeleted={handleTicketDeleted}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadFinishedTickets