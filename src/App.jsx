import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Instagram, Facebook, MapPin, Phone, Tag } from 'lucide-react';
import { supabase } from './supabaseClient';
import Admin from './pages/Admin';
import ProductCard from './components/ProductCard';

// IMPORTA TU LOGO
import logoImg from './assets/logo.jpg'; 

// Fondo de Burbujas
const BubblesBackground = () => (
  <div className="wrapper">
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
    <div className="bubble"></div>
  </div>
);

// Footer (Pie de página)
const Footer = () => (
  <footer className="bg-white/60 border-t border-gray-200 mt-20 pt-12 pb-8 relative z-10">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <img src={logoImg} alt="Forever 1630" className="h-16 mb-4 object-contain rounded-full border border-gray-100 shadow-sm" />
        <p className="text-dark leading-relaxed text-sm">
          Tu tienda de confianza con el mejor estilo y cariño. Encuentra moda, accesorios y mucho más.
        </p>
        <div className="flex gap-4 mt-4">
          <a href="#" className="p-2 bg-white text-dark border border-gray-200 rounded-full hover:bg-primary hover:text-white transition"><Instagram size={20}/></a>
          <a href="#" className="p-2 bg-white text-dark border border-gray-200 rounded-full hover:bg-primary hover:text-white transition"><Facebook size={20}/></a>
        </div>
      </div>
      
      <div>
        <h4 className="font-bold text-lg text-dark mb-4">Explorar</h4>
        <ul className="space-y-2 text-dark/70 text-sm">
          <li className="hover:text-primary cursor-pointer transition">Inicio</li>
          <li className="hover:text-primary cursor-pointer transition">Sobre Nosotros</li>
          <li className="hover:text-primary cursor-pointer transition">Política de Envíos</li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-lg text-dark mb-4">Contacto</h4>
        <ul className="space-y-3 text-dark/70 text-sm">
          <li className="flex items-center gap-2"><MapPin size={16} className="text-primary"/> Lima, Perú</li>
          <li className="flex items-center gap-2"><Phone size={16} className="text-primary"/> 989 424 344</li>
        </ul>
      </div>
    </div>
    <div className="text-center text-dark/50 text-xs mt-10 border-t border-gray-200 pt-6">
      © 2026 Forever 1630. Hecho con ❤️
    </div>
  </footer>
);

// Tienda Principal
function Shop() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    "Todos", "Fechas Especiales", "Ropa", "Zapatillas", "Carteras", 
    "Maquillaje", "Cremas y perfumes", "Joyería", "Accesorios", 
    "Salud", "Útiles Escolares", "Educación", "Talleres", "Artesanía", 
    "Merchandising", "Tecnología", "Hogar", "Postres", "Juguetes", 
    "Regalos", "Mascotas", "Asesorías", "Alquiler", "Otros"
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*');
    setProducts(data || []);
    setLoading(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = category === "Todos" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen relative font-sans text-dark">
      <BubblesBackground />
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#fdfcf8]/90 backdrop-blur-md shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border border-primary/20" />
            <span className="font-bold text-lg md:text-xl tracking-tight hidden sm:block text-dark">
              Forever <span className="text-primary">1630</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
             <div className="relative group">
                <input 
                  type="text" 
                  placeholder="¿Qué buscas hoy?" 
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition" size={18} />
             </div>
             <Link to="/admin" className="text-xs font-bold text-gray-400 hover:text-primary transition uppercase tracking-wider">Admin</Link>
          </div>

          <button className="md:hidden text-dark p-2 hover:bg-gray-100 rounded-lg transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t p-4 absolute w-full shadow-xl animate-fade-in z-50">
             <input 
                type="text" 
                placeholder="Buscar..." 
                className="w-full p-3 bg-gray-50 rounded-lg mb-4 border focus:outline-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
        )}
      </nav>

      {/* PORTADA (Diseño Limpio y Natural) */}
      <header className="relative pt-12 pb-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm border border-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center gap-10">
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <span className="inline-block py-1 px-4 rounded-full bg-primary/20 text-dark text-xs font-bold tracking-widest uppercase">
                ✨ Nueva Colección
              </span>
              <h2 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight">
                Detalles que <br/>
                <span className="text-primary">Enamoran</span>
              </h2>
              <p className="text-dark/70 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                Descubre nuestra selección de productos pensados para resaltar tu esencia natural.
              </p>
              <div className="pt-4">
                <button onClick={() => document.getElementById('shop-section').scrollIntoView({behavior: 'smooth'})} className="bg-dark text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary transition active:scale-95">
                  Ver Productos
                </button>
              </div>
            </div>

            {/* Imagen del Logo Grande */}
            <div className="flex-1 flex justify-center relative">
               <div className="absolute inset-0 bg-primary/20 rounded-full filter blur-3xl animate-pulse transform scale-75"></div>
               <img src={logoImg} alt="Hero" className="relative w-64 h-64 object-contain rounded-full shadow-2xl border-4 border-white" />
            </div>

          </div>
        </div>
      </header>

      {/* SECCIÓN DE TIENDA */}
      <div id="shop-section" className="max-w-7xl mx-auto px-4 mb-20">
        
        {/* CATEGORÍAS (Ya NO te persiguen - Quitamos 'sticky') */}
        <div className="mb-8 py-2">
          <div className="flex gap-3 overflow-x-auto pb-4 pt-2 scrollbar-hide px-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border ${
                  category === cat 
                    ? 'bg-primary text-white border-primary shadow-md' 
                    : 'bg-white text-dark/60 border-gray-200 hover:bg-secondary hover:text-dark hover:border-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Productos */}
        <main>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 mx-4">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-dark/50">Ups, no hay nada por aquí</h3>
              <p className="text-dark/40">Intenta con otra categoría</p>
              <button onClick={() => setCategory("Todos")} className="mt-6 text-primary font-bold hover:underline">
                Ver todo los productos
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}