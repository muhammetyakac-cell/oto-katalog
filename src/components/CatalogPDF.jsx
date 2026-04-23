import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Türkçe karakter desteği için stabil Roboto fontları
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf', fontStyle: 'italic' }
  ]
});

const styles = StyleSheet.create({
  page: { 
    paddingTop: 40, 
    paddingBottom: 30, 
    paddingHorizontal: 40,
    backgroundColor: '#ffffff', 
    fontFamily: 'Roboto' 
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 25, 
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    height: 80 
  },
  logo: { width: 110, height: 60, objectFit: 'contain' },
  logoPlaceholder: { width: 110, height: 60 },
  catalogTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
  
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between'
  },
  
  productCard: {
    width: '48%', 
    height: 240, 
    marginBottom: 15, 
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // Daha belirgin ve şık bir çerçeve rengi
    borderStyle: 'solid',
    borderRadius: 12, // Köşeleri biraz daha yumuşattık
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  
  imageContainer: {
    height: 100, // Resmi bir tık ufalttık ki yazılara daha çok yer kalsın
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8 
  },
  image: { width: 100, height: 100, objectFit: 'contain' },
  
  contentBox: { 
    width: '100%', 
    alignItems: 'center',
    flex: 1, // Kalan boşluğu tamamen kapla
    display: 'flex',
    flexDirection: 'column'
  },
  
  // ÜRÜN ADI: Renklendirildi ve satır sınırı kondu
  title: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#1e3a8a', // Şık bir Lacivert tonu
    marginBottom: 2,
    maxLines: 2, // 2 satırdan fazlasına izin vermez
    textOverflow: 'ellipsis' // Uzunsa sonuna ... koyar
  },
  
  // STOK KODU: İtalik ve daha belirgin gri
  code: { 
    fontSize: 8, 
    color: '#64748b', 
    marginBottom: 5, 
    fontStyle: 'italic' 
  },
  
  // KATEGORİ: Hap (Pill) tasarımlı renkli etiket
  categoryBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6
  },

  // EKSTRA ALANLAR: Taşıp fiyatı bozmasın diye flex:1 ile sıkıştırıldı
  customFieldsContainer: {
    width: '100%',
    flex: 1, // Kalan alanı doldurur ama taşırmaz
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 6
  },
  customFieldText: {
    fontSize: 7,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 1.3
  },
  customFieldLabel: {
    fontWeight: 'bold',
    color: '#0f172a'
  },
  
  // FİYAT KUTUSU: Vurucu Zümrüt Yeşili ve Beyaz Yazı
  priceContainer: { 
    backgroundColor: '#10b981', // Zümrüt yeşili
    paddingVertical: 6,
    paddingHorizontal: 20, // Daha geniş bir buton hissi
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 'auto', // ASLA yukarıdaki metinle çakışmaz, en dibe yapışır
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2
  },
  price: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#ffffff' // Beyaz renk
  },
  
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#9ca3af',
  },
});

const ProductCard = ({ product }) => (
  <View style={styles.productCard} wrap={false}>
    <View style={styles.imageContainer}>
      {product.resimUrl && (
        <Image src={product.resimUrl} style={styles.image} />
      )}
    </View>
    <View style={styles.contentBox}>
      <Text style={styles.title} maxLines={2} textOverflow="ellipsis">
        {product.urunAdi}
      </Text>
      
      <Text style={styles.code}>{product.stokKodu}</Text>
      
      {product.kategori ? (
        <Text style={styles.categoryBadge}>{product.kategori}</Text>
      ) : null}

      {/* Ekstra özellikler uzun metin dahi olsa taşıp fiyatı bozamaz */}
      <View style={styles.customFieldsContainer}>
        {product.ekstraOzellikler && Object.entries(product.ekstraOzellikler).map(([key, val], idx) => (
          val ? (
            <Text key={idx} style={styles.customFieldText} maxLines={3} textOverflow="ellipsis">
              <Text style={styles.customFieldLabel}>{key}: </Text>
              {val}
            </Text>
          ) : null
        ))}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{product.fiyat} TL</Text>
      </View>
    </View>
  </View>
);

export const CatalogPDF = ({ products, projectName, logoUrl }) => {
  const firstPageProducts = products.slice(0, 4);
  const remainingProducts = products.slice(4);
  const otherPages = [];
  
  for (let i = 0; i < remainingProducts.length; i += 6) {
    otherPages.push(remainingProducts.slice(i, i + 6));
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : <View style={styles.logoPlaceholder} />}
          <Text style={styles.catalogTitle}>{projectName}</Text>
        </View>

        <View style={styles.gridContainer}>
          {firstPageProducts.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
      </Page>

      {otherPages.map((pageGroup, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={[styles.gridContainer, { marginTop: 5 }]}>
            {pageGroup.map((product, index) => (
              <ProductCard key={product.id || index} product={product} />
            ))}
          </View>
          <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
        </Page>
      ))}
    </Document>
  );
};