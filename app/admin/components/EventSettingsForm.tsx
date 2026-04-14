'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { EventSettings } from '@/lib/types/database.types'

export function EventSettingsForm({ initialSettings }: { initialSettings: EventSettings | null }) {
  const [bizumNumber, setBizumNumber] = useState(initialSettings?.bizum_number ?? '')
  const [bizumHolder, setBizumHolder] = useState(initialSettings?.bizum_holder ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    await supabase
      .from('event_settings')
      .upsert({
        id: 1,
        bizum_number: bizumNumber,
        bizum_holder: bizumHolder,
        updated_at: new Date().toISOString(),
      })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="card-gold p-6 max-w-md">
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <Input
          id="bizumNumber"
          label="Número de Bizum"
          type="tel"
          placeholder="600 000 000"
          value={bizumNumber}
          onChange={e => setBizumNumber(e.target.value)}
        />
        <Input
          id="bizumHolder"
          label="Titular del Bizum"
          type="text"
          placeholder="Nombre Apellidos"
          value={bizumHolder}
          onChange={e => setBizumHolder(e.target.value)}
        />
        <Button
          type="submit"
          loading={saving}
          variant={saved ? 'secondary' : 'primary'}
          fullWidth
        >
          {saved ? '✅ Configuración guardada' : 'Guardar configuración'}
        </Button>
      </form>
    </div>
  )
}
