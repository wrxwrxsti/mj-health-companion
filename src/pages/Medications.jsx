import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { CATEGORY_COLORS } from '../lib/constants'
import { Plus, X, Pill, Syringe, ChevronDown, ChevronUp } from 'lucide-react'
import { PasswordGate, useProtectedAction } from '../lib/auth'

const emptyMed = {
  name: '', generic_name: '', dosage: '', frequency: '', route: 'oral',
  timing: '', prescribed_by: '', prescribed_date: '', start_date: '',
  end_date: '', is_active: true, notes: '', category: 'supplement',
}

export default function Medications() {
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('active')
  const [showForm, setShowForm] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [form, setForm] = useState(emptyMed)
  const [expandedId, setExpandedId] = useState(null)
  const { protect, gate } = useProtectedAction()

  useEffect(() => { fetchMedications() }, [])

  async function fetchMedications() {
    setLoading(true)
    try {
      const data = await db.fetch('medications', { orderBy: 'start_date', ascending: false })
      setMedications(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const filtered = medications.filter(m => {
    if (view === 'active') return m.is_active
    if (view === 'completed') return !m.is_active
    return true
  })

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form }
    if (!payload.end_date) payload.end_date = null
    if (!payload.prescribed_date) payload.prescribed_date = null
    if (!payload.start_date) payload.start_date = null

    if (editingMed) {
      await db.update('medications', editingMed.id, payload)
    } else {
      await db.insert('medications', payload)
    }
    setShowForm(false)
    setEditingMed(null)
    setForm(emptyMed)
    fetchMedications()
  }

  function startEdit(med) {
    protect(() => {
      setEditingMed(med)
      setForm({
        ...med,
        prescribed_date: med.prescribed_date || '',
        start_date: med.start_date || '',
        end_date: med.end_date || '',
      })
      setShowForm(true)
    })
  }

  function handleAdd() {
    protect(() => {
      setEditingMed(null)
      setForm(emptyMed)
      setShowForm(true)
    })
  }

  function deleteMed(id) {
    protect(async () => {
      if (!confirm('Delete this medication?')) return
      await db.delete('medications', id)
      fetchMedications()
    })
  }

  const cycDoses = medications.filter(m => m.name.includes('CYC'))

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {gate}
      <div className="flex items-center justify-between mb-6 animate-reveal">
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Medications</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-peach dark:bg-peach-dark text-white px-4 py-2 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-6 animate-reveal animate-reveal-delay-1">
        {['active', 'completed', 'all'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all capitalize ${
              view === v ? 'bg-peach/20 dark:bg-peach-dark/20 text-ink dark:text-ink-dark' : 'bg-card dark:bg-card-dark text-muted dark:text-muted-dark hover:bg-sage/30 dark:hover:bg-sage-dark/30 border border-border dark:border-border-dark'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted dark:text-muted-dark">Loading...</div>
      ) : (
        <>
          {/* CYC Infusion History */}
          {view !== 'active' && cycDoses.length > 0 && (
            <div className="mb-6 card p-4 animate-reveal animate-reveal-delay-2">
              <div className="flex items-center gap-2 mb-3">
                <Syringe size={18} className="text-peach dark:text-peach-dark" />
                <h2 className="font-semibold text-ink dark:text-ink-dark">Cyclophosphamide Infusion History (ELNT Protocol)</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cycDoses.map((dose, i) => (
                  <div key={dose.id} className="bg-lavender/50 dark:bg-lavender-dark/50 rounded-2xl p-3 text-sm">
                    <div className="font-medium text-ink dark:text-ink-dark">Dose {i + 1}</div>
                    <div className="text-peach dark:text-peach-dark">{dose.dosage} IV</div>
                    <div className="text-muted dark:text-muted-dark text-xs mt-1">
                      {new Date(dose.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {dose.notes && <div className="text-muted dark:text-muted-dark text-xs mt-1">{dose.notes}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medication Cards */}
          {filtered.filter(m => !m.name.includes('CYC') || view === 'active' || view === 'all').length === 0 ? (
            <div className="text-center py-12 animate-reveal">
              <Pill size={48} className="mx-auto text-border dark:text-border-dark mb-3" />
              <p className="text-muted dark:text-muted-dark">No medications found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered
                .filter(m => view === 'active' ? true : (!m.name.includes('CYC') || view === 'all'))
                .map((med, i) => (
                <div key={med.id} className="card p-4 animate-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-ink dark:text-ink-dark">{med.name}</h3>
                        {med.category && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[med.category] || 'bg-gray-100 text-gray-700'}`}>
                            {med.category.replace('_', ' ')}
                          </span>
                        )}
                        {!med.is_active && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-border/50 dark:bg-border-dark/50 text-muted dark:text-muted-dark">Completed</span>
                        )}
                      </div>
                      <div className="mt-1 text-sm text-muted dark:text-muted-dark">
                        {med.dosage} &middot; {med.frequency}
                        {med.route && med.route !== 'oral' && <span> &middot; {med.route}</span>}
                      </div>
                      {med.timing && <div className="text-xs text-muted/70 dark:text-muted-dark/70 mt-1">{med.timing}</div>}
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === med.id ? null : med.id)}
                      className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark p-1"
                    >
                      {expandedId === med.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {expandedId === med.id && (
                    <div className="mt-3 pt-3 border-t border-border/50 dark:border-border-dark/50 text-sm">
                      {med.notes && <p className="text-muted dark:text-muted-dark mb-2">{med.notes}</p>}
                      {med.prescribed_by && <p className="text-muted dark:text-muted-dark">Prescribed by: {med.prescribed_by}</p>}
                      {med.start_date && (
                        <p className="text-muted dark:text-muted-dark">
                          Started: {new Date(med.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      {med.end_date && (
                        <p className="text-muted dark:text-muted-dark">
                          Ended: {new Date(med.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => startEdit(med)} className="text-peach dark:text-peach-dark text-xs font-medium hover:underline">Edit</button>
                        <button onClick={() => deleteMed(med.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-card dark:bg-card-dark rounded-t-[2rem] md:rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink dark:text-ink-dark">{editingMed ? 'Edit' : 'Add'} Medication</h2>
              <button onClick={() => { setShowForm(false); setEditingMed(null) }} className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Medication name *" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input" />
              <input type="text" placeholder="Generic name" value={form.generic_name}
                onChange={e => setForm({ ...form, generic_name: e.target.value })}
                className="input" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Dosage" value={form.dosage}
                  onChange={e => setForm({ ...form, dosage: e.target.value })}
                  className="input" />
                <input type="text" placeholder="Frequency" value={form.frequency}
                  onChange={e => setForm({ ...form, frequency: e.target.value })}
                  className="input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}
                  className="input">
                  <option value="oral">Oral</option>
                  <option value="IV">IV</option>
                  <option value="eye drops">Eye drops</option>
                  <option value="injection">Injection</option>
                </select>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="input">
                  <option value="immunosuppressant">Immunosuppressant</option>
                  <option value="steroid">Steroid</option>
                  <option value="prophylaxis">Prophylaxis</option>
                  <option value="supplement">Supplement</option>
                  <option value="analgesic">Analgesic</option>
                  <option value="GI_protection">GI Protection</option>
                </select>
              </div>
              <input type="text" placeholder="Timing (e.g., 7am, before meals)" value={form.timing}
                onChange={e => setForm({ ...form, timing: e.target.value })}
                className="input" />
              <input type="text" placeholder="Prescribed by" value={form.prescribed_by}
                onChange={e => setForm({ ...form, prescribed_by: e.target.value })}
                className="input" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted dark:text-muted-dark mb-1 block">Start date</label>
                  <input type="date" value={form.start_date}
                    onChange={e => setForm({ ...form, start_date: e.target.value })}
                    className="input" />
                </div>
                <div>
                  <label className="text-xs text-muted dark:text-muted-dark mb-1 block">End date</label>
                  <input type="date" value={form.end_date}
                    onChange={e => setForm({ ...form, end_date: e.target.value })}
                    className="input" />
                </div>
              </div>
              <textarea placeholder="Notes" value={form.notes} rows={2}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="input" />
              <label className="flex items-center gap-2 text-sm text-muted dark:text-muted-dark">
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded accent-peach" />
                Currently active
              </label>
              <button type="submit" className="w-full bg-peach dark:bg-peach-dark text-white py-2 rounded-2xl font-medium hover:opacity-90 transition-opacity">
                {editingMed ? 'Update' : 'Add'} Medication
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
