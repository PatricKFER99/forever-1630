import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, PlusCircle, Save, Upload } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Nuevo estado para la carga de foto
  
  const [form, setForm] = useState({
    name: '',
    price: '',
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

  // --- FUNCIÓN NUEVA: SUBIR FOTO A SUPABASE STORAGE ---
  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // 1. Crear nombre único para el archivo (ej: 123456-foto.jpg)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 2. Subir al bucket 'images'
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 3. Obtener la URL pública para guardarla
      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      
      // 4. Guardar URL en el formulario
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
      alert("Por favor espera a que suba la imagen o agrega una.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('products').insert([form]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('¡Producto guardado!');
      setForm({ name: '', price: '', category: 'Ropa', image_url: '' });
      // Limpiar el input de archivo visualmente
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
            
            {/* Nombre y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Nombre del producto" required
                className="p-3 border rounded-lg bg-gray-50 focus:outline-primary"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}
              />
              <input 
                type="number" placeholder="Precio (S/.)" required
                className="p-3 border rounded-lg bg-gray-50 focus:outline-primary"
                value={form.price} onChange={e => setForm({...form, price: e.target.value})}
              />
            </div>
            
            {/* Categoría y SUBIDA DE FOTO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="p-3 border rounded-lg bg-gray-50 focus:outline-primary"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              >
                <option>Ropa</option>
                <option>Zapatillas</option>
                <option>Carteras</option>
                <option>Joyería</option>
                <option>Accesorios</option>
                <option>Tecnología</option>
                <option>Belleza</option>
                <option>Botiquines</option>
                <option>Hogar</option>
                <option>Postres</option>
                <option>Juguetes</option>
                <option>Regalos</option>
                <option>Papelería</option>
                <option>Mascotas</option>
                <option>Asesorías</option>
                <option>Alquiler</option>
              </select>

              {/* INPUT DE ARCHIVO (MAGIA AQUÍ) */}
              <div className="relative">
                <input 
                  type="file" 
                  id="fileInput"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden" // Lo ocultamos para usar el botón bonito
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

            {/* Previsualización de la foto */}
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