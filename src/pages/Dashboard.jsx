import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Veritabanından projeleri çekme fonksiyonu
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Projeler çekilirken hata:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde projeleri getir
  useEffect(() => {
    fetchProjects();
  }, []);

  // Proje silme fonksiyonu
  const deleteProject = async (id) => {
    if (!confirm('Bu kataloğu silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Listeyi güncelle
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      alert('Silme işlemi sırasında hata oluştu.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Üst Başlık ve Yeni Proje Butonu */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Kataloglarım</h2>
          <p className="text-gray-500 mt-1">Daha önce oluşturduğunuz ve kaydettiğiniz tüm taslaklar.</p>
        </div>
        <Link 
          to="/editor" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-200 font-bold active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Katalog Oluştur
        </Link>
      </div>

      {/* Yüklenme Durumu */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Kataloglar yükleniyor...</p>
        </div>
      ) : projects.length === 0 ? (
        /* Boş Durum (Hiç proje yoksa) */
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Henüz Taslak Yok</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            İlk kataloğunuzu oluşturmak için yukarıdaki "Yeni Katalog Oluştur" butonuna tıklayarak başlayabilirsiniz.
          </p>
        </div>
      ) : (
        /* Proje Listesi */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText className="w-7 h-7" />
                </div>
                <button 
                  onClick={() => deleteProject(project.id)}
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                  title="Projeyi Sil"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                {project.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(project.created_at).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <Link 
                to={`/editor?id=${project.id}`} 
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
              >
                Taslağı Aç
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}