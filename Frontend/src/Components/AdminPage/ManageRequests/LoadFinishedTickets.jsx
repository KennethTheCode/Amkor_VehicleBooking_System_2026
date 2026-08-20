import React, { useState } from 'react'
import Navbar from '../../Navbar'
import Dashboard from '../Dashboard'
import GridViewDefault from './GridViewDefault'
import ListView from './ListView'
import SearchTickets from './SearchTickets'
import { API_BASE } from '../../../config'

function LoadFinishedTickets() {
    const [view, setView] = useState('grid'); // 'grid' | 'list'
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [importedFileName, setImportedFileName] = useState('');

    const handleTicketDeleted = (ticket_id) => {
        setSearchResults((prev) =>
            prev !== null ? prev.filter((t) => t.ticket_id !== ticket_id) : prev
        );
    };

    const handleCsvImport = async (file) => {
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Please upload a CSV file.');
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);

        setUploading(true);
        setImportedFileName(file.name);

        try {
            const response = await fetch(`${API_BASE}/ManageRequests/ImportTripsCSV.php`, {
                method: 'POST',
                body: formData,
            });

            const raw = await response.text();
            let result;

            try {
                result = JSON.parse(raw);
            } catch (error) {
                console.error('Invalid CSV import response:', raw);
                alert('CSV import failed because the server returned an invalid response.');
                return;
            }

            alert(result.message || 'CSV import completed.');

            if (result.success) {
                setSearchResults(null);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            alert('Unable to import the CSV file.');
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            await handleCsvImport(file);
        }
    };

    const handleFileInput = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            await handleCsvImport(file);
        }
        e.target.value = '';
    };

    return (
        <div>
            <Navbar/>
            {/* General div */}
            <div className="bg-gray-100 px-2 flex flex-col sm:px-[20vh] pt-3 py-4 h-screen gap-3">
                <Dashboard />

                {/* Parent div */}
                <div className='p-5 w-full bg-white rounded'>
                    <div className='flex justify-center items-center mb-2 gap-5'>
                        <p className='font-bold text-[15px] text-pink-500   sm:hidden'>Manage Finished Tickets</p>
                         <div className='flex items-center justify-center gap-1 ml-2 sm:hidden'>

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
                    <div className='sm:hidden'>
                        <SearchTickets
                            value={searchTerm}
                            onChange={setSearchTerm}
                            onResults={setSearchResults}
                        />
                        <div className='mt-3'>
                            <label
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                }}
                                onDrop={handleDrop}
                                className={`block cursor-pointer border-2 border-dashed rounded px-3 py-2 text-center text-[11px] font-bold transition ${
                                    dragActive ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-pink-300 text-pink-500 bg-white hover:bg-pink-50'
                                }`}
                            >
                                <input type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
                                {uploading ? 'Importing...' : 'Import CSV'}
                            </label>
                            {importedFileName && (
                                <p className='text-[10px] text-gray-500 mt-1'>Imported: {importedFileName}</p>
                            )}
                        </div>
                    </div>
                    <div className='flex justify-between items-center pb-4 gap-3'>
                        <p className='font-bold text-[20px] text-pink-500 hidden sm:block'>Manage Finished Tickets</p>

                        <div className='hidden sm:block sm:w-[70%]'>
                            <SearchTickets
                                value={searchTerm}
                                onChange={setSearchTerm}
                                onResults={setSearchResults}
                            />
                        </div>

                        <div className='hidden sm:flex items-center gap-2'>
                            <label
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragActive(true);
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                }}
                                onDrop={handleDrop}
                                className={`cursor-pointer border-2 border-dashed rounded px-3 py-2 text-[11px] font-bold transition ${
                                    dragActive ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-pink-300 text-pink-500 bg-white hover:bg-pink-50'
                                }`}
                            >
                                <input type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
                                {uploading ? 'Importing...' : 'Import CSV'}
                            </label>
                        </div>
                        
                        {/* Header */}
                        <div className='flex items-center justify-center gap-4 hidden sm:block'>

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