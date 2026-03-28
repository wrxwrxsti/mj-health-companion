import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { DEPARTMENT_COLORS } from '../lib/constants'
import { Plus, X, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'

const emptyAppt = {
  appointment_date: '', doctor_name: '', hospital: '', department: '',
  purpose: '', prep_notes: '', tests_required: [], status: 'upcoming',
  follow_up_notes: '',
}

const STATUS_STYLES = {
  upcoming: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  rescheduled: 'bg-amber-100 text-amber-700',
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('upcoming')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyAppt)
  const [editingAppt, setEditingAppt] = useState(null)
  const [testsInput, setTestsInput] = useState('')

  useEffect(() => { fetchAppointments() }, [])

  async function fetchAppointments() {
    setLoading(true)
    try {
      const data = await db.fetch('appointments', { orderBy: 'appointment_date', ascending: true })
      setAppointments(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const filtered = appointments.filter(a => {
    if (view === 'upcoming') return a.status === 'upcoming'
    if (view === 'past') return a.status === 'completed' || a.status === 'cancelled'
    return true
  })

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      tests_required: testsInput ? testsInput.split(',').map(t => t.trim()) : [],
    }
    if (editingAppt) {
      await db.update('appointments', editingAppt.id, payload)
    } else {
      await db.insert('appointments', payload)
    }
    setShowForm(false)
    setEditingAppt(null)
    setForm(emptyAppt)
    setTestsInput('')
    fetchAppointments()
  }

  function startEdit(appt) {
    setEditingAppt(appt)
    setForm({
      ...appt,
      appointment_date: appt.appointment_date ? new Date(appt.appointment_date).toISOString().slice(0, 16) : '',
    })
    setTestsInput(appt.tests_required?.join(', ') || '')
    setShowForm(true)
  }

  async function markComplete(appt) {
    const notes = prompt('Follow-up notes (optional):')
    await db.update('appointments', appt.id, {
      status: 'completed',
      follow_up_notes: notes || appt.follow_up_notes,
    })
    fetchAppointments()
  }

  async function deleteAppt(id) {
    if (!confirm('Delete this appointment?')) return
    await db.delete('appointments', id)
    fetchAppointments()
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <button
          onClick={() => { setEditingAppt(null); setForm(emptyAppt); setTestsInput(''); setShowForm(true) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['upcoming', 'past', 'all'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              view === v ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}>
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <Calendar size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => {
            const date = new Date(appt.appointment_date)
            const isUpcoming = appt.status === 'upcoming'
            return (
              <div key={appt.id} className={`bg-white rounded-xl border border-slate-200 p-4 ${isUpcoming ? 'border-l-4 border-l-blue-500' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[appt.status]}`}>
                        {appt.status}
                      </span>
                      {appt.department && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[appt.department] || 'bg-gray-100 text-gray-700'}`}>
                          {appt.department}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-800 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      {date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      {' at '}
                      {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {appt.doctor_name && <p className="text-sm text-slate-600 mt-1">{appt.doctor_name}</p>}
                    {appt.hospital && <p className="text-xs text-slate-400">{appt.hospital}</p>}
                    {appt.purpose && <p className="text-sm text-slate-600 mt-2">{appt.purpose}</p>}
                  </div>
                </div>

                {appt.prep_notes && isUpcoming && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-center gap-1 text-amber-700 text-xs font-medium mb-1">
                      <AlertCircle size={12} /> Preparation
                    </div>
                    <p className="text-sm text-amber-800">{appt.prep_notes}</p>
                  </div>
                )}

                {appt.tests_required?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs text-slate-500">Tests:</span>
                    {appt.tests_required.map((test, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600">{test}</span>
                    ))}
                  </div>
                )}

                {appt.follow_up_notes && (
                  <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-xs text-green-700 font-medium mb-1">Follow-up Notes</div>
                    <p className="text-sm text-green-800">{appt.follow_up_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  {isUpcoming && (
                    <button onClick={() => markComplete(appt)}
                      className="flex items-center gap-1 text-green-600 text-xs font-medium hover:underline">
                      <CheckCircle2 size={14} /> Mark Complete
                    </button>
                  )}
                  <button onClick={() => startEdit(appt)} className="text-blue-600 text-xs font-medium hover:underline">Edit</button>
                  <button onClick={() => deleteAppt(appt.id)} className="text-red-600 text-xs font-medium hover:underline">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{editingAppt ? 'Edit' : 'Add'} Appointment</h2>
              <button onClick={() => { setShowForm(false); setEditingAppt(null) }} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Date & Time *</label>
                <input type="datetime-local" required value={form.appointment_date}
                  onChange={e => setForm({ ...form, appointment_date: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Doctor name" value={form.doctor_name}
                  onChange={e => setForm({ ...form, doctor_name: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Hospital" value={form.hospital}
                  onChange={e => setForm({ ...form, hospital: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Department</option>
                  {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              <input type="text" placeholder="Purpose" value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Preparation notes (fasting, bring reports, etc.)" value={form.prep_notes} rows={2}
                onChange={e => setForm({ ...form, prep_notes: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Tests required (comma separated: CBC, ESR, ...)" value={testsInput}
                onChange={e => setTestsInput(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <textarea placeholder="Follow-up notes" value={form.follow_up_notes} rows={2}
                onChange={e => setForm({ ...form, follow_up_notes: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                {editingAppt ? 'Update' : 'Add'} Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
