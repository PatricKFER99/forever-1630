import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importamos el Router
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import { supabase } from './supabaseClient';
import Admin from './pages/Admin'; // Importamos la página Admin

// --- COMPONENTE DE LA TIENDA (LO QUE YA TENÍAS) ---
function Store() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [products, setProducts] = useState([]);
  // LISTA ACTUALIZADA CON TODOS LOS RUBROS DE KATIA
const categories = [
    "Todos", 
    "Fechas Especiales", // ✨ NUEVO: El botón especial que pidió
    "Ropa", "Zapatillas", "Carteras", 
    "Maquillaje", "Cremas y perfumes", // Nuevos
    "Joyería", "Accesorios", 
    "Salud", // Antes Botiquines
    "Útiles Escolares", // Antes Papelería
    "Educación", "Talleres", "Artesanía", "Merchandising", // Nuevos
    "Tecnología", "Hogar", "Postres", "Juguetes", "Regalos", 
    "Mascotas", "Asesorías", "Alquiler", "Otros"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === "Todos" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-accent font-sans text-dark">
      <Navbar />
      <div className="relative bg-primary/20 py-16 md:py-24 mb-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-dark mb-4 tracking-tight">FOREVER 1630</h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto">Exclusividad, estilo y servicios personalizados.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-10 overflow-x-auto">
        <div className="flex gap-2 md:justify-center min-w-max pb-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </main>
      
      {/* Botón Secreto para ir al Admin (Abajo a la derecha) */}
      <Link to="/admin" className="fixed bottom-4 right-4 bg-dark text-white p-3 rounded-full shadow-lg opacity-50 hover:opacity-100 transition text-xs">
        Admin
      </Link>
    </div>
  );
}

// --- APP PRINCIPAL CON RUTAS ---
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}