import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import { LayoutTemplate } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Sabit Üst Menü */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            DZY Katalog
          </Link>
          <nav>
            <Link to="/editor" className="text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 px-4 py-2 rounded-md">
              Yeni Proje
            </Link>
          </nav>
        </header>
        
        {/* Sayfaların Geleceği Alan */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;