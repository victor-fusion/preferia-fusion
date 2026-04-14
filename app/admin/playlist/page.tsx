import { createClient } from '@/lib/supabase/server'
import { PlaylistManager } from '../components/PlaylistManager'

export default async function PlaylistPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('playlist')
    .select('*, profiles(full_name)')
    .order('added_at', { ascending: false })

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold text-text italic">Playlist del evento</h1>
      <PlaylistManager
        initialItems={(data ?? []) as Array<{
          id: string
          user_id: string
          spotify_url: string
          added_at: string
          profiles: { full_name: string } | null
        }>}
      />
    </div>
  )
}
