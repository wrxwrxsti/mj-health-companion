// Data access layer: uses Supabase when configured, otherwise local demo data
import { supabase, isSupabaseConfigured } from './supabase'
import { demoMedications, demoTimelineEvents, demoLabResults, demoAppointments, demoDocuments } from './demoData'

// In-memory stores for demo mode
let localData = {
  medications: [...demoMedications],
  timeline_events: [...demoTimelineEvents],
  lab_results: [...demoLabResults],
  appointments: [...demoAppointments],
  documents: [...demoDocuments],
}

function sortBy(arr, key, asc = true) {
  return [...arr].sort((a, b) => {
    if (a[key] == null) return 1
    if (b[key] == null) return -1
    return asc ? (a[key] > b[key] ? 1 : -1) : (a[key] < b[key] ? 1 : -1)
  })
}

export const db = {
  // Generic fetch
  async fetch(table, { orderBy, ascending = true, filters = {}, limit } = {}) {
    if (isSupabaseConfigured) {
      let query = supabase.from(table).select('*')
      Object.entries(filters).forEach(([key, val]) => {
        query = query.eq(key, val)
      })
      if (orderBy) query = query.order(orderBy, { ascending })
      if (limit) query = query.limit(limit)
      const { data, error } = await query
      if (error) throw error
      return data || []
    }
    let data = [...(localData[table] || [])]
    Object.entries(filters).forEach(([key, val]) => {
      data = data.filter(d => d[key] === val)
    })
    if (orderBy) data = sortBy(data, orderBy, ascending)
    if (limit) data = data.slice(0, limit)
    return data
  },

  async insert(table, record) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(table).insert(record).select()
      if (error) throw error
      return data?.[0]
    }
    const newRecord = { ...record, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    localData[table] = [...(localData[table] || []), newRecord]
    return newRecord
  },

  async update(table, id, updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from(table).update(updates).eq('id', id).select()
      if (error) throw error
      return data?.[0]
    }
    localData[table] = (localData[table] || []).map(r => r.id === id ? { ...r, ...updates } : r)
    return localData[table].find(r => r.id === id)
  },

  async delete(table, id) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw error
      return
    }
    localData[table] = (localData[table] || []).filter(r => r.id !== id)
  },

  // File upload (only works with Supabase)
  async uploadFile(bucket, fileName, file) {
    if (!isSupabaseConfigured) {
      // In demo mode, create a fake object URL
      return { url: URL.createObjectURL(file), type: file.type }
    }
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return { url: data.publicUrl, type: file.type }
  },

  isDemo: !isSupabaseConfigured,
}
