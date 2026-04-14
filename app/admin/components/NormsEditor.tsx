'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Norm } from '@/lib/types/database.types'

export function NormsEditor({ initialNorms }: { initialNorms: Norm[] }) {
  const [norms, setNorms] = useState(initialNorms)
  const [newIcon, setNewIcon] = useState('')
  const [newText, setNewText] = useState('')
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [editIcon, setEditIcon] = useState('')
  const [editText, setEditText] = useState('')

  async function handleAdd() {
    if (!newIcon.trim() || !newText.trim()) return
    setAdding(true)
    const supabase = createClient()
    const maxOrder = Math.max(0, ...norms.map(n => n.sort_order))
    const { data } = await supabase
      .from('norms')
      .insert({ icon: newIcon.trim(), text: newText.trim(), sort_order: maxOrder + 1 })
      .select()
      .single()
    if (data) {
      setNorms(prev => [...prev, data])
      setNewIcon('')
      setNewText('')
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('norms').delete().eq('id', id)
    setNorms(prev => prev.filter(n => n.id !== id))
    setDeleting(null)
  }

  function startEdit(norm: Norm) {
    setEditId(norm.id)
    setEditIcon(norm.icon)
    setEditText(norm.text)
  }

  async function handleSaveEdit(id: string) {
    setSaving(id)
    const supabase = createClient()
    await supabase.from('norms').update({ icon: editIcon, text: editText }).eq('id', id)
    setNorms(prev => prev.map(n => n.id === id ? { ...n, icon: editIcon, text: editText } : n))
    setEditId(null)
    setSaving(null)
  }

  async function handleMove(id: string, direction: 'up' | 'down') {
    const idx = norms.findIndex(n => n.id === id)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === norms.length - 1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const newNorms = [...norms]
    const tmp = newNorms[idx].sort_order
    newNorms[idx] = { ...newNorms[idx], sort_order: newNorms[swapIdx].sort_order }
    newNorms[swapIdx] = { ...newNorms[swapIdx], sort_order: tmp }
    ;[newNorms[idx], newNorms[swapIdx]] = [newNorms[swapIdx], newNorms[idx]]
    setNorms(newNorms)
    const supabase = createClient()
    await Promise.all([
      supabase.from('norms').update({ sort_order: newNorms[idx].sort_order }).eq('id', newNorms[idx].id),
      supabase.from('norms').update({ sort_order: newNorms[swapIdx].sort_order }).eq('id', newNorms[swapIdx].id),
    ])
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Lista */}
      {norms.map((norm, idx) => (
        <div key={norm.id} className="card-gold p-4">
          {editId === norm.id ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  value={editIcon}
                  onChange={e => setEditIcon(e.target.value)}
                  placeholder="Emoji"
                  className="w-16 h-10 rounded-lg border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-gold"
                />
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  className="flex-1 h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" loading={saving === norm.id} onClick={() => handleSaveEdit(norm.id)}>
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{norm.icon}</span>
              <p className="flex-1 text-sm text-text">{norm.text}</p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => handleMove(norm.id, 'up')}
                  disabled={idx === 0}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(norm.id, 'down')}
                  disabled={idx === norms.length - 1}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => startEdit(norm)}
                  className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-primary"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(norm.id)}
                  disabled={deleting === norm.id}
                  className="w-7 h-7 rounded-lg border border-error/30 flex items-center justify-center text-error/70 hover:text-error disabled:opacity-50"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Añadir nueva */}
      <div className="card-gold p-4">
        <p className="text-sm font-medium text-text mb-3">Añadir norma</p>
        <div className="flex gap-2 mb-3">
          <input
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            placeholder="🎉"
            className="w-16 h-10 rounded-lg border border-border text-center text-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Texto de la norma..."
            className="flex-1 h-10 rounded-lg border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
        <Button onClick={handleAdd} loading={adding} disabled={!newIcon || !newText} size="sm">
          Añadir norma
        </Button>
      </div>
    </div>
  )
}
