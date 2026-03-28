import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { SEVERITY_COLORS, SEVERITY_DOT_COLORS, DEPARTMENT_COLORS, EVENT_TYPE_LABELS } from '../lib/constants'
import { Plus, X, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react'

const emptyEvent = {
  event_date: '', event_type: 'follow_up', title: '', description: '',
  hospital: '', department: '', doctor_name: '', severity: 'low',
}

export default function Timeline() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyEvent)
  const [editingEvent, setEditingEvent] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState({ type: '', severity: '', department: '' })

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    setLoading(true)
    try {
      const data = await db.fetch('timeline_events', { orderBy: 'event_date', ascending: false })
      setEvents(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const filtered = events.filter(e => {
    if (filter.type && e.event_type !== filter.type) return false
    if (filter.severity && e.severity !== filter.severity) return false
    if (filter.department && e.department !== filter.department) return false
    return true
  })

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form }
    if (editingEvent) {
      await db.update('timeline_events', editingEvent.id, payload)
    } else {
      await db.insert('timeline_events', payload)
    }
    setShowForm(false)
    setEditingEvent(null)
    setForm(emptyEvent)
    fetchEvents()
  }

  function startEdit(event) {
    setEditingEvent(event)
    setForm({ ...event, event_date: event.event_date || '' })
    setShowForm(true)
  }

  async function deleteEvent(id) {
    if (!confirm('Delete this event?')) return
    await db.delete('timeline_events', id)
    fetchEvents()
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Timeline</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
            <Filter size={16} /> Filter
          </button>
          <button
            onClick={() => { setEditingEvent(null); setForm(emptyEvent); setShowForm(true) }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded-xl border border-slate-200">
          <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All types</option>
            {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filter.severity} onChange={e => setFilter({ ...filter, severity: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All departments</option>
            {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {(filter.type || filter.severity || filter.department) && (
            <button onClick={() => setFilter({ type: '', severity: '', department: '' })}
              className="text-sm text-blue-600 hover:underline px-2">Clear</button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400">No events found</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="space-y-4">
            {filtered.map(event => (
              <div key={event.id} className="relative pl-12">
                <div className={`absolute left-[12px] top-5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${SEVERITY_DOT_COLORS[event.severity] || 'bg-gray-400'}`} />
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-slate-400 mb-1">
                        {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <h3 className="font-semibold text-slate-800">{event.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {event.event_type && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[event.severity] || 'bg-gray-100 text-gray-700'}`}>
                            {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                          </span>
                        )}
                        {event.department && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[event.department] || 'bg-gray-100 text-gray-700'}`}>
                            {event.department}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      {expandedId === event.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                  {expandedId === event.id && (
                    <div className="mt-3 pt-3 border-t border-slate-100 text-sm">
                      {event.description && <p className="text-slate-600 mb-2">{event.description}</p>}
                      {event.hospital && <p className="text-slate-500">Hospital: {event.hospital}</p>}
                      {event.doctor_name && <p className="text-slate-500">Doctor: {event.doctor_name}</p>}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => startEdit(event)} className="text-blue-600 text-xs font-medium hover:underline">Edit</button>
                        <button onClick={() => deleteEvent(event.id)} className="text-red-600 text-xs font-medium hover:underline">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{editingEvent ? 'Edit' : 'Add'} Event</h2>
              <button onClick={() => { setShowForm(false); setEditingEvent(null) }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Event title *" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Date *</label>
                  <input type="date" required value={form.event_date}
                    onChange={e => setForm({ ...form, event_date: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 self-end">
                  {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <textarea placeholder="Description" value={form.description} rows={3}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Hospital" value={form.hospital}
                  onChange={e => setForm({ ...form, hospital: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Department</option>
                  {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Doctor name" value={form.doctor_name}
                onChange={e => setForm({ ...form, doctor_name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                {editingEvent ? 'Update' : 'Add'} Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
