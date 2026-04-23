import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { UploadCloud, Settings2, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function Editor() {
  const [rawRows, setRawRows] = useState([]); // Excel'den gelen ham veri
  const [columns, setColumns] = useState([]); // Excel başlıkları
  const [products, setProducts] = useState([]); // Eşleşmiş ve düzenlenebilir ürünler
  const [mapping, setMapping] = useState({
    stokKodu: '',
    urunAdi: '',
    fiyat: '',
    resimUrl: ''
  });
  const [percentChange, setPercentChange] = useState(0);

  // 1. Excel Dosyasını Oku ve Sütunları Yakala
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length > 0) {
        setRawRows(jsonData);
        setColumns(Object.keys(jsonData[0]));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 2. Kullanıcının Seçtiği Sütunlara Göre Ürünleri Oluştur
  const confirmMapping = () => {
    if (!mapping.stokKodu || !mapping.urunAdi || !mapping.fiyat) {
      alert("Lütfen en az Stok Kodu, Ürün Adı ve Fiyat sütunlarını eşleştirin.");
      return;
    }

    const formattedData = rawRows.map((item, index) => ({
      id: index,
      stokKodu: String(item[mapping.stokKodu] || ''),
      urunAdi: String(item[mapping.urunAdi] || ''),
      fiyat: parseFloat(item[mapping.fiyat]) || 0,
      resimUrl: mapping.resimUrl ? String(item[mapping.resimUrl] || '') : '',
      kategori: '',
    }));

    setProducts(formattedData);
  };

  // Toplu İşlemler ve Düzenleme Fonksiyonları
  const applyPercentageChange = () => {
    setProducts(products.map(p => ({
      ...p, 
      fiyat: parseFloat((p.fiyat * (1 + percentChange / 100)).toFixed(2))
    })));
    setPercentChange(0);
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* ADIM 1: Excel Yükleme */}
      {rawRows.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
          <UploadCloud className="w-32 h-32 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Katalog İçin Excel Yükleyin</h2>
          <label className="bg-gray-900 text-white px-8 py-3 rounded-xl cursor-pointer hover:bg-gray-800 transition">
            Dosya Seç
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {/* ADIM 2: Sütun Eşleştirme (Mapping) */}
      {rawRows.length > 0 && products.length === 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in zoom-in-95 duration-300">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-600" /> Sütunları Eşleştirin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.keys(mapping).map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 capitalize">
                  {field === 'resimUrl' ? 'Resim Linki Sütunu' : field.replace(/([A-Z])/g, ' $1')}
                </label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  value={mapping[field]}
                  onChange={(e) => setMapping({...mapping, [field]: e.target.value})}
                >
                  <option value="">Seçiniz...</option>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button 
            onClick={confirmMapping}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Verileri Çek ve Düzenleyiciyi Aç
          </button>
        </div>
      )}

      {/* ADIM 3: Editör Tablosu */}
      {products.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Üst Panel: Fiyat ve Kategori Kontrolleri */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-6 items-end justify-between sticky top-24 z-10">
            <div className="flex gap-6 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Toplu Fiyat Değişimi (%)</label>
                <div className="flex gap-2">
                  <input type="number" value={percentChange} onChange={(e) => setPercentChange(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 w-24 outline-none focus:border-blue-500" />
                  <button onClick={applyPercentageChange} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">Uygula</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Tümüne Kategori Ata</label>
                <select onChange={(e) => setProducts(products.map(p => ({...p, kategori: e.target.value})))} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white">
                  <option value="">Kategori Seç...</option>
                  <option value="Egzoz Ucu">Egzoz Ucu</option>
                  <option value="Varex">Varex</option>
                  <option value="Downpipe">Downpipe</option>
                  <option value="OEM Susturucu">OEM Susturucu</option>
                </select>
              </div>
            </div>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105">
              PDF Katalog Oluştur
            </button>
          </div>

          {/* Ürün Listesi */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b">
                  <th className="p-4 font-bold">Görsel</th>
                  <th className="p-4 font-bold">Stok Kodu</th>
                  <th className="p-4 font-bold">Ürün Adı</th>
                  <th className="p-4 font-bold w-32">Fiyat (TL)</th>
                  <th className="p-4 font-bold w-48">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="p-4">
                      {product.resimUrl ? (
                        <div className="w-32 h-32 rounded-lg overflow-hidden border bg-white flex items-center justify-center">
                           <img 
                            src={product.resimUrl} 
                            alt="ürün" 
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Hata"; }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed italic">Resim Yok</div>
                      )}
                    </td>
                    <td className="p-4 font-mono text-sm text-gray-600">
                      <input type="text" value={product.stokKodu} onChange={(e) => handleProductChange(product.id, 'stokKodu', e.target.value)} className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full" />
                    </td>
                    <td className="p-4 font-semibold text-gray-800">
                      <input type="text" value={product.urunAdi} onChange={(e) => handleProductChange(product.id, 'urunAdi', e.target.value)} className="bg-transparent border-b border-transparent focus:border-blue-500 outline-none w-full" />
                    </td>
                    <td className="p-4">
                      <input type="number" value={product.fiyat} onChange={(e) => handleProductChange(product.id, 'fiyat', Number(e.target.value))} className="w-full border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </td>
                    <td className="p-4">
                      <select value={product.kategori} onChange={(e) => handleProductChange(product.id, 'kategori', e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 text-sm outline-none bg-white">
                        <option value="">Seçiniz</option>
                        <option value="Egzoz Ucu">Egzoz Ucu</option>
                        <option value="Varex">Varex</option>
                        <option value="Downpipe">Downpipe</option>
                        <option value="OEM Susturucu">OEM Susturucu</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}