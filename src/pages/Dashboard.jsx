import { Link } from 'react-router-dom';
import { PlusCircle, FileText } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Projelerim</h2>
        <Link 
          to="/editor" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
        >
          <PlusCircle className="w-5 h-5" />
          Yeni Katalog Oluştur
        </Link>
      </div>

      {/* Şimdilik Statik Görünüm - İleride Supabase'den map'lenecek */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Taslak
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">2026 İlkbahar Egzoz Sistemleri</h3>
          <p className="text-sm text-gray-500">Son güncelleme: Bugün</p>
        </div>
      </div>
    </div>
  );
}