import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { DEPARTMENT_COLORS, DOC_TYPE_LABELS } from '../lib/constants'
import { Plus, X, FileText, Upload, Grid, List, Eye, Trash2, Search } from 'lucide-react'

const emptyDoc = {
  title: '', doc_type: 'other', doc_date: '', hospital: '',
  department: '', doctor_name: '', notes: '', tags: [],
}

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyDoc)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState({ type: '', department: '', search: '' })
  const [lightboxUrl, setLightboxUrl] = useState(null)

  useEffect(() => { fetchDocuments() }, [])

  async function fetchDocuments() {
    setLoading(true)
    try {
      const data = await db.fetch('documents', { orderBy: 'doc_date', ascending: false })
      setDocuments(data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const filtered = documents.filter(d => {
    if (filter.type && d.doc_type !== filter.type) return false
    if (filter.department && d.department !== filter.department) return false
    if (filter.search && !d.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  async function handleSubmit(e) {
    e.preventDefault()
    setUploading(true)
    let file_url = null
    let file_type = null

    if (file) {
      try {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}.${ext}`
        const result = await db.uploadFile('documents', fileName, file)
        file_url = result.url
        file_type = result.type
      } catch (err) {
        alert('Upload failed: ' + err.message)
        setUploading(false)
        return
      }
    }

    const payload = {
      ...form,
      file_url,
      file_type,
      doc_date: form.doc_date || null,
      tags: form.tags?.length ? form.tags : null,
    }

    await db.insert('documents', payload)
    setShowForm(false)
    setForm(emptyDoc)
    setFile(null)
    setUploading(false)
    fetchDocuments()
  }

  async function deleteDoc(id) {
    if (!confirm('Delete this document?')) return
    await db.delete('documents', id)
    fetchDocuments()
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Documents</h1>
        <button
          onClick={() => { setForm(emptyDoc); setFile(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Upload size={16} /> Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search documents..." value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All types</option>
          {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All departments</option>
          {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
        </select>
        <div className="flex border border-slate-200 rounded-lg overflow-hidden">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
            <Grid size={18} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}>
            <List size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400">No documents found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-slate-100 flex items-center justify-center cursor-pointer"
                onClick={() => doc.file_url && setLightboxUrl(doc.file_url)}>
                {doc.file_url && doc.file_type?.startsWith('image') ? (
                  <img src={doc.file_url} alt={doc.title} className="w-full h-full object-cover" />
                ) : (
                  <FileText size={40} className="text-slate-300" />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-slate-800 text-sm truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {doc.doc_type && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                      {DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}
                    </span>
                  )}
                  {doc.department && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[doc.department] || 'bg-gray-100 text-gray-700'}`}>
                      {doc.department}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-400">
                    {doc.doc_date && new Date(doc.doc_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex gap-1">
                    {doc.file_url && (
                      <button onClick={() => setLightboxUrl(doc.file_url)} className="text-blue-500 hover:text-blue-700 p-1">
                        <Eye size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteDoc(doc.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => doc.file_url && setLightboxUrl(doc.file_url)}>
                {doc.file_url && doc.file_type?.startsWith('image') ? (
                  <img src={doc.file_url} alt="" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <FileText size={20} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-800 text-sm truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {doc.doc_type && <span className="text-xs text-slate-500">{DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}</span>}
                  {doc.department && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[doc.department] || 'bg-gray-100 text-gray-700'}`}>{doc.department}</span>}
                </div>
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {doc.doc_date && new Date(doc.doc_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div className="flex gap-1 flex-shrink-0">
                {doc.file_url && (
                  <button onClick={() => setLightboxUrl(doc.file_url)} className="text-blue-500 hover:text-blue-700 p-1"><Eye size={16} /></button>
                )}
                <button onClick={() => deleteDoc(doc.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightboxUrl(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightboxUrl(null)}>
            <X size={24} />
          </button>
          {lightboxUrl.match(/\.pdf/i) ? (
            <iframe src={lightboxUrl} className="w-full max-w-4xl h-[80vh] rounded-lg" />
          ) : (
            <img src={lightboxUrl} alt="Document" className="max-w-full max-h-[80vh] rounded-lg object-contain" />
          )}
        </div>
      )}

      {/* Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Upload Document</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Document title *" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.doc_type} onChange={e => setForm({ ...form, doc_type: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input type="date" value={form.doc_date}
                  onChange={e => setForm({ ...form, doc_date: e.target.value })}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
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
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])}
                  className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={24} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">{file ? file.name : 'Click to upload image or PDF'}</p>
                </label>
              </div>
              <textarea placeholder="Notes" value={form.notes} rows={2}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" disabled={uploading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
