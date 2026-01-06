import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, PlusCircle, Save, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    price: '',           // Precio Final (Oferta)
    original_price: '',  // Precio Normal (Tachado)
    category: 'Ropa',
    image_url: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts(data || []);
  };

  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setForm({ ...form, image_url: data.publicUrl });
      alert("¡Foto subida con éxito!");

    } catch (error) {
      alert('Error subiendo imagen: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image_url) {
      alert("Por favor sube una foto.");
      return;
    }

    setLoading(true);
    // Si el campo de precio original está vacío, lo enviamos como null
    const productData = {
      ...form,
      original_price: form.original_price || null 
    };

    const { error } = await supabase.from('products').insert([productData]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Producto guardado!');
      setForm({ name: '', price: '', original_price: '', category: 'Ropa', image_url: '' });
      document.getElementById('fileInput').value = "";
      fetchProducts();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este producto?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-dark mb-8 flex items-center gap-2">
          <PlusCircle className="text-primary" /> Panel de Administración
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-4">Agregar Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Nombre del producto" required
                className="p-3 border rounded-lg bg-gray-50 focus:outline-primary"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
              <select 
                className="p-3 border rounded-lg bg-gray-50 focus:outline-primary"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              >
                {/* LISTA ACTUALIZADA SEGÚN KATIA */}
                <option>Fechas Especiales</option> {/* Navidad, San Valentín */}
                <option>Ropa</option>
                <option>Zapatillas</option>
                <option>Carteras</option>
                <option>Maquillaje</option>
                <option>Cremas y perfumes</option>
                <option>Joyería</option>
                <option>Accesorios</option>
                <option>Salud</option> {/* Antes Botiquines */}
                <option>Útiles Escolares</option> {/* Antes Papelería */}
                <option>Educación</option>
                <option>Talleres</option>
                <option>Artesanía</option>
                <option>Merchandising</option>
                <option>Hogar</option>
                <option>Postres</option>
                <option>Juguetes</option>
                <option>Regalos</option>
                <option>Tecnología</option>
                <option>Mascotas</option>
                <option>Asesorías</option>
                <option>Alquiler</option>
                <option>Otros</option>
              </select>
            </div>
            
            {/* SECCIÓN DE PRECIOS (NUEVO) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-xs text-gray-500 font-bold ml-1">PRECIO OFERTA (El que paga el cliente)</label>
                <input 
                  type="number" placeholder="Ej: 80" required
                  className="w-full p-3 border rounded-lg focus:outline-primary mt-1"
                  value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold ml-1">PRECIO ANTERIOR (Opcional - Saldrá tachado)</label>
                <input 
                  type="number" placeholder="Ej: 120"
                  className="w-full p-3 border rounded-lg focus:outline-primary mt-1 bg-white"
                  value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative col-span-2">
                <input 
                  type="file" id="fileInput" accept="image/*"
                  onChange={handleImageUpload} disabled={uploading} className="hidden"
                />
                <label 
                  htmlFor="fileInput"
                  className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${
                    uploading ? 'bg-gray-200 text-gray-500' : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  <Upload size={20} />
                  {uploading ? 'Subiendo...' : (form.image_url ? '¡Foto Lista! (Cambiar)' : 'Subir Foto')}
                </label>
              </div>
            </div>

            {form.image_url && (
              <div className="flex justify-center">
                <img src={form.image_url} alt="Vista previa" className="h-32 rounded-lg border border-gray-200 object-cover" />
              </div>
            )}

            <button disabled={loading || uploading} className="w-full bg-secondary text-dark font-bold py-3 rounded-lg hover:opacity-90 transition flex justify-center gap-2">
              <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </form>
        </div>

        {/* LISTA */}
        <h2 className="text-xl font-bold mb-4">Tus Productos ({products.length})</h2>
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100">
              <div className="flex items-center gap-4">
                <img src={product.image_url || 'https://via.placeholder.com/50'} alt="mini" className="w-16 h-16 rounded object-cover bg-gray-100" />
                <div>
                  <p className="font-bold text-dark">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category} - S/. {product.price}</p>
                  {/* Mostrar si tiene descuento */}
                  {product.original_price && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">En Oferta</span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}