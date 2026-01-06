import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ProductCard({ product }) {
  const handleBuy = () => {
    // NÚMERO DE KATIA CONFIGURADO:
    const phone = "51989424344"; 
    
    const text = `Hola Forever 1630, me interesa: ${product.name} - Precio: S/.${product.price}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // ... (El resto del código sigue igual)
  const imageSrc = product.image_url || "https://via.placeholder.com/300?text=Sin+Foto";

  return (
    // ... (El resto del diseño sigue igual)
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
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
        <p className="text-primary font-bold text-2xl mb-4">S/. {product.price}</p>
        
        <button 
          onClick={handleBuy}
          className="w-full bg-secondary text-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-80 transition active:scale-95"
        >
          <MessageCircle size={20} />
          {['Asesorías', 'Alquiler'].includes(product.category) ? 'Agendar / Consultar' : 'Pedir por WhatsApp'}
        </button>
      </div>
    </div>
  );
}