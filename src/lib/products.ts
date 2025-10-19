export interface Product {
  id: string;
  name: string;
  scientificName: string;
  price: number;
  image: string;
  category: string;
  location: string;
  inStock: boolean;
  onSale: boolean;
  description: string;
  specifications: {
    essentialOil?: string;
    curcumin?: string;
    packing: string;
    effectiveIngredients: string;
    certificate: string;
    model: string;
    casNo: string;
  };
  cultivationArea: string;
}

export const products: Product[] = [
  {
    id: 'CL001',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    price: 9.99,
    image: '/placeholder.svg',
    category: 'East Java',
    location: 'Malang, East Java',
    inStock: true,
    onSale: true,
    description: 'Premium quality turmeric simplisia from East Java. Known for its high curcumin content and medicinal properties.',
    specifications: {
      essentialOil: 'not less than 1.85% v/b',
      curcumin: 'not less than 3.82%',
      packing: '25kg/fiber drum',
      effectiveIngredients: 'Curcumin',
      certificate: 'ISO9001, GMP',
      model: 'HK120095',
      casNo: '458-37-7'
    },
    cultivationArea: 'East Java - Malang'
  },
  {
    id: 'AP001',
    name: 'Andrographis',
    scientificName: 'Andrographis paniculata',
    price: 12.50,
    image: '/placeholder.svg',
    category: 'West Java',
    location: 'Bogor, West Java',
    inStock: true,
    onSale: false,
    description: 'High-quality Andrographis paniculata, known for its immune-boosting properties.',
    specifications: {
      packing: '20kg/carton',
      effectiveIngredients: 'Andrographolide',
      certificate: 'ISO9001, GMP, BPOM',
      model: 'HK120096',
      casNo: '5508-58-7'
    },
    cultivationArea: 'West Java - Bogor'
  },
  {
    id: 'CV001',
    name: 'Ceylon Cinnamon',
    scientificName: 'Cinnamomum verum',
    price: 15.99,
    image: '/placeholder.svg',
    category: 'Middle Java',
    location: 'Semarang, Middle Java',
    inStock: true,
    onSale: true,
    description: 'Premium Ceylon cinnamon bark, known for its sweet flavor and medicinal properties.',
    specifications: {
      packing: '15kg/box',
      effectiveIngredients: 'Cinnamaldehyde',
      certificate: 'ISO9001, Organic, Halal',
      model: 'HK120097',
      casNo: '8015-91-6'
    },
    cultivationArea: 'Middle Java - Semarang'
  },
  {
    id: 'PN001',
    name: 'Black Pepper',
    scientificName: 'Piper nigrum',
    price: 18.75,
    image: '/placeholder.svg',
    category: 'North Sumatra',
    location: 'Medan, North Sumatra',
    inStock: true,
    onSale: false,
    description: 'Premium quality black pepper with strong aroma and high piperine content.',
    specifications: {
      packing: '25kg/bag',
      effectiveIngredients: 'Piperine',
      certificate: 'ISO9001, GMP, Phytosanitary',
      model: 'HK120098',
      casNo: '84929-31-7'
    },
    cultivationArea: 'North Sumatra - Medan'
  },
  {
    id: 'MF001',
    name: 'Nutmeg',
    scientificName: 'Myristica fragrans',
    price: 22.50,
    image: '/placeholder.svg',
    category: 'South Kalimantan',
    location: 'Banjarmasin, South Kalimantan',
    inStock: true,
    onSale: true,
    description: 'High-quality nutmeg with rich aroma and flavor, perfect for culinary and medicinal use.',
    specifications: {
      packing: '20kg/carton',
      effectiveIngredients: 'Myristicin',
      certificate: 'ISO9001, GMP, Halal',
      model: 'HK120099',
      casNo: '8008-45-5'
    },
    cultivationArea: 'South Kalimantan - Banjarmasin'
  }
];

export const categories = [
  'East Java',
  'West Java',
  'Middle Java',
  'North Sumatra',
  'South Kalimantan'
];
