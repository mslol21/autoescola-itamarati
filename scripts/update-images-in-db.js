const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// 1. Update Hero
db.hero.heroImageUrl = '/images/hero-facade.png';
db.hero.heroImageAlt = 'Fachada da Autoescola Itamarati em Guaianases - Centro de Formação de Condutores';

// 2. Add / Update Gallery items
const newGalleryItems = [
  {
    id: 'gal-facade',
    title: 'Fachada da Autoescola Itamarati',
    category: 'estrutura',
    categoryLabel: 'Instalações',
    imageUrl: '/images/hero-facade.png',
    studentName: 'Centro de Formação',
    categoryBadge: 'Guaianases',
    caption: 'Fachada oficial do Centro de Formação de Condutores Itamarati em Guaianases.',
    isFeaturedHome: false,
    autorizadoUsoImagem: true,
    order: 0,
    createdAt: '2026-09-20',
  },
  {
    id: 'gal-motoboy',
    title: 'Aulas Práticas Categoria A (Motos)',
    category: 'aulas',
    categoryLabel: 'Aulas Práticas',
    imageUrl: '/images/gallery/instagram-reel-motoboy.jpg',
    studentName: 'Turma Duas Rodas',
    categoryBadge: 'Categoria A',
    caption: 'Capacitação prática para motos, motoboy e motogirl com foco em segurança e pilotagem defensiva.',
    isFeaturedHome: true,
    autorizadoUsoImagem: true,
    order: 1,
    createdAt: '2026-09-26',
  },
  {
    id: 'gal-guaianases',
    title: 'Tradição e Atendimento em Guaianases',
    category: 'conquistas',
    categoryLabel: 'Conquistas',
    imageUrl: '/images/gallery/instagram-reel-guaianases.jpg',
    studentName: 'Alunos & Instrutores',
    categoryBadge: 'Guaianases',
    caption: 'Acompanhamento dedicado e aprovação com suporte completo em cada etapa.',
    isFeaturedHome: true,
    autorizadoUsoImagem: true,
    order: 2,
    createdAt: '2026-09-23',
  },
];

// Prepend or merge new gallery items
newGalleryItems.forEach((newItem) => {
  const existingIdx = db.gallery.findIndex((g) => g.id === newItem.id);
  if (existingIdx >= 0) {
    db.gallery[existingIdx] = newItem;
  } else {
    db.gallery.unshift(newItem);
  }
});

// Re-index order
db.gallery.forEach((g, idx) => {
  g.order = idx + 1;
});

// 3. Add / Update News Articles
const newNewsArticles = [
  {
    id: 'news-motoboy',
    slug: 'cnh-para-motoboys-e-motogirls-oportunidades',
    title: 'Habilitação Categoria A: A Importância da Formação para Motoboys e Motogirls',
    summary: 'Com a expansão do mercado de entregas urbanas e mobilidade em duas rodas, estar com a CNH categoria A regularizada garante segurança jurídica e profissionalismo.',
    content: `O uso da motocicleta como instrumento de trabalho e mobilidade urbana cresce ano a ano na Grande São Paulo. Seja para entregas de aplicativo, motofrete ou deslocamento diário, ter a Carteira Nacional de Habilitação (Categoria A) válida e bem treinada é o primeiro passo para uma jornada segura e produtiva.

### Pilotagem defensiva como prioridade
Diferente de conduzir um automóvel, o motociclista está diretamente exposto aos impactos do tráfego. Por isso, a didática da Autoescola Itamarati enfatiza:
- Postura corporal correta e distribuição do peso sobre a moto;
- Frenagem combinada (dianteira e traseira) evitando travamentos bruscos;
- Antecipação de pontos cegos de carros, ônibus e caminhões;
- Uso correto e manutenção de equipamentos de proteção individual (capacete homologado, jaqueta e calçados adequados).

### Agilidade para quem deseja trabalhar
Na Itamarati, você conta com pista própria de treino, motos em perfeito estado de conservação e instrutores credenciados que orientam cada manobra do exame prático com paciência e clareza.`,
    coverImage: '/images/news/instagram-reel-motoboy.jpg',
    category: 'Carreira & Mobilidade',
    author: 'Instrutor Técnico Itamarati',
    status: 'publicado',
    publishedAt: '2026-09-26',
    updatedAt: '2026-09-26',
    isFeaturedHome: true,
    seoTitle: 'CNH Categoria A para Motoboys e Motogirls | Autoescola Itamarati',
    seoDescription: 'Dicas de pilotagem defensiva e capacitação para quem deseja atuar no mercado de duas rodas com segurança.',
  },
  {
    id: 'news-guaianases',
    slug: 'autoescola-itamarati-em-guaianases-tradicao-e-metodo',
    title: 'Tradição e Modernidade: Por que a Itamarati é Referência em Guaianases',
    summary: 'Com 59 anos de história e mais de 80.000 condutores habilitados, o Centro de Formação de Condutores Itamarati une método acolhedor e infraestrutura completa.',
    content: `Localizada na Rua Saturnino Pereira, 46, na divisa de Guaianases com o Lajeado, a Autoescola Itamarati é um ponto histórico de referência para milhares de famílias da Zona Leste paulistana.

### 59 anos formando condutores com respeito
A longevidade da empresa é resultado direto do compromisso com a qualidade de ensino e o respeito a cada aluno:
- **Atendimento sem burocracia:** orientações claras sobre documentação, taxas e agendamentos no DETRAN;
- **Simulador de direção:** tecnologia para criar memória muscular de pedais e marcha antes de ir para a via pública;
- **Frota própria moderna:** carros com ar-condicionado, direção assistida e manutenção preventiva rigorosa;
- **Respeito a todas as idades:** atendimento dedicado tanto ao jovem de 18 anos quanto ao aluno que busca sua habilitação na terceira idade.

Venha nos visitar e tomar um café na nossa recepção. Sua próxima conquista começa aqui!`,
    coverImage: '/images/news/instagram-reel-guaianases.jpg',
    category: 'Institucional & Região',
    author: 'Equipe Itamarati',
    status: 'publicado',
    publishedAt: '2026-09-23',
    updatedAt: '2026-09-23',
    isFeaturedHome: true,
    seoTitle: 'Autoescola em Guaianases: Conheça a Itamarati | Desde 1967',
    seoDescription: 'Referência em formação de condutores na Zona Leste de São Paulo. Conheça nossa estrutura e história.',
  },
];

newNewsArticles.forEach((newArt) => {
  const existingIdx = db.news.findIndex((n) => n.id === newArt.id);
  if (existingIdx >= 0) {
    db.news[existingIdx] = newArt;
  } else {
    db.news.unshift(newArt);
  }
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('Database updated successfully with new Logo, Hero facade, and Instagram News/Gallery items!');
