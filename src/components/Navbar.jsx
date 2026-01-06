import React from 'react';
import { ShoppingBag, Lock } from 'lucide-react';
import logo from '../assets/logo.jpg'; // Importamos tu logo

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          
          {/* Lado Izquierdo: Logo y Nombre */}
          <div className="flex items-center gap-3">
            {/* Imagen del logo redondeada */}
            <img 
              src={logo} 
              alt="Logo Forever 1630" 
              className="h-12 w-12 rounded-full object-cover border-2 border-primary"
            />
            <span className="text-2xl font-bold text-primary tracking-wide">
              Forever 1630
            </span>
          </div>

          {/* Lado Derecho: Botones */}
          <div className="flex items-center gap-4">
            {/* Botón Admin (Oculto visualmente para clientes, pero accesible para ti) */}
            <button className="text-gray-400 hover:text-primary transition p-2" title="Admin Access">
              <Lock size={18} />
            </button>
            
            {/* Botón Carrito / Contacto */}
            <button className="bg-secondary text-dark px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:opacity-90 transition shadow-sm">
              <ShoppingBag size={18} />
              <span className="hidden md:inline">Ver Catálogo</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}