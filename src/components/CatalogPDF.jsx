import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Türkçe karakter desteği için Roboto
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
    paddingTop: 30, 
    paddingBottom: 20, 
    paddingHorizontal: 35,
    backgroundColor: '#ffffff', 
    fontFamily: 'Roboto' 
  },
  
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20, 
    borderBottomWidth: 2,
    borderBottomColor: '#f3f4f6',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    height: 70 
  },
  logo: { width: 100, height: 50, objectFit: 'contain' },
  logoPlaceholder: { width: 100, height: 50 },
  catalogTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
  
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between'
  },
  
  // KUTUCUK YÜKSEKLİĞİ: 215pt olarak güncellendi. (3 satır x 215 = 645pt. Header ve boşluklarla A4'e tam sığar)
  productCard: {
    width: '49%', 
    height: 215, 
    marginBottom: 12, 
    padding: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0', 
    borderStyle: 'solid',
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  
  imageContainer: {
    height: 75, // Resim alanı metinlere yer açmak için optimize edildi
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4 
  },
  image: { width: 75, height: 75, objectFit: 'contain' },
  
  contentBox: { 
    width: '100%', 
    alignItems: 'center',
    flex: 1
  },
  
  title: { 
    fontSize: 9.5, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    color: '#1e3a8a', 
    marginBottom: 1,
    height: 22, // 2 satıra kadar izin verir
    lineHeight: 1.1
  },
  
  code: { 
    fontSize: 7.5, 
    color: '#64748b', 
    marginBottom: 3, 
    fontStyle: 'italic' 
  },
  
  categoryBadge: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4
  },

  // ÖZEL ALANLAR: Üst üste binmeyi engellemek için dikey liste yapısı
  customFieldsContainer: {
    width: '100%',
    alignItems: 'center',
    height: 45, // 3 sütun için sabit dikey alan ayrıldı
    justifyContent: 'center',
    overflow: 'hidden'
  },
  customFieldRow: {
    width: '100%',
    marginBottom: 1
  },
  customFieldText: {
    fontSize: 7,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 1.1
  },
  customFieldLabel: {
    fontWeight: 'bold',
    color: '#0f172a'
  },
  
  priceContainer: { 
    backgroundColor: '#10b981', 
    paddingVertical: 4,
    paddingHorizontal: 15, 
    borderRadius: 6, 
    alignItems: 'center',
    marginTop: 'auto', // En dibe yaslanır
    width: '80%'
  },
  price: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#ffffff' 
  },
  
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 10,
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
      <Text style={styles.title} maxLines={2}>
        {product.urunAdi}
      </Text>
      
      <Text style={styles.code}>{product.stokKodu}</Text>
      
      {product.kategori ? (
        <Text style={styles.categoryBadge}>{product.kategori}</Text>
      ) : null}

      <View style={styles.customFieldsContainer}>
        {product.ekstraOzellikler && Object.entries(product.ekstraOzellikler).map(([key, val], idx) => (
          val ? (
            <View key={idx} style={styles.customFieldRow}>
              <Text style={styles.customFieldText} maxLines={1}>
                <Text style={styles.customFieldLabel}>{key}: </Text>
                {val}
              </Text>
            </View>
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
  // Matematiksel Chunking
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
          <View style={styles.gridContainer}>
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