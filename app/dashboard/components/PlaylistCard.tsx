'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface PlaylistItem {
  id: string
  user_id: string
  spotify_url: string
  added_at: string
  profiles: { full_name: string } | null
}

interface Props {
  myPlaylist: Array<{ id: string; spotify_url: string; added_at: string; user_id: string }>
  allPlaylist: PlaylistItem[]
  userId: string
}

const SPOTIFY_REGEX = /^https:\/\/open\.spotify\.com\/(track|album|playlist)\/[a-zA-Z0-9]+/

function getSpotifyId(url: string): string | null {
  const match = url.match(/\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? null
}

export function PlaylistCard({ myPlaylist: initialMy, allPlaylist: initialAll, userId }: Props) {
  const [myCount, setMyCount] = useState(initialMy.length)
  const [all, setAll] = useState(initialAll)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    setError('')
    const trimmed = url.trim()
    if (!SPOTIFY_REGEX.test(trimmed)) {
      setError('Pega un link válido de Spotify (open.spotify.com/track/...)')
      return
    }
    if (myCount >= 3) {
      setError('Máximo 3 canciones por persona')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('playlist')
      .insert({ user_id: userId, spotify_url: trimmed })
      .select('*, profiles(full_name)')
      .single()

    if (err) {
      setError('Error al añadir la canción. Inténtalo de nuevo.')
    } else {
      setAll(prev => [data as PlaylistItem, ...prev])
      setMyCount(c => c + 1)
      setUrl('')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader icon="🎶" title="Playlist colaborativa" subtitle="Las canciones que suenan el día del evento" />

      {myCount < 3 ? (
        <div className="flex flex-col gap-3 mb-5">
          <Input
            id="spotifyUrl"
            label={`Añadir canción (${myCount}/3)`}
            placeholder="https://open.spotify.com/track/..."
            value={url}
            onChange={e => setUrl(e.target.value)}
            error={error}
          />
          <Button onClick={handleAdd} loading={loading} fullWidth>
            Añadir canción
          </Button>
        </div>
      ) : (
        <div className="rounded-xl bg-bg border border-border p-3 text-sm text-text-muted text-center mb-5">
          Has añadido tus 3 canciones 🎵
        </div>
      )}

      <div className="flex flex-col gap-2">
        {all.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-4">
            Sé el primero en añadir una canción 🎧
          </p>
        ) : (
          all.map(item => {
            const trackId = getSpotifyId(item.spotify_url)
            return (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                {trackId ? (
                  <div className="w-10 h-10 rounded-lg bg-[#1DB954] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center flex-shrink-0 text-lg">
                    🎵
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <a
                    href={item.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline truncate block"
                  >
                    {item.spotify_url.replace('https://open.spotify.com/', '').split('?')[0]}
                  </a>
                  <p className="text-xs text-text-muted">
                    {item.profiles?.full_name ?? 'Anónimo'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
