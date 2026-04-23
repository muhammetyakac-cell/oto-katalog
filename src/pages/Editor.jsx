import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { UploadCloud, Settings2, CheckCircle2, Save, RefreshCw, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CatalogPDF } from '../components/CatalogPDF';
import { Link } from 'react-router-dom';

export default function Editor() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id'); // URL'den id parametresini alıyoruz

  const [rawRows, setRawRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [products, setProducts] = useState([]);
  const [mapping, setMapping] = useState({ stokKodu: '', urunAdi: '', fiyat: '', resimUrl: '' });
  
  const [percentChange, setPercentChange] = useState(0);
  const [projectName, setProjectName] = useState('DZY Katalog 2026');
  const [isSaving, setIsSaving] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [loading, setLoading] = useState(!!projectId);

  // --- ESKİ TASLAĞI YÜKLEME MANTIĞI ---
  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      // 1. Proje adını getir
      const { data: project, error: pError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (pError) throw pError;
      setProjectName(project.name);

      // 2. Projeye ait ürünleri getir
      const { data: dbProducts, error: prodError } = await supabase
        .from('products')
        .select('*')
        .eq('project_id', projectId);

      if (prodError) throw prodError;

      // Veritabanı formatını (yılan_durumu) state formatına (deveDurumu) çeviriyoruz
      const formatted = dbProducts.map((p, idx) => ({
        id: p.id || idx,
        stokKodu: p.stok_kodu,
        urunAdi: p.urun_adi,
        fiyat: p.fiyat,
        resimUrl: p.resim_url,
        kategori: p.kategori
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("Yükleme hatası:", error);
      alert("Taslak yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // Herhangi bir ürün veya isim değiştiğinde PDF'i sıfırla
  useEffect(() => {
    setPdfReady(false);
  }, [products, projectName]);

  // Excel Yükleme
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      if (jsonData.length > 0) {
        setRawRows(jsonData);
        setColumns(Object.keys(jsonData[0]));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Eşleştirme Onayı
  const confirmMapping = () => {
    const formattedData = rawRows.map((item, index) => ({
      id: index,
      stokKodu: String(item[mapping.stokKodu] || ''),
      urunAdi: String(item[mapping.urunAdi] || ''),
      fiyat: parseFloat(item[mapping.fiyat]) || 0,
      resimUrl: mapping.resimUrl ? `https://images.weserv.nl/?url=${encodeURIComponent(item[mapping.resimUrl])}&w=400` : '',
      kategori: '',
    }));
    setProducts(formattedData);
  };

  // --- KAYDETME VE GÜNCELLEME MANTIĞI ---
  const saveToDatabase = async () => {
    setIsSaving(true);
    try {
      let currentProjectId = projectId;

      if (projectId) {
        // MEVCUT PROJEYİ GÜNCELLE
        await supabase.from('projects').update({ name: projectName }).eq('id', projectId);
        // Eski ürünleri sil (En temiz güncelleme yöntemi: Sil ve Yeniden Ekle)
        await supabase.from('products').delete().eq('project_id', projectId);
      } else {
        // YENİ PROJE OLUŞTUR
        const { data: project, error: pError } = await supabase
          .from('projects')
          .insert([{ name: projectName }])
          .select().single();
        if (pError) throw pError;
        currentProjectId = project.id;
      }

      // Ürünleri Ekle
      const productsToInsert = products.map(p => ({
        project_id: currentProjectId,
        stok_kodu: p.stokKodu,
        urun_adi: p.urunAdi,
        fiyat: p.fiyat,
        resim_url: p.resimUrl,
        kategori: p.kategori
      }));

      const { error: prodError } = await supabase.from('products').insert(productsToInsert);
      if (prodError) throw prodError;

      alert("Başarıyla Kaydedildi!");
      if (!projectId) window.location.href = `/?id=${currentProjectId}`; 
    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  if (loading) return <div className="p-20 text-center font-bold">Katalog Yükleniyor...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      
      {/* Geri Dön Butonu (Sadece düzenleme modundaysa) */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> Dashboard'a Dön
      </Link>

      {/* ADIM 1: Excel Yükleme (Sadece yeni proje ise ve veri yoksa) */}
      {!projectId && products.length === 0 && rawRows.length === 0 && (
        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
          <UploadCloud className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Yeni Katalog İçin Excel Yükleyin</h2>
          <label className="bg-gray-900 text-white px-8 py-3 rounded-xl cursor-pointer hover:bg-gray-800 transition shadow-lg">
            Dosya Seç (.xlsx)
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
          </label>
        </div>
      )}

      {/* ADIM 2: Mapping (Eşleştirme) */}
      {rawRows.length > 0 && products.length === 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-600" /> Sütunları Eşleştirin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {['stokKodu', 'urunAdi', 'fiyat', 'resimUrl'].map((field) => (
              <div key={field} className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 capitalize">
                  {field === 'resimUrl' ? 'Resim Linki' : field.replace(/([A-Z])/g, ' $1')}
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
          <button onClick={confirmMapping} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Verileri Çek ve Düzenle
          </button>
        </div>
      )}

      {/* ADIM 3: Editör ve Tablo */}
      {products.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Kontrol Paneli */}
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 sticky top-24 z-10">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-6">
              <div className="flex-1 min-w-[250px]">
                <label className="text-xs font-bold text-gray-500 uppercase">Katalog Adı</label>
                <input 
                  type="text" 
                  value={projectName} 
                  onChange={(e) => setProjectName(e.target.value)} 
                  className="w-full border-b-2 border-gray-100 focus:border-blue-500 py-1 text-lg font-bold outline-none transition-colors"
                />
              </div>

              <div className="flex gap-4 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Fiyat Değişimi (%)</label>
                  <div className="flex gap-2">
                    <input type="number" value={percentChange} onChange={(e) => setPercentChange(Number(e.target.value))} className="border border-gray-300 rounded-lg px-3 py-2 w-20 text-center outline-none focus:border-blue-500" />
                    <button onClick={() => {
                        setProducts(products.map(p => ({ ...p, fiyat: parseFloat((p.fiyat * (1 + percentChange / 100)).toFixed(2)) })));
                        setPercentChange(0);
                    }} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700">Uygula</button>
                  </div>
                </div>
                <button 
                  onClick={saveToDatabase}
                  disabled={isSaving}
                  className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" /> {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </div>

            <div className="flex justify-end border-t pt-4">
              {!pdfReady ? (
                <button onClick={() => setPdfReady(true)} className="flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition">
                  <RefreshCw className="w-5 h-5" /> PDF Dosyasını Hazırla
                </button>
              ) : (
                <PDFDownloadLink 
                  document={<CatalogPDF products={products} />} 
                  fileName={`${projectName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition"
                >
                  {({ loading }) => loading ? 'İşleniyor...' : <><Download className="w-5 h-5" /> PDF Katalog İndir</>}
                </PDFDownloadLink>
              )}
            </div>
          </div>

          {/* Ürün Listesi */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest border-b">
                  <th className="p-4">Ürün Görseli</th>
                  <th className="p-4">Stok Kodu / İsim</th>
                  <th className="p-4 w-32">Fiyat (TL)</th>
                  <th className="p-4 w-48">Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/20 transition-colors">
                    <td className="p-4">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border bg-white flex items-center justify-center p-2 shadow-sm">
                         <img src={product.resimUrl} alt="ürün" className="w-full h-full object-contain" onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Resim+Hatas%C4%B1"; }} />
                      </div>
                    </td>
                    <td className="p-4 space-y-2">
                      <input type="text" value={product.stokKodu} onChange={(e) => handleProductChange(product.id, 'stokKodu', e.target.value)} className="text-xs font-mono text-blue-600 bg-gray-50 px-2 py-1 rounded outline-none block w-full" placeholder="Stok Kodu" />
                      <input type="text" value={product.urunAdi} onChange={(e) => handleProductChange(product.id, 'urunAdi', e.target.value)} className="text-base font-bold text-gray-800 bg-transparent border-b border-transparent focus:border-blue-500 outline-none block w-full" placeholder="Ürün Adı" />
                    </td>
                    <td className="p-4">
                      <input type="number" value={product.fiyat} onChange={(e) => handleProductChange(product.id, 'fiyat', Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-3 py-2 font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-100" />
                    </td>
                    <td className="p-4">
                      <select value={product.kategori} onChange={(e) => handleProductChange(product.id, 'kategori', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-100">
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