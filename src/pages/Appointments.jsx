import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { DEPARTMENT_COLORS } from '../lib/constants'
import { Plus, X, Calendar, CheckCircle2, AlertCircle } from 'lucide-react'
import { useProtectedAction } from '../lib/auth'

const emptyAppt = {
  appointment_date: '', doctor_name: '', hospital: '', department: '',
  purpose: '', prep_notes: '', tests_required: [], status: 'upcoming',
  follow_up_notes: '',
}

const STATUS_STYLES = {
  upcoming: 'bg-lavender dark:bg-lavender-dark text-ink/70 dark:text-ink-dark/70',
  completed: 'bg-sage dark:bg-sage-dark text-ink/70 dark:text-ink-dark/70',
  cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  rescheduled: 'bg-peach/20 dark:bg-peach-dark/20 text-ink/70 dark:text-ink-dark/70',
}

export default function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('upcoming')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyAppt)
  const [editingAppt, setEditingAppt] = useState(null)
  const [testsInput, setTestsInput] = useState('')
  const { protect, gate } = useProtectedAction()

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

  function handleAdd() {
    protect(() => {
      setEditingAppt(null)
      setForm(emptyAppt)
      setTestsInput('')
      setShowForm(true)
    })
  }

  function startEdit(appt) {
    protect(() => {
      setEditingAppt(appt)
      setForm({
        ...appt,
        appointment_date: appt.appointment_date ? new Date(appt.appointment_date).toISOString().slice(0, 16) : '',
      })
      setTestsInput(appt.tests_required?.join(', ') || '')
      setShowForm(true)
    })
  }

  function markComplete(appt) {
    protect(async () => {
      const notes = prompt('Follow-up notes (optional):')
      await db.update('appointments', appt.id, {
        status: 'completed',
        follow_up_notes: notes || appt.follow_up_notes,
      })
      fetchAppointments()
    })
  }

  function deleteAppt(id) {
    protect(async () => {
      if (!confirm('Delete this appointment?')) return
      await db.delete('appointments', id)
      fetchAppointments()
    })
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {gate}
      <div className="flex items-center justify-between mb-6 animate-reveal">
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Appointments</h1>
        <button onClick={handleAdd}
          className="flex items-center gap-2 bg-peach dark:bg-peach-dark text-white px-4 py-2 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="flex gap-2 mb-6 animate-reveal animate-reveal-delay-1">
        {['upcoming', 'past', 'all'].map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all capitalize ${
              view === v ? 'bg-peach/20 dark:bg-peach-dark/20 text-ink dark:text-ink-dark' : 'bg-card dark:bg-card-dark text-muted dark:text-muted-dark hover:bg-sage/30 dark:hover:bg-sage-dark/30 border border-border dark:border-border-dark'
            }`}>
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted dark:text-muted-dark">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 animate-reveal">
          <Calendar size={48} className="mx-auto text-border dark:text-border-dark mb-3" />
          <p className="text-muted dark:text-muted-dark">No appointments found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt, i) => {
            const date = new Date(appt.appointment_date)
            const isUpcoming = appt.status === 'upcoming'
            return (
              <div key={appt.id} className={`card p-4 animate-reveal ${isUpcoming ? 'border-l-4 border-l-peach dark:border-l-peach-dark' : ''}`} style={{ animationDelay: `${i * 0.05}s` }}>
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
                    <div className="flex items-center gap-2 text-sm text-ink dark:text-ink-dark font-medium">
                      <Calendar size={14} className="text-muted dark:text-muted-dark" />
                      {date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                      {' at '}
                      {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {appt.doctor_name && <p className="text-sm text-muted dark:text-muted-dark mt-1">{appt.doctor_name}</p>}
                    {appt.hospital && <p className="text-xs text-muted/70 dark:text-muted-dark/70">{appt.hospital}</p>}
                    {appt.purpose && <p className="text-sm text-muted dark:text-muted-dark mt-2">{appt.purpose}</p>}
                  </div>
                </div>

                {appt.prep_notes && isUpcoming && (
                  <div className="mt-3 bg-peach/10 dark:bg-peach-dark/10 border border-peach/20 dark:border-peach-dark/20 rounded-2xl p-3">
                    <div className="flex items-center gap-1 text-peach dark:text-peach-dark text-xs font-medium mb-1">
                      <AlertCircle size={12} /> Preparation
                    </div>
                    <p className="text-sm text-ink/80 dark:text-ink-dark/80">{appt.prep_notes}</p>
                  </div>
                )}

                {appt.tests_required?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-xs text-muted dark:text-muted-dark">Tests:</span>
                    {appt.tests_required.map((test, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-sage/50 dark:bg-sage-dark/50 rounded-xl text-xs text-ink/70 dark:text-ink-dark/70">{test}</span>
                    ))}
                  </div>
                )}

                {appt.follow_up_notes && (
                  <div className="mt-2 bg-sage/30 dark:bg-sage-dark/30 border border-sage/50 dark:border-sage-dark/50 rounded-2xl p-3">
                    <div className="text-xs text-ink/60 dark:text-ink-dark/60 font-medium mb-1">Follow-up Notes</div>
                    <p className="text-sm text-ink/80 dark:text-ink-dark/80">{appt.follow_up_notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50">
                  {isUpcoming && (
                    <button onClick={() => markComplete(appt)}
                      className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium hover:underline">
                      <CheckCircle2 size={14} /> Mark Complete
                    </button>
                  )}
                  <button onClick={() => startEdit(appt)} className="text-peach dark:text-peach-dark text-xs font-medium hover:underline">Edit</button>
                  <button onClick={() => deleteAppt(appt.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-card dark:bg-card-dark rounded-t-[2rem] md:rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink dark:text-ink-dark">{editingAppt ? 'Edit' : 'Add'} Appointment</h2>
              <button onClick={() => { setShowForm(false); setEditingAppt(null) }} className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-muted dark:text-muted-dark mb-1 block">Date & Time *</label>
                <input type="datetime-local" required value={form.appointment_date}
                  onChange={e => setForm({ ...form, appointment_date: e.target.value })}
                  className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Doctor name" value={form.doctor_name}
                  onChange={e => setForm({ ...form, doctor_name: e.target.value })}
                  className="input" />
                <input type="text" placeholder="Hospital" value={form.hospital}
                  onChange={e => setForm({ ...form, hospital: e.target.value })}
                  className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}
                  className="input">
                  <option value="">Department</option>
                  {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  className="input">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
              <input type="text" placeholder="Purpose" value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                className="input" />
              <textarea placeholder="Preparation notes (fasting, bring reports, etc.)" value={form.prep_notes} rows={2}
                onChange={e => setForm({ ...form, prep_notes: e.target.value })}
                className="input" />
              <input type="text" placeholder="Tests required (comma separated: CBC, ESR, ...)" value={testsInput}
                onChange={e => setTestsInput(e.target.value)}
                className="input" />
              <textarea placeholder="Follow-up notes" value={form.follow_up_notes} rows={2}
                onChange={e => setForm({ ...form, follow_up_notes: e.target.value })}
                className="input" />
              <button type="submit" className="w-full bg-peach dark:bg-peach-dark text-white py-2 rounded-2xl font-medium hover:opacity-90 transition-opacity">
                {editingAppt ? 'Update' : 'Add'} Appointment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
