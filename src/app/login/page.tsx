"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function redirectByRole() {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push("/");
    const { data: profile } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.rol === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);
    if (result.error) { setError(result.error); return; }
    await redirectByRole();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setError("");
    setSubmitting(true);
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setSubmitting(false);
    if (error) {
      setError(error.message);
      return;
    }
    setError("Revisa tu correo para confirmar la cuenta.");
  }

  function handleGoogle() {
    signInWithGoogle();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-quicksand text-sm text-[#6B6B6B] hover:text-[#EE6B8D] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border border-[#FDE8EF] p-8 sm:p-10">
          <div className="text-center mb-7">
            <div className="w-14 h-14 bg-[#FDE8EF] rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-[#EE6B8D]" fill="#EE6B8D" />
            </div>
            <h1 className="font-fredoka text-2xl sm:text-3xl font-bold text-[#C04267]">
              {view === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>
            <p className="font-quicksand text-sm text-[#6B6B6B] mt-1">
              {view === "login"
                ? "Ingresa para ver tus pedidos y favoritos"
                : "Regístrate para guardar tus favoritos"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl font-quicksand text-sm font-semibold text-[#4A4A4A] hover:bg-gray-50 hover:border-gray-300 transition-all mb-5"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="font-quicksand text-xs text-gray-400">o con correo</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={view === "login" ? handleLogin : handleRegister} className="space-y-4">
            {view === "register" && (
              <div>
                <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Nombre</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                <p className="font-quicksand text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-[#EE6B8D] to-[#C04267] text-white font-quicksand font-bold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {view === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-quicksand text-sm text-[#6B6B6B]">
              {view === "login" ? (
                <>¿No tienes cuenta?{" "}
                  <button onClick={() => { setView("register"); setError(""); }} className="text-[#EE6B8D] hover:text-[#C04267] font-semibold transition-colors">
                    Registrarse
                  </button>
                </>
              ) : (
                <>¿Ya tienes cuenta?{" "}
                  <button onClick={() => { setView("login"); setError(""); }} className="text-[#EE6B8D] hover:text-[#C04267] font-semibold transition-colors">
                    Iniciar sesión
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
