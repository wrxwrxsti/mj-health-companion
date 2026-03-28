import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { SEVERITY_COLORS, SEVERITY_DOT_COLORS, DEPARTMENT_COLORS, EVENT_TYPE_LABELS } from '../lib/constants'
import { Plus, X, Clock, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { useProtectedAction } from '../lib/auth'

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
  const { protect, gate } = useProtectedAction()

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

  function handleAdd() {
    protect(() => {
      setEditingEvent(null)
      setForm(emptyEvent)
      setShowForm(true)
    })
  }

  function startEdit(event) {
    protect(() => {
      setEditingEvent(event)
      setForm({ ...event, event_date: event.event_date || '' })
      setShowForm(true)
    })
  }

  function deleteEvent(id) {
    protect(async () => {
      if (!confirm('Delete this event?')) return
      await db.delete('timeline_events', id)
      fetchEvents()
    })
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {gate}
      <div className="flex items-center justify-between mb-6 animate-reveal">
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Timeline</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 border border-border dark:border-border-dark text-muted dark:text-muted-dark px-3 py-2 rounded-2xl text-sm hover:bg-sage/30 dark:hover:bg-sage-dark/30 transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button onClick={handleAdd}
            className="flex items-center gap-2 bg-peach dark:bg-peach-dark text-white px-4 py-2 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 card animate-reveal">
          <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
            className="input w-auto">
            <option value="">All types</option>
            {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filter.severity} onChange={e => setFilter({ ...filter, severity: e.target.value })}
            className="input w-auto">
            <option value="">All severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })}
            className="input w-auto">
            <option value="">All departments</option>
            {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {(filter.type || filter.severity || filter.department) && (
            <button onClick={() => setFilter({ type: '', severity: '', department: '' })}
              className="text-sm text-peach dark:text-peach-dark hover:underline px-2">Clear</button>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted dark:text-muted-dark">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 animate-reveal">
          <Clock size={48} className="mx-auto text-border dark:text-border-dark mb-3" />
          <p className="text-muted dark:text-muted-dark">No events found</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border dark:bg-border-dark" />
          <div className="space-y-4">
            {filtered.map((event, i) => (
              <div key={event.id} className="relative pl-12 animate-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`absolute left-[12px] top-5 w-4 h-4 rounded-full border-2 border-card dark:border-card-dark shadow-sm ${SEVERITY_DOT_COLORS[event.severity] || 'bg-gray-400'}`} />
                <div className="card p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-muted dark:text-muted-dark mb-1">
                        {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <h3 className="font-semibold text-ink dark:text-ink-dark">{event.title}</h3>
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
                    <div className="text-muted dark:text-muted-dark p-1">
                      {expandedId === event.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {expandedId === event.id && (
                    <div className="mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50 text-sm">
                      {event.description && <p className="text-muted dark:text-muted-dark mb-2">{event.description}</p>}
                      {event.hospital && <p className="text-muted dark:text-muted-dark">Hospital: {event.hospital}</p>}
                      {event.doctor_name && <p className="text-muted dark:text-muted-dark">Doctor: {event.doctor_name}</p>}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => startEdit(event)} className="text-peach dark:text-peach-dark text-xs font-medium hover:underline">Edit</button>
                        <button onClick={() => deleteEvent(event.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
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
          <div className="bg-card dark:bg-card-dark rounded-t-[2rem] md:rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink dark:text-ink-dark">{editingEvent ? 'Edit' : 'Add'} Event</h2>
              <button onClick={() => { setShowForm(false); setEditingEvent(null) }} className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Event title *" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="input" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted dark:text-muted-dark mb-1 block">Date *</label>
                  <input type="date" required value={form.event_date}
                    onChange={e => setForm({ ...form, event_date: e.target.value })}
                    className="input" />
                </div>
                <select value={form.event_type} onChange={e => setForm({ ...form, event_type: e.target.value })}
                  className="input self-end">
                  {Object.entries(EVENT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}
                className="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <textarea placeholder="Description" value={form.description} rows={3}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Hospital" value={form.hospital}
                  onChange={e => setForm({ ...form, hospital: e.target.value })}
                  className="input" />
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="input">
                  <option value="">Department</option>
                  {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <input type="text" placeholder="Doctor name" value={form.doctor_name}
                onChange={e => setForm({ ...form, doctor_name: e.target.value })}
                className="input" />
              <button type="submit" className="w-full bg-peach dark:bg-peach-dark text-white py-2 rounded-2xl font-medium hover:opacity-90 transition-opacity">
                {editingEvent ? 'Update' : 'Add'} Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
