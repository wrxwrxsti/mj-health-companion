import { useState, useEffect } from 'react'
import { db } from '../lib/dataStore'
import { DEPARTMENT_COLORS, DOC_TYPE_LABELS } from '../lib/constants'
import { Plus, X, FileText, Upload, Grid, List, Eye, Trash2, Search } from 'lucide-react'
import { useProtectedAction } from '../lib/auth'

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
  const { protect, gate } = useProtectedAction()

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

  function handleUpload() {
    protect(() => {
      setForm(emptyDoc)
      setFile(null)
      setShowForm(true)
    })
  }

  function deleteDoc(id) {
    protect(async () => {
      if (!confirm('Delete this document?')) return
      await db.delete('documents', id)
      fetchDocuments()
    })
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {gate}
      <div className="flex items-center justify-between mb-6 animate-reveal">
        <h1 className="text-2xl font-bold text-ink dark:text-ink-dark">Documents</h1>
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-peach dark:bg-peach-dark text-white px-4 py-2 rounded-2xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Upload size={16} /> Upload
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 animate-reveal animate-reveal-delay-1">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted dark:text-muted-dark" />
          <input type="text" placeholder="Search documents..." value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            className="input pl-9" />
        </div>
        <select value={filter.type} onChange={e => setFilter({ ...filter, type: e.target.value })}
          className="input w-auto">
          <option value="">All types</option>
          {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filter.department} onChange={e => setFilter({ ...filter, department: e.target.value })}
          className="input w-auto">
          <option value="">All departments</option>
          {Object.keys(DEPARTMENT_COLORS).map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
        </select>
        <div className="flex border border-border dark:border-border-dark rounded-2xl overflow-hidden">
          <button onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-peach/15 dark:bg-peach-dark/15 text-peach dark:text-peach-dark' : 'text-muted dark:text-muted-dark'}`}>
            <Grid size={18} />
          </button>
          <button onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-peach/15 dark:bg-peach-dark/15 text-peach dark:text-peach-dark' : 'text-muted dark:text-muted-dark'}`}>
            <List size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted dark:text-muted-dark">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 animate-reveal">
          <FileText size={48} className="mx-auto text-border dark:text-border-dark mb-3" />
          <p className="text-muted dark:text-muted-dark">No documents found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div key={doc.id} className="card overflow-hidden hover:shadow-lg transition-shadow animate-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="h-32 bg-sage/30 dark:bg-sage-dark/30 flex items-center justify-center cursor-pointer"
                onClick={() => doc.file_url && setLightboxUrl(doc.file_url)}>
                {doc.file_url && doc.file_type?.startsWith('image') ? (
                  <img src={doc.file_url} alt={doc.title} className="w-full h-full object-cover" />
                ) : (
                  <FileText size={40} className="text-border dark:text-border-dark" />
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium text-ink dark:text-ink-dark text-sm truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {doc.doc_type && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sage/50 dark:bg-sage-dark/50 text-ink/70 dark:text-ink-dark/70">
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
                  <span className="text-xs text-muted dark:text-muted-dark">
                    {doc.doc_date && new Date(doc.doc_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <div className="flex gap-1">
                    {doc.file_url && (
                      <button onClick={() => setLightboxUrl(doc.file_url)} className="text-peach dark:text-peach-dark hover:opacity-70 p-1">
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
          {filtered.map((doc, i) => (
            <div key={doc.id} className="card p-4 flex items-center gap-4 animate-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-12 h-12 bg-sage/30 dark:bg-sage-dark/30 rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                onClick={() => doc.file_url && setLightboxUrl(doc.file_url)}>
                {doc.file_url && doc.file_type?.startsWith('image') ? (
                  <img src={doc.file_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <FileText size={20} className="text-border dark:text-border-dark" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-ink dark:text-ink-dark text-sm truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {doc.doc_type && <span className="text-xs text-muted dark:text-muted-dark">{DOC_TYPE_LABELS[doc.doc_type] || doc.doc_type}</span>}
                  {doc.department && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPARTMENT_COLORS[doc.department] || 'bg-gray-100 text-gray-700'}`}>{doc.department}</span>}
                </div>
              </div>
              <span className="text-xs text-muted dark:text-muted-dark flex-shrink-0">
                {doc.doc_date && new Date(doc.doc_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div className="flex gap-1 flex-shrink-0">
                {doc.file_url && (
                  <button onClick={() => setLightboxUrl(doc.file_url)} className="text-peach dark:text-peach-dark hover:opacity-70 p-1"><Eye size={16} /></button>
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
            <iframe src={lightboxUrl} className="w-full max-w-4xl h-[80vh] rounded-2xl" />
          ) : (
            <img src={lightboxUrl} alt="Document" className="max-w-full max-h-[80vh] rounded-2xl object-contain" />
          )}
        </div>
      )}

      {/* Upload Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-card dark:bg-card-dark rounded-t-[2rem] md:rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ink dark:text-ink-dark">Upload Document</h2>
              <button onClick={() => setShowForm(false)} className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Document title *" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="input" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.doc_type} onChange={e => setForm({ ...form, doc_type: e.target.value })}
                  className="input">
                  {Object.entries(DOC_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input type="date" value={form.doc_date}
                  onChange={e => setForm({ ...form, doc_date: e.target.value })}
                  className="input" />
              </div>
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
              <div className="border-2 border-dashed border-border dark:border-border-dark rounded-2xl p-6 text-center">
                <input type="file" accept="image/*,.pdf" onChange={e => setFile(e.target.files[0])}
                  className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload size={24} className="mx-auto text-muted dark:text-muted-dark mb-2" />
                  <p className="text-sm text-muted dark:text-muted-dark">{file ? file.name : 'Click to upload image or PDF'}</p>
                </label>
              </div>
              <textarea placeholder="Notes" value={form.notes} rows={2}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="input" />
              <button type="submit" disabled={uploading}
                className="w-full bg-peach dark:bg-peach-dark text-white py-2 rounded-2xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
