import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../lib/dataStore'
import { HEALTH_BRIEF, SEVERITY_DOT_COLORS, EVENT_TYPE_LABELS, DEPARTMENT_COLORS } from '../lib/constants'
import { Pill, FileText, Clock, Calendar, Plus, TrendingUp, TrendingDown, Minus, Heart, User, Stethoscope } from 'lucide-react'

function Sparkline({ data, color = '#FFB7B2', refLow, refHigh }) {
  if (!data.length) return null
  const values = data.map(d => d.value)
  const min = Math.min(...values, refLow ?? Infinity)
  const max = Math.max(...values, refHigh ?? -Infinity)
  const range = max - min || 1
  const width = 120
  const height = 40
  const padding = 4

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding)
    const y = height - padding - ((d.value - min) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')

  const refY1 = refHigh != null ? height - padding - ((refHigh - min) / range) * (height - 2 * padding) : null
  const refY2 = refLow != null ? height - padding - ((refLow - min) / range) * (height - 2 * padding) : null

  return (
    <svg width={width} height={height} className="inline-block">
      {refY1 != null && refY2 != null && (
        <rect x={padding} y={Math.min(refY1, refY2)} width={width - 2 * padding}
          height={Math.abs(refY2 - refY1)} fill="#E8EFE8" opacity="0.5" />
      )}
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = padding + (i / Math.max(data.length - 1, 1)) * (width - 2 * padding)
        const y = height - padding - ((d.value - min) / range) * (height - 2 * padding)
        return <circle key={i} cx={x} cy={y} r="2.5" fill={d.is_abnormal ? '#ef4444' : color} />
      })}
    </svg>
  )
}

function TrendIndicator({ data }) {
  if (data.length < 2) return null
  const last = data[data.length - 1].value
  const prev = data[data.length - 2].value
  if (last > prev) return <TrendingUp size={14} className="text-red-500" />
  if (last < prev) return <TrendingDown size={14} className="text-green-500" />
  return <Minus size={14} className="text-muted dark:text-muted-dark" />
}

export default function Dashboard() {
  const [doctorView, setDoctorView] = useState(false)
  const [medications, setMedications] = useState([])
  const [appointments, setAppointments] = useState([])
  const [events, setEvents] = useState([])
  const [labResults, setLabResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      db.fetch('medications', { filters: { is_active: true } }),
      db.fetch('appointments', { orderBy: 'appointment_date', ascending: true, filters: { status: 'upcoming' }, limit: 1 }),
      db.fetch('timeline_events', { orderBy: 'event_date', ascending: false, limit: 3 }),
      db.fetch('lab_results', { orderBy: 'test_date', ascending: true }),
    ]).then(([meds, appts, evts, labs]) => {
      setMedications(meds)
      setAppointments(appts)
      setEvents(evts)
      setLabResults(labs)
      setLoading(false)
    })
  }, [])

  const labGroups = {}
  labResults.forEach(r => {
    if (!labGroups[r.test_name]) labGroups[r.test_name] = []
    labGroups[r.test_name].push(r)
  })

  const keyLabs = ['Hemoglobin', 'ESR', 'Platelets', 'TLC']
  const nextAppt = appointments[0]

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted dark:text-muted-dark">Loading...</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Demo Banner */}
      {db.isDemo && (
        <div className="bg-peach/15 dark:bg-peach-dark/15 border border-peach/30 dark:border-peach-dark/30 rounded-2xl p-3 mb-4 text-sm text-ink dark:text-ink-dark animate-reveal">
          Running in demo mode with sample data. Add your Supabase credentials in <code className="bg-peach/20 dark:bg-peach-dark/20 px-1.5 py-0.5 rounded-lg text-xs">.env</code> to connect to a live database.
        </div>
      )}

      {/* Hero Health Brief */}
      <div className="card p-5 mb-6 animate-reveal">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-peach dark:text-peach-dark" />
            <h2 className="text-lg font-bold text-ink dark:text-ink-dark">Health Brief</h2>
          </div>
          {/* Simple / Doctor Tabs */}
          <div className="flex bg-sage/40 dark:bg-sage-dark/40 rounded-2xl p-1">
            <button
              onClick={() => setDoctorView(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                !doctorView
                  ? 'bg-card dark:bg-card-dark text-ink dark:text-ink-dark shadow-sm'
                  : 'text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              <User size={14} />
              Simple
            </button>
            <button
              onClick={() => setDoctorView(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                doctorView
                  ? 'bg-card dark:bg-card-dark text-ink dark:text-ink-dark shadow-sm'
                  : 'text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark'
              }`}
            >
              <Stethoscope size={14} />
              Doctor
            </button>
          </div>
        </div>
        <div className="text-sm text-muted dark:text-muted-dark leading-relaxed whitespace-pre-line">
          {doctorView ? HEALTH_BRIEF.doctor : HEALTH_BRIEF.simple}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link to="/medications" className="card p-4 hover:shadow-lg transition-shadow block animate-reveal animate-reveal-delay-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sage dark:bg-sage-dark rounded-2xl flex items-center justify-center">
                <Pill size={20} className="text-ink/70 dark:text-ink-dark/70" />
              </div>
              <div>
                <p className="text-sm text-muted dark:text-muted-dark">Active Medications</p>
                <p className="text-2xl font-bold text-ink dark:text-ink-dark">{medications.length}</p>
              </div>
            </div>
            <span className="text-xs text-peach dark:text-peach-dark font-medium">View All &rarr;</span>
          </div>
        </Link>

        <Link to="/appointments" className="card p-4 hover:shadow-lg transition-shadow block animate-reveal animate-reveal-delay-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lavender dark:bg-lavender-dark rounded-2xl flex items-center justify-center">
              <Calendar size={20} className="text-ink/70 dark:text-ink-dark/70" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted dark:text-muted-dark">Next Appointment</p>
              {nextAppt ? (
                <>
                  <p className="text-sm font-semibold text-ink dark:text-ink-dark truncate">
                    {new Date(nextAppt.appointment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    {nextAppt.doctor_name && ` - ${nextAppt.doctor_name}`}
                  </p>
                  <p className="text-xs text-muted dark:text-muted-dark truncate">{nextAppt.hospital}</p>
                </>
              ) : (
                <p className="text-sm text-muted dark:text-muted-dark">None scheduled</p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Timeline */}
      <div className="card p-4 mb-6 animate-reveal animate-reveal-delay-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-ink dark:text-ink-dark flex items-center gap-2">
            <Clock size={16} className="text-muted dark:text-muted-dark" /> Recent Events
          </h3>
          <Link to="/timeline" className="text-xs text-peach dark:text-peach-dark font-medium">View All &rarr;</Link>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-muted dark:text-muted-dark">No events yet</p>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <div key={event.id} className="flex items-start gap-3 py-2 border-b border-border/50 dark:border-border-dark/50 last:border-0">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT_COLORS[event.severity] || 'bg-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">{event.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted dark:text-muted-dark">
                      {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {event.event_type && (
                      <span className="text-xs text-muted dark:text-muted-dark">{EVENT_TYPE_LABELS[event.event_type]}</span>
                    )}
                    {event.department && (
                      <span className={`px-1.5 py-0.5 rounded-xl text-xs font-medium ${DEPARTMENT_COLORS[event.department] || ''}`}>
                        {event.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lab Trends */}
      <div className="card p-4 mb-6 animate-reveal animate-reveal-delay-3">
        <h3 className="font-semibold text-ink dark:text-ink-dark mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-muted dark:text-muted-dark" /> Key Lab Trends
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {keyLabs.map(name => {
            const data = labGroups[name] || []
            if (!data.length) return null
            const latest = data[data.length - 1]
            return (
              <div key={name} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink/80 dark:text-ink-dark/80">{name}</span>
                    <TrendIndicator data={data} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-bold ${latest.is_abnormal ? 'text-red-600' : 'text-ink dark:text-ink-dark'}`}>
                      {latest.value}
                    </span>
                    <span className="text-xs text-muted dark:text-muted-dark">{latest.unit}</span>
                  </div>
                  <div className="text-xs text-muted dark:text-muted-dark">
                    Ref: {latest.ref_range_low}-{latest.ref_range_high}
                  </div>
                </div>
                <Sparkline
                  data={data}
                  color={latest.is_abnormal ? '#ef4444' : '#FFB7B2'}
                  refLow={latest.ref_range_low}
                  refHigh={latest.ref_range_high}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-reveal animate-reveal-delay-4">
        <Link to="/medications" className="card-sm p-4 text-center hover:shadow-lg transition-shadow">
          <Plus size={20} className="mx-auto text-peach dark:text-peach-dark mb-1" />
          <span className="text-xs text-muted dark:text-muted-dark">Add Medication</span>
        </Link>
        <Link to="/documents" className="card-sm p-4 text-center hover:shadow-lg transition-shadow">
          <FileText size={20} className="mx-auto text-peach dark:text-peach-dark mb-1" />
          <span className="text-xs text-muted dark:text-muted-dark">Upload Document</span>
        </Link>
        <Link to="/timeline" className="card-sm p-4 text-center hover:shadow-lg transition-shadow">
          <Clock size={20} className="mx-auto text-peach dark:text-peach-dark mb-1" />
          <span className="text-xs text-muted dark:text-muted-dark">Add Event</span>
        </Link>
        <Link to="/appointments" className="card-sm p-4 text-center hover:shadow-lg transition-shadow">
          <Calendar size={20} className="mx-auto text-peach dark:text-peach-dark mb-1" />
          <span className="text-xs text-muted dark:text-muted-dark">Add Appointment</span>
        </Link>
      </div>
    </div>
  )
}
