import React, { useState } from 'react'

import { API_BASE } from '../../config'

function ExportToday() {
  const [loading, setLoading] = useState(false)

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const handleExport = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/ManageRequests/LoadRequests.php`)
      const data = await res.json()

      if (!Array.isArray(data)) {
        console.error('Unexpected response:', data)
        setLoading(false)
        return
      }

      // Local YYYY-MM-DD for "today", not UTC — avoids the date rolling
      // over early/late depending on the browser's timezone.
      const today = new Date()
      const todayStr =
        today.getFullYear() +
        '-' +
        String(today.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(today.getDate()).padStart(2, '0')

      const filtered = data.filter((t) => {
        const statusMatch = ['finished', 'completed', 'rejected'].includes(
          (t.status || '').toLowerCase()
        )

        const dateMatch =
          typeof t.date_needed === 'string' &&
          t.date_needed.slice(0, 10) === todayStr

        return statusMatch && dateMatch
      })

      if (filtered.length === 0) {
        alert('No finished or rejected tickets found for today.')
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
      link.setAttribute('download', `tickets_summary_${todayStr}.csv`)
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
    <button
      onClick={handleExport}
      disabled={loading}
      className='bg-pink-500 px-2 py-1 text-white font-bold rounded hover:bg-pink-600 duration-300 transition-colors cursor-pointer disabled:opacity-50'
    >
      {loading ? 'Exporting...' : 'Export Excel (Today)'}
    </button>
  )
}

export default ExportToday