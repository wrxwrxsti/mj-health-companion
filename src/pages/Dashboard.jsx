import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../lib/dataStore'
import { HEALTH_BRIEF, SEVERITY_DOT_COLORS, EVENT_TYPE_LABELS, DEPARTMENT_COLORS } from '../lib/constants'
import { Pill, FileText, Clock, Calendar, Plus, TrendingUp, TrendingDown, Minus, Heart } from 'lucide-react'

function Sparkline({ data, color = '#3b82f6', refLow, refHigh }) {
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
          height={Math.abs(refY2 - refY1)} fill="#22c55e" opacity="0.1" />
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
  return <Minus size={14} className="text-slate-400" />
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
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading...</div>
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Demo Banner */}
      {db.isDemo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
          Running in demo mode with sample data. Add your Supabase credentials in <code className="bg-amber-100 px-1 rounded">.env</code> to connect to a live database.
        </div>
      )}

      {/* Hero Health Brief */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Health Brief</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`${!doctorView ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>Simple</span>
            <button
              onClick={() => setDoctorView(!doctorView)}
              className={`relative w-11 h-6 rounded-full transition-colors ${doctorView ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${doctorView ? 'translate-x-5' : ''}`} />
            </button>
            <span className={`${doctorView ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>Doctor</span>
          </div>
        </div>
        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {doctorView ? HEALTH_BRIEF.doctor : HEALTH_BRIEF.simple}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Link to="/medications" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Pill size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Medications</p>
                <p className="text-2xl font-bold text-slate-800">{medications.length}</p>
              </div>
            </div>
            <span className="text-xs text-blue-600 font-medium">View All &rarr;</span>
          </div>
        </Link>

        <Link to="/appointments" className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-shadow block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar size={20} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500">Next Appointment</p>
              {nextAppt ? (
                <>
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {new Date(nextAppt.appointment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    {nextAppt.doctor_name && ` - ${nextAppt.doctor_name}`}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{nextAppt.hospital}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400">None scheduled</p>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" /> Recent Events
          </h3>
          <Link to="/timeline" className="text-xs text-blue-600 font-medium">View All &rarr;</Link>
        </div>
        {events.length === 0 ? (
          <p className="text-sm text-slate-400">No events yet</p>
        ) : (
          <div className="space-y-2">
            {events.map(event => (
              <div key={event.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT_COLORS[event.severity] || 'bg-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{event.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">
                      {new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    {event.event_type && (
                      <span className="text-xs text-slate-500">{EVENT_TYPE_LABELS[event.event_type]}</span>
                    )}
                    {event.department && (
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${DEPARTMENT_COLORS[event.department] || ''}`}>
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
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <TrendingUp size={16} className="text-slate-400" /> Key Lab Trends
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
                    <span className="text-sm font-medium text-slate-700">{name}</span>
                    <TrendIndicator data={data} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-lg font-bold ${latest.is_abnormal ? 'text-red-600' : 'text-slate-800'}`}>
                      {latest.value}
                    </span>
                    <span className="text-xs text-slate-400">{latest.unit}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Ref: {latest.ref_range_low}-{latest.ref_range_high}
                  </div>
                </div>
                <Sparkline
                  data={data}
                  color={latest.is_abnormal ? '#ef4444' : '#3b82f6'}
                  refLow={latest.ref_range_low}
                  refHigh={latest.ref_range_high}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/medications" className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-shadow">
          <Plus size={20} className="mx-auto text-blue-600 mb-1" />
          <span className="text-xs text-slate-600">Add Medication</span>
        </Link>
        <Link to="/documents" className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-shadow">
          <FileText size={20} className="mx-auto text-green-600 mb-1" />
          <span className="text-xs text-slate-600">Upload Document</span>
        </Link>
        <Link to="/timeline" className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-shadow">
          <Clock size={20} className="mx-auto text-purple-600 mb-1" />
          <span className="text-xs text-slate-600">Add Event</span>
        </Link>
        <Link to="/appointments" className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-shadow">
          <Calendar size={20} className="mx-auto text-amber-600 mb-1" />
          <span className="text-xs text-slate-600">Add Appointment</span>
        </Link>
      </div>
    </div>
  )
}
