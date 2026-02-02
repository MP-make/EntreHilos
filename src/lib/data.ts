export interface Product {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: 'Ramos' | 'Amigurumis' | 'Personalizado';
  stock: number;
  descripcion?: string;
}

export const products: Product[] = [
  {
    id: '1',
    nombre: 'Ramo de Novia Clásico',
    precio: 450,
    imagen: 'https://via.placeholder.com/400x400/FFB6C1/FFFFFF?text=Ramo+Novia',
    categoria: 'Ramos',
    stock: 5,
    descripcion: 'Hermoso ramo tejido a mano con detalles en perlas'
  },
  {
    id: '2',
    nombre: 'Ramo Día de la Madre',
    precio: 380,
    imagen: 'https://via.placeholder.com/400x400/E91E63/FFFFFF?text=Ramo+Madre',
    categoria: 'Ramos',
    stock: 8,
    descripcion: 'Ramo especial con flores rosadas y moradas'
  },
  {
    id: '3',
    nombre: 'Flores Amarillas',
    precio: 320,
    imagen: 'https://via.placeholder.com/400x400/FFD700/FFFFFF?text=Flores+Amarillas',
    categoria: 'Ramos',
    stock: 12,
    descripcion: 'Ramo de flores amarillas tejidas, símbolo de amistad'
  },
  {
    id: '4',
    nombre: 'Ramo San Valentín',
    precio: 420,
    imagen: 'https://via.placeholder.com/400x400/FF1493/FFFFFF?text=San+Valentin',
    categoria: 'Ramos',
    stock: 6,
    descripcion: 'Ramo romántico con tonos rojos y rosados'
  },
  {
    id: '5',
    nombre: 'Goku Amigurumi',
    precio: 550,
    imagen: 'https://via.placeholder.com/400x400/FF8C00/FFFFFF?text=Goku+Crochet',
    categoria: 'Amigurumis',
    stock: 3,
    descripcion: 'Figura de Goku tejida a mano, incluye caja de regalo'
  },
  {
    id: '6',
    nombre: 'Spiderman Amigurumi',
    precio: 520,
    imagen: 'https://via.placeholder.com/400x400/DC143C/FFFFFF?text=Spiderman',
    categoria: 'Amigurumis',
    stock: 4,
    descripcion: 'Hombre Araña tejido con detalles en negro'
  },
  {
    id: '7',
    nombre: 'Naruto Amigurumi',
    precio: 530,
    imagen: 'https://via.placeholder.com/400x400/FFA500/FFFFFF?text=Naruto',
    categoria: 'Amigurumis',
    stock: 2,
    descripcion: 'Naruto Uzumaki tejido con su característico atuendo naranja'
  },
  {
    id: '8',
    nombre: 'Messi Amigurumi',
    precio: 580,
    imagen: 'https://via.placeholder.com/400x400/75AADB/FFFFFF?text=Messi',
    categoria: 'Amigurumis',
    stock: 3,
    descripcion: 'Lionel Messi con la camiseta argentina, incluye caja'
  },
  {
    id: '9',
    nombre: 'Pollito Empresarial',
    precio: 280,
    imagen: 'https://via.placeholder.com/400x400/FFEB3B/000000?text=Pollito+Empresa',
    categoria: 'Personalizado',
    stock: 10,
    descripcion: 'Tierno pollito tejido, ideal para regalos corporativos'
  },
  {
    id: '10',
    nombre: 'Ramo Hot Wheels',
    precio: 480,
    imagen: 'https://via.placeholder.com/400x400/1E88E5/FFFFFF?text=Hot+Wheels',
    categoria: 'Personalizado',
    stock: 4,
    descripcion: 'Ramo especial con temática de carritos Hot Wheels'
  },
  {
    id: '11',
    nombre: 'Ramo de Novio',
    precio: 400,
    imagen: 'https://via.placeholder.com/400x400/4A5568/FFFFFF?text=Ramo+Novio',
    categoria: 'Ramos',
    stock: 7,
    descripcion: 'Ramo elegante en tonos masculinos'
  },
  {
    id: '12',
    nombre: 'Amigurumi Personalizado',
    precio: 650,
    imagen: 'https://via.placeholder.com/400x400/B39DDB/FFFFFF?text=Personalizado',
    categoria: 'Personalizado',
    stock: 2,
    descripcion: 'Diseño único según tus especificaciones'
  }
];

export const categories = ['Todos', 'Ramos', 'Amigurumis', 'Personalizado'] as const;
