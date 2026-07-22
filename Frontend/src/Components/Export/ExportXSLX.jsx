import React, { useState } from 'react'
import * as XLSX from 'xlsx'

import { API_BASE } from '../../config'

function ExportXSLX() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('') // format: "YYYY-MM"

  const handleExport = async () => {
    if (!selectedMonth) {
      alert('Please select a month first.')
      return
    }

    setLoading(true)
    try {
      // --- Sheet 1: Tickets Summary -----------------------------------
      const requestsRes = await fetch(`${API_BASE}/ManageRequests/LoadRequests.php`)
      const requestsData = await requestsRes.json()

      if (!Array.isArray(requestsData)) {
        console.error('Unexpected response from LoadRequests.php:', requestsData)
        alert('Failed to export: unexpected tickets response.')
        setLoading(false)
        return
      }

      const filteredRequests = requestsData.filter((t) => {
        const statusMatch = ['finished', 'completed', 'rejected'].includes(
          (t.status || '').toLowerCase()
        )

        const dateMatch =
          typeof t.date_needed === 'string' &&
          t.date_needed.slice(0, 7) === selectedMonth

        return statusMatch && dateMatch
      })

      // --- Sheet 2: Finished Trip Details (incl. RFID balance) --------
      const finishedRes = await fetch(`${API_BASE}/ManageRequests/LoadOdometer.php`)
      const finishedData = await finishedRes.json()

      if (!Array.isArray(finishedData)) {
        console.error('Unexpected response from LoadOdometer.php:', finishedData)
        alert('Failed to export: unexpected finished-trips response.')
        setLoading(false)
        return
      }

      const filteredFinished = finishedData.filter(
        (f) =>
          typeof f.date_finished === 'string' &&
          f.date_finished.slice(0, 7) === selectedMonth
      )

      if (filteredRequests.length === 0 && filteredFinished.length === 0) {
        alert('No records found for the selected month.')
        setLoading(false)
        return
      }

      // --- Build Sheet 1 rows ------------------------------------------
      const requestsHeaders = [
        'Ticket ID',
        'User',
        'Driver',
        'Vehicle Model',
        'Passengers',
        'Pick Up',
        'Drop Off',
        'Purpose',
        'Date Needed',
        'Time Needed',
        'Status',
        'Created At'
      ]

      const requestsRows = filteredRequests.map((t) => [
        t.ticket_id,
        t.username,
        t.driver_username,
        t.vehicle_model,
        t.passengers,
        t.pick_up,
        t.drop_off,
        t.purpose,
        t.date_needed,
        t.time_needed,
        t.status,
        t.created_at
      ])

      // --- Build Sheet 2 rows ------------------------------------------
      const finishedHeaders = [
        'Finished ID',
        'Ticket ID',
        'Driver',
        'Vehicle Model',
        'Pick Up',
        'Drop Off',
        'Beginning',
        'Ending',
        'Distance Travelled',
        'Time Out',
        'Time In',
        'Date Finished',
        'RFID Balance'
      ]

      const finishedRows = filteredFinished.map((f) => [
        f.finished_id,
        f.ticket_id,
        f.driver_username,
        f.vehicle_model,
        f.pick_up,
        f.drop_off,
        f.beginning,
        f.ending,
        f.distance_travelled,
        f.time_out,
        f.time_in,
        f.date_finished,
        f.rfid_balance
      ])

      // --- Assemble workbook ---------------------------------------
      const wb = XLSX.utils.book_new()

      const ws1 = XLSX.utils.aoa_to_sheet([requestsHeaders, ...requestsRows])
      XLSX.utils.book_append_sheet(wb, ws1, 'Tickets Summary')

      const ws2 = XLSX.utils.aoa_to_sheet([finishedHeaders, ...finishedRows])
      XLSX.utils.book_append_sheet(wb, ws2, 'Finished Trips')

      XLSX.writeFile(wb, `tickets_export_${selectedMonth}.xlsx`)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Failed to export.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-2'>
    <button
        onClick={()=>setShowModal(true)}
        className='bg-green-500 text-white font-bold rounded text-[8px] sm:text-[14px] px-2 py-1 hover:bg-green-600 duration-300 transition-colors cursor-pointer disabled:opacity-50'
    >
        Export .xslx
    </button>
      { showModal && (
        <div className='inset-0 flex items-center justify-center h-screen z-100 bg-black/20 fixed'>            
            <div className='bg-white rounded p-5 shadow flex flex-col gap-3'>
                <p className='font-bold'>Select Month to Export</p>
                <input
                    type='month'
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className='border border-gray-300 rounded px-2 py-1 text-sm'
                />

                <div className='flex justify-between items-center'>
                    <button
                        onClick={handleExport}
                        disabled={loading || !selectedMonth}
                        className='bg-gray-500 px-2 py-1 text-white font-bold rounded hover:bg-gray-600 duration-300 transition-colors cursor-pointer disabled:opacity-50'
                    >
                        {loading ? 'Exporting...' : 'Export'}
                    </button>
                    <button
                    onClick={()=>setShowModal(false)}
                    className='bg-blue-100 border border-blue-500 font-bold text-blue-500 px-1 rounded hover:cursor-pointer duration-300 transition-colors'>
                    Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default ExportXSLX