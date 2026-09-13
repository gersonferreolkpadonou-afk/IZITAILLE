import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Ne pas exécuter de code entre createServerClient et supabase.auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protection des routes /app/* sauf les pages d'authentification (/app/connexion, /app/inscription)
  const isAuthRoute = pathname.startsWith('/app/connexion') || pathname.startsWith('/app/inscription');
  const isAppRoute = pathname.startsWith('/app');

  // Si l'utilisateur n'est pas connecté et tente d'accéder à l'application
  if (isAppRoute && !isAuthRoute && !user) {
    // Si les clés Supabase sont encore en placeholder (mode démo / premier démarrage)
    if (supabaseUrl.includes('placeholder')) {
      // Autoriser le passage pour faciliter le développement local sans bloquer l'interface
      return supabaseResponse;
    }
    const url = request.nextUrl.clone();
    url.pathname = '/app/connexion';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Si l'utilisateur est déjà connecté et va sur connexion/inscription, rediriger vers /app
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
