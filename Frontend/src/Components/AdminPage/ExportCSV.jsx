import React, { useState } from 'react'

import { API_BASE } from '../../config'

function ExportCSV() {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('') // format: "YYYY-MM"

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const handleExport = async () => {
    if (!selectedMonth) {
      alert('Please select a month first.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/ManageRequests/LoadRequests.php`)
      const data = await res.json()

      if (!Array.isArray(data)) {
        console.error('Unexpected response:', data)
        setLoading(false)
        return
      }

      const filtered = data.filter((t) => {
        const statusMatch = ['finished', 'completed', 'rejected'].includes(
          (t.status || '').toLowerCase()
        )

        const dateMatch =
          typeof t.date_needed === 'string' &&
          t.date_needed.slice(0, 7) === selectedMonth

        return statusMatch && dateMatch
      })

      if (filtered.length === 0) {
        alert('No finished or rejected tickets found for the selected month.')
        setLoading(false)
        return
      }

      const headers = [
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

      const rows = filtered.map((t) => [
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

      const csvContent =
        headers.map(escapeCSV).join(',') +
        '\n' +
        rows.map((row) => row.map(escapeCSV).join(',')).join('\n')

      // Add BOM so Excel opens UTF-8 correctly
      const blob = new Blob(['\uFEFF' + csvContent], {
        type: 'text/csv;charset=utf-8;'
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `tickets_summary_${selectedMonth}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Failed to export CSV.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center gap-2'>
    <button
        onClick={()=>setShowModal(true)}
        className='bg-gray-500 px-2 py-1 text-white font-bold rounded hover:bg-gray-600 duration-300 transition-colors cursor-pointer disabled:opacity-50'
    >
        Export CSV
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
                        {loading ? 'Exporting...' : 'Export CSV'}
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

export default ExportCSV