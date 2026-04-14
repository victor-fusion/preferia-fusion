'use client'

import { useReducer, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Drink, UserDrinkPreference } from '@/lib/types/database.types'

interface Props {
  drinks: Drink[]
  savedPreferences: UserDrinkPreference[]
  userId: string
}

type State = { drinkId: string; value: number }[]

function initState(drinks: Drink[], saved: UserDrinkPreference[]): State {
  const savedMap = new Map(saved.map(p => [p.drink_id, p.percentage]))
  if (savedMap.size > 0) {
    return drinks.map(d => ({ drinkId: d.id, value: savedMap.get(d.id) ?? 0 }))
  }
  // Distribución inicial uniforme
  const each = Math.floor(100 / drinks.length)
  const remainder = 100 - each * drinks.length
  return drinks.map((d, i) => ({
    drinkId: d.id,
    value: i === 0 ? each + remainder : each,
  }))
}

function redistribute(state: State, changedId: string, newValue: number): State {
  const clamped = Math.max(0, Math.min(100, newValue))
  const others = state.filter(s => s.drinkId !== changedId && s.value > 0)
  const totalOthers = others.reduce((sum, s) => sum + s.value, 0)
  const budget = 100 - clamped

  let newState = state.map(s => {
    if (s.drinkId === changedId) return { ...s, value: clamped }
    if (others.length === 0) return s
    if (s.value === 0) return s
    const share = totalOthers > 0 ? (s.value / totalOthers) * budget : budget / others.length
    return { ...s, value: Math.max(0, Math.round(share)) }
  })

  // Corrección de redondeo: asegurar suma exacta = 100
  const total = newState.reduce((sum, s) => sum + s.value, 0)
  const diff = 100 - total
  if (diff !== 0) {
    // Ajustar en el primer elemento distinto al cambiado
    const idx = newState.findIndex(s => s.drinkId !== changedId)
    if (idx !== -1) {
      newState[idx] = { ...newState[idx], value: Math.max(0, newState[idx].value + diff) }
    }
  }

  return newState
}

export function DrinkPreferences({ drinks, savedPreferences, userId }: Props) {
  const [prefs, dispatch] = useReducer(
    (state: State, action: { drinkId: string; value: number }) =>
      redistribute(state, action.drinkId, action.value),
    undefined,
    () => initState(drinks, savedPreferences)
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    const supabase = createClient()
    const upsertData = prefs.map(p => ({
      user_id: userId,
      drink_id: p.drinkId,
      percentage: p.value,
      updated_at: new Date().toISOString(),
    }))
    await supabase
      .from('user_drink_preferences')
      .upsert(upsertData, { onConflict: 'user_id,drink_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const total = prefs.reduce((s, p) => s + p.value, 0)

  return (
    <Card>
      <CardHeader icon="🍻" title="Mis bebidas preferidas" subtitle="Ajusta los porcentajes para planificar la compra" />

      <div className="flex flex-col gap-4 mb-5">
        {drinks.map(drink => {
          const pref = prefs.find(p => p.drinkId === drink.id)
          const value = pref?.value ?? 0
          return (
            <div key={drink.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-text">
                  {drink.emoji} {drink.name}
                </span>
                <span className="text-sm font-bold text-primary tabular-nums w-10 text-right">
                  {value}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={e =>
                  dispatch({ drinkId: drink.id, value: parseInt(e.target.value) })
                }
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${value}%, var(--color-border) ${value}%)`,
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-text-muted">Total: {total}%</span>
        {total !== 100 && (
          <span className="text-xs text-error font-medium">Debe sumar 100%</span>
        )}
      </div>

      <Button
        onClick={handleSave}
        loading={saving}
        disabled={total !== 100}
        fullWidth
        variant={saved ? 'secondary' : 'primary'}
      >
        {saved ? '✅ Preferencias guardadas' : 'Guardar mis preferencias'}
      </Button>
    </Card>
  )
}
