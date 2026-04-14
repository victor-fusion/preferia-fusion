import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AttendanceCard } from './components/AttendanceCard'
import { DrinkPreferences } from './components/DrinkPreferences'
import { PlaylistCard } from './components/PlaylistCard'
import { LocationCard } from './components/LocationCard'
import { NormsCard } from './components/NormsCard'
import { AttendeesCard } from './components/AttendeesCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: profile },
    { data: attendance },
    { data: drinks },
    { data: preferences },
    { data: myPlaylist },
    { data: allPlaylist },
    { data: norms },
    { data: settings },
    { data: attendees },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('attendance').select('*').eq('user_id', user.id).single(),
    supabase.from('drinks').select('*').eq('active', true).order('sort_order'),
    supabase.from('user_drink_preferences').select('*').eq('user_id', user.id),
    supabase.from('playlist').select('*').eq('user_id', user.id).order('added_at'),
    supabase.from('playlist').select('*, profiles(full_name)').order('added_at', { ascending: false }),
    supabase.from('norms').select('*').eq('active', true).order('sort_order'),
    supabase.from('event_settings').select('*').eq('id', 1).single(),
    supabase.from('profiles').select('*, attendance(payment_status)').order('full_name'),
  ])

  if (!profile) redirect('/login')

  const hasPaid   = attendance?.payment_status === 'confirmado' || attendance?.payment_status === 'pago_enviado'
  const hasDrinks = (preferences?.length ?? 0) > 0
  const hasPlaylist = (myPlaylist?.length ?? 0) > 0

  const checklist = [
    { key: 'payment',  done: hasPaid,     label: 'Confirmar asistencia y pagar (20€)' },
    { key: 'drinks',   done: hasDrinks,   label: 'Elegir mis bebidas preferidas' },
    { key: 'playlist', done: hasPlaylist, label: 'Añadir canción a la playlist' },
  ]

  const allDone = checklist.every(c => c.done)

  return (
    <>
      {/* ── Saludo ── */}
      <div style={{ paddingBottom: 4 }}>
        <h1
          className="font-display italic font-bold"
          style={{ fontSize: '1.6rem', color: 'var(--feria-red)', lineHeight: 1.2 }}
        >
          ¡Hola, {profile.full_name.split(' ')[0]}!
        </h1>
        <p style={{ color: 'var(--feria-muted)', fontSize: '0.85rem', marginTop: 2 }}>
          17 de abril · Alcalá de Guadaira · 14:30h
        </p>
      </div>

      {/* ── Checklist ── */}
      <div className="feria-card">
        <div className="feria-card-header">
          <h2
            className="font-display italic"
            style={{ fontSize: '1rem', fontWeight: 600, color: 'white', position: 'relative', zIndex: 2 }}
          >
            Tu lista de tareas
          </h2>
        </div>
        <div className="feria-card-body">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {checklist.map(item => (
              <li key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem' }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    background: item.done ? 'var(--feria-green)' : 'transparent',
                    border: item.done ? 'none' : '2px solid var(--feria-border)',
                    fontSize: '0.7rem',
                    color: 'white',
                  }}
                >
                  {item.done ? '✓' : ''}
                </span>
                <span style={{
                  color: item.done ? 'var(--feria-muted)' : 'var(--feria-dark)',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>

          {allDone && (
            <div
              style={{
                marginTop: 16,
                borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(42,107,60,0.08), rgba(42,107,60,0.04))',
                border: '1px solid rgba(42,107,60,0.3)',
                padding: '10px 14px',
                textAlign: 'center',
              }}
            >
              <p style={{ color: 'var(--feria-green)', fontWeight: 600, fontSize: '0.875rem' }}>
                🎊 ¡Todo listo! Nos vemos el 17 de abril
              </p>
            </div>
          )}
        </div>
      </div>

      <AttendanceCard
        attendance={attendance}
        settings={settings}
        userId={user.id}
        userName={profile.full_name}
      />

      <DrinkPreferences
        drinks={drinks ?? []}
        savedPreferences={preferences ?? []}
        userId={user.id}
      />

      <PlaylistCard
        myPlaylist={myPlaylist ?? []}
        allPlaylist={(allPlaylist ?? []) as Array<{ id: string; user_id: string; spotify_url: string; added_at: string; profiles: { full_name: string } | null }>}
        userId={user.id}
      />

      <LocationCard />

      <NormsCard norms={norms ?? []} />

      <AttendeesCard
        attendees={(attendees ?? []) as Array<{ id: string; full_name: string; attendance: Array<{ payment_status: string }> | null }>}
      />
    </>
  )
}
