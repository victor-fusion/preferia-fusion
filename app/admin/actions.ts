'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function sendPasswordReset(userId: string): Promise<{ error?: string }> {
  const supabase = createAdminClient()

  // Obtener el email del usuario desde auth.users (requiere service role)
  const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId)
  if (userError || !user?.email) return { error: 'Usuario no encontrado' }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })

  if (error) return { error: 'No se pudo enviar el email de recuperación' }
  return {}
}
