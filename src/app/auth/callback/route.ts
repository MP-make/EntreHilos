import { type NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient, supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const response = NextResponse.redirect(`${origin}/`)
    const supabase = createSupabaseServerClient(request, response)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const user = data.session?.user
      if (user) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('rol')
          .eq('id', user.id)
          .maybeSingle()
        if (profile?.rol === 'admin') {
          response.headers.set('Location', `${origin}/admin`)
        }
        if (!profile) {
          await supabaseAdmin.from('profiles').insert({
            id: user.id,
            email: user.email,
            nombre: user.user_metadata?.full_name,
            rol: 'user',
          })
        }
      }
      return response
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth_error`)
}
