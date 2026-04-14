'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

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
  return url.match(/\/track\/([a-zA-Z0-9]+)/)?.[1] ?? null
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
    <Card icon="🎶" title="Playlist colaborativa" subtitle="Las canciones que suenan el día del evento">

      {/* Input añadir canción */}
      {myCount < 3 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <div>
            <label
              htmlFor="spotifyUrl"
              style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--feria-dark)', marginBottom: 6, letterSpacing: '0.04em' }}
            >
              Añadir canción ({myCount}/3)
            </label>
            <input
              id="spotifyUrl"
              type="url"
              placeholder="https://open.spotify.com/track/..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className={`feria-input${error ? ' feria-input--error' : ''}`}
            />
            {error && (
              <p style={{ fontSize: '0.75rem', color: 'var(--feria-error)', marginTop: 4 }}>{error}</p>
            )}
          </div>
          <Button onClick={handleAdd} loading={loading} fullWidth>
            Añadir canción
          </Button>
        </div>
      ) : (
        <div
          style={{
            borderRadius: 10,
            background: 'rgba(42,107,60,0.07)',
            border: '1px solid rgba(42,107,60,0.25)',
            padding: '10px 14px',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <p style={{ fontSize: '0.875rem', color: 'var(--feria-green)', fontWeight: 600 }}>
            Has añadido tus 3 canciones 🎵
          </p>
        </div>
      )}

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {all.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: 'var(--feria-muted)', textAlign: 'center', padding: '16px 0' }}>
            Sé el primero en añadir una canción 🎧
          </p>
        ) : (
          all.map((item, idx) => {
            const trackId = getSpotifyId(item.spotify_url)
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: idx < all.length - 1 ? '1px solid var(--feria-border)' : 'none',
                }}
              >
                {/* Icono Spotify */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: trackId ? '#1DB954' : 'var(--feria-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {trackId ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                  ) : (
                    <span style={{ fontSize: '1.1rem' }}>🎵</span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <a
                    href={item.spotify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--feria-red)',
                      textDecoration: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.spotify_url.replace('https://open.spotify.com/', '').split('?')[0]}
                  </a>
                  <p style={{ fontSize: '0.75rem', color: 'var(--feria-muted)', marginTop: 1 }}>
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
