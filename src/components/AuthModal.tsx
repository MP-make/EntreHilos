"use client";
import { useState, useEffect } from "react";
import { X, Mail, Lock, Eye, EyeOff, User, Heart } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  initialView?: "login" | "register";
  onClose: () => void;
}

export default function AuthModal({ isOpen, initialView = "login", onClose }: AuthModalProps) {
  const [view, setView] = useState<"login" | "register">(initialView);
  const [showPassword, setShowPassword] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, initialView]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const slideOffset = view === "register" ? "0%" : "-50%";

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${
        animate ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white w-full max-w-[900px] min-h-[500px] rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
          animate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={22} className="text-gray-500" />
        </button>

        <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#EE6B8D]" fill="#EE6B8D" />
          <span className="font-fredoka text-lg text-[#C04267]">Entre Hilos</span>
        </div>

        <div className="relative w-full h-full overflow-hidden">
          {/* Carrusel deslizante */}
          <div
            className="flex w-[200%] h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${slideOffset})` }}
          >
            {/* PANEL IZQUIERDO: Registro */}
            <div className="w-1/2 min-h-[500px] flex items-center justify-center p-8 sm:p-12">
              <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <h2 className="font-fredoka text-2xl sm:text-3xl font-bold text-[#C04267]">Crear cuenta</h2>
                  <p className="font-quicksand text-sm text-[#6B6B6B] mt-1">Regístrate para guardar tus favoritos</p>
                </div>
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Nombre</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Tu nombre" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Contraseña</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="password" placeholder="Mínimo 6 caracteres" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#EE6B8D] to-[#C04267] text-white font-quicksand font-bold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    Crear cuenta
                  </button>
                </form>
                <p className="font-quicksand text-xs text-[#6B6B6B] text-center mt-4">
                  ¿Ya tienes cuenta?{" "}
                  <button onClick={() => setView("login")} className="text-[#EE6B8D] hover:text-[#C04267] font-semibold transition-colors">
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </div>

            {/* PANEL DERECHO: Login */}
            <div className="w-1/2 min-h-[500px] flex items-center justify-center p-8 sm:p-12">
              <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <h2 className="font-fredoka text-2xl sm:text-3xl font-bold text-[#C04267]">Iniciar sesión</h2>
                  <p className="font-quicksand text-sm text-[#6B6B6B] mt-1">Ingresa para ver tus pedidos y favoritos</p>
                </div>
                <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                  <div>
                    <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" placeholder="tu@email.com" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="font-quicksand text-sm font-semibold text-[#4A4A4A] mb-1.5 block">Contraseña</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-[#EE6B8D] to-[#C04267] text-white font-quicksand font-bold text-sm rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    Ingresar
                  </button>
                </form>
                <p className="font-quicksand text-xs text-[#6B6B6B] text-center mt-4">
                  ¿No tienes cuenta?{" "}
                  <button onClick={() => setView("register")} className="text-[#EE6B8D] hover:text-[#C04267] font-semibold transition-colors">
                    Registrarse
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Indicadores visuales */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={() => setView("register")}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${view === "register" ? 'bg-[#EE6B8D] w-6' : 'bg-gray-300'}`}
            />
            <button
              onClick={() => setView("login")}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${view === "login" ? 'bg-[#EE6B8D] w-6' : 'bg-gray-300'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
