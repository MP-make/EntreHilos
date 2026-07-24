"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FDE8EF] rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#EE6B8D]" fill="#EE6B8D" />
            </div>
            <h1 className="font-fredoka text-2xl sm:text-3xl font-bold text-[#C04267]">
              Iniciar sesión
            </h1>
            <p className="font-quicksand text-sm text-[#6B6B6B] mt-1">
              Ingresa para ver tus pedidos y favoritos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">
                Correo electrónico
              </label>
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
              <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#EE6B8D] to-[#C04267] text-white font-quicksand font-bold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="font-quicksand text-sm text-[#6B6B6B]">
              ¿No tienes cuenta?{" "}
              <button className="text-[#EE6B8D] hover:text-[#C04267] font-semibold transition-colors">
                Registrarse
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
