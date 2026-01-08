import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, PlusCircle, Save, Upload, Lock, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  // --- ESTADO DEL PANEL ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [form, setForm] = useState({
    name: '',
    price: '',           
    original_price: '',  
    category: 'Ropa',
    image_url: ''
  });

  // VERIFICAR CONTRASEÑA
  const handleLogin = (e) => {
    e.preventDefault();
    // AQUÍ PUEDES CAMBIAR LA CONTRASEÑA "katia123" POR LA QUE QUIERAS
    if (password === "katia123") {
      setIsAuthenticated(true);
      fetchProducts(); // Cargar productos solo si entra
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    setProducts(data || []);
  };

  // ... (El resto de funciones de subir imagen y guardar siguen igual)
  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
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
    if (!form.image_url) { alert("Por favor sube una foto."); return; }
    setLoading(true);
    const productData = { ...form, original_price: form.original_price || null };
    const { error } = await supabase.from('products').insert([productData]);
    if (error) { alert('Error: ' + error.message); } 
    else { 
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

  // --- SI NO ESTÁ LOGUEADO, MOSTRAR PANTALLA DE CANDADO ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcf8] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-primary" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-dark mb-2">Acceso Restringido</h2>
          <p className="text-gray-500 mb-6">Solo personal autorizado de Forever 1630.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Ingresa la contraseña" 
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-primary bg-gray-50 text-center text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition flex justify-center gap-2 items-center">
              <LogIn size={20} /> Entrar al Panel
            </button>
          </form>
          <Link to="/" className="block mt-6 text-sm text-gray-400 hover:text-primary">← Volver a la Tienda</Link>
        </div>
      </div>
    );
  }

  // --- SI ESTÁ LOGUEADO, MOSTRAR EL PANEL ---
  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      {/* Navbar simple del Admin */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-dark flex items-center gap-2">
          <Lock className="text-primary" size={20} /> Admin Forever 1630
        </h1>
        <Link to="/" className="text-sm font-bold text-gray-400 hover:text-primary">Ver Tienda →</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        
        {/* FORMULARIO DE AGREGAR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
          <h2 className="text-xl font-bold mb-4 text-dark">Agregar Nuevo Producto</h2>
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
                <option>Fechas Especiales</option>
                <option>Ropa</option>
                <option>Zapatillas</option>
                <option>Carteras</option>
                <option>Maquillaje</option>
                <option>Cremas y perfumes</option>
                <option>Joyería</option>
                <option>Accesorios</option>
                <option>Salud</option>
                <option>Útiles Escolares</option>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-xs text-gray-500 font-bold ml-1">PRECIO OFERTA</label>
                <input 
                  type="number" placeholder="Ej: 80" required
                  className="w-full p-3 border rounded-lg focus:outline-primary mt-1"
                  value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold ml-1">PRECIO ANTERIOR (Tachado)</label>
                <input 
                  type="number" placeholder="Ej: 120"
                  className="w-full p-3 border rounded-lg focus:outline-primary mt-1 bg-white"
                  value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})}
                />
              </div>
            </div>

            <div className="relative">
              <input type="file" id="fileInput" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
              <label htmlFor="fileInput" className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition ${uploading ? 'bg-gray-200' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                <Upload size={20} /> {uploading ? 'Subiendo...' : (form.image_url ? '¡Foto Lista! (Cambiar)' : 'Subir Foto')}
              </label>
            </div>

            {form.image_url && (
              <img src={form.image_url} alt="Vista" className="h-32 mx-auto rounded-lg border border-gray-200 object-cover" />
            )}

            <button disabled={loading || uploading} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:opacity-90 transition flex justify-center gap-2">
              <Save size={20} /> {loading ? 'Guardando...' : 'Guardar Producto'}
            </button>
          </form>
        </div>

        {/* LISTA DE PRODUCTOS */}
        <h2 className="text-xl font-bold mb-4 text-dark">Inventario ({products.length})</h2>
        <div className="grid gap-3">
          {products.map(product => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border border-gray-100">
              <div className="flex items-center gap-4">
                <img src={product.image_url} alt="mini" className="w-12 h-12 rounded object-cover bg-gray-100" />
                <div>
                  <p className="font-bold text-dark text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category} - S/. {product.price}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(product.id)} className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}