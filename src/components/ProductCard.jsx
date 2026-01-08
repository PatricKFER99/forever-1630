import React from 'react';
import { MessageCircle, Tag } from 'lucide-react';// Importamos ícono de etiqueta

export default function ProductCard({ product }) {
  const handleBuy = () => {
    const phone = "51989424344"; // Número de Katia
    const text = `Hola Forever 1630, me interesa: ${product.name} - Precio: S/.${product.price}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const imageSrc = product.image_url || "https://via.placeholder.com/300?text=Sin+Foto";
  
  // LÓGICA DE DESCUENTO
  const hasDiscount = product.original_price && product.original_price > product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group relative">
      
      {/* ETIQUETA DE OFERTA FLOTANTE */}
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
          -{discountPercentage}% OFF
        </div>
      )}

      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full text-dark shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-dark font-bold text-lg mb-1">{product.name}</h3>
        
        {/* PRECIOS */}
        <div className="flex items-end gap-2 mb-4">
          <p className="text-primary font-bold text-2xl">S/. {product.price}</p>
          {hasDiscount && (
            <p className="text-gray-400 text-sm line-through mb-1">S/. {product.original_price}</p>
          )}
        </div>
        
        <button 
          onClick={handleBuy}
          className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition active:scale-95 ${
            hasDiscount ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-secondary text-dark hover:bg-opacity-80'
          }`}
        >
          <MessageCircle size={20} />
          {hasDiscount ? '¡Aprovechar Oferta!' : (['Asesorías', 'Alquiler'].includes(product.category) ? 'Agendar / Consultar' : 'Pedir por WhatsApp')}
        </button>
      </div>
    </div>
  );
}