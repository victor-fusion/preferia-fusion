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

  // Checklist
  const hasPaid = attendance?.payment_status === 'confirmado' || attendance?.payment_status === 'pago_enviado'
  const hasDrinks = (preferences?.length ?? 0) > 0
  const hasPlaylist = (myPlaylist?.length ?? 0) > 0

  const checklist = [
    { key: 'payment', done: hasPaid, label: 'Confirmar asistencia y pagar (20€)' },
    { key: 'drinks', done: hasDrinks, label: 'Elegir mis bebidas preferidas' },
    { key: 'playlist', done: hasPlaylist, label: 'Añadir canción a la playlist' },
  ]

  const allDone = checklist.every(c => c.done)

  return (
    <>
      {/* Saludo */}
      <div>
        <h1 className="font-display text-2xl font-bold text-text italic">
          ¡Hola, {profile.full_name.split(' ')[0]}! 🎉
        </h1>
        <p className="text-text-muted text-sm mt-0.5">17 de abril · Alcalá de Guadaira</p>
      </div>

      {/* Checklist */}
      <div className="card-gold p-5">
        <h2 className="font-display text-base font-semibold text-text mb-3">
          Tu lista de tareas
        </h2>
        <ul className="flex flex-col gap-2">
          {checklist.map(item => (
            <li key={item.key} className="flex items-center gap-3 text-sm">
              <span className={item.done ? 'text-green-600' : 'text-border'}>
                {item.done ? '✅' : '⬜'}
              </span>
              <span className={item.done ? 'line-through text-text-muted' : 'text-text'}>
                {item.label}
              </span>
            </li>
          ))}
          <li className="flex items-center gap-3 text-sm">
            <span className="text-border">⬜</span>
            <span className="text-text">Ver ubicación del evento</span>
          </li>
          <li className="flex items-center gap-3 text-sm">
            <span className="text-border">⬜</span>
            <span className="text-text">Leer las normas</span>
          </li>
        </ul>
        {allDone && (
          <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-3 text-center">
            <p className="text-green-700 font-medium text-sm">
              🎊 ¡Todo listo! Nos vemos el 17 de abril
            </p>
          </div>
        )}
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
