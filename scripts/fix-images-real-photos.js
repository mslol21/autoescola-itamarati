// Replaces broken placeholder images (SVG files saved as .jpg) with the real
// photos from the Itamarati Instagram posts supplied by the client.
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const I = (n) => `/images/insta/insta-0${n}.jpg`;

// Hero (client's storefront photo)
db.hero.heroImageUrl = '/images/hero-facade.png';

// ---------- GALLERY: only real material ----------
db.gallery = [
  { id: 'gal-facade', title: 'Nossa fachada em Guaianases', category: 'estrutura', categoryLabel: 'Estrutura', imageUrl: '/images/hero-facade.png', studentName: '', categoryBadge: 'Rua Saturnino Pereira, 46', caption: 'A unidade da Itamarati na esquina da R. Saturnino Pereira com a R. Joaquim Leite.', isFeaturedHome: true },
  { id: 'gal-insta-02', title: 'Tire sua habilitação na Itamarati', category: 'conquistas', categoryLabel: 'Conquistas', imageUrl: I(2), categoryBadge: 'Instagram', caption: 'Aqui você alcança seu objetivo e realiza seu sonho.', isFeaturedHome: true },
  { id: 'gal-insta-04', title: 'Sua CNH, sua liberdade', category: 'aulas', categoryLabel: 'Aulas', imageUrl: I(4), categoryBadge: 'Carro e moto', caption: 'CNH de carro e moto com quem tem tradição desde 1967.', isFeaturedHome: true },
  { id: 'gal-insta-07', title: 'Curso de Motofrete', category: 'aulas', categoryLabel: 'Aulas', imageUrl: I(7), categoryBadge: 'Curso', caption: 'Pilotagem segura, rotas, logística e legislação para quem trabalha com entregas.', isFeaturedHome: true },
  { id: 'gal-insta-01', title: 'Se você faz delivery', category: 'eventos', categoryLabel: 'Eventos', imageUrl: I(1), categoryBadge: 'Orientação', caption: 'Quem trabalha com entrega precisa estar regularizado.', isFeaturedHome: true },
  { id: 'gal-insta-05', title: 'Transporte de cargas indivisíveis', category: 'aulas', categoryLabel: 'Aulas', imageUrl: I(5), categoryBadge: 'Curso', caption: 'Formação para motoristas que querem se especializar.', isFeaturedHome: false },
  { id: 'gal-insta-03', title: 'Motorista de transporte de emergência', category: 'aulas', categoryLabel: 'Aulas', imageUrl: I(3), categoryBadge: 'Curso on-line', caption: 'Curso para atuar no atendimento de emergência.', isFeaturedHome: false },
  { id: 'gal-insta-06', title: 'Multas e pontos na CNH?', category: 'eventos', categoryLabel: 'Eventos', imageUrl: I(6), categoryBadge: 'Orientação', caption: 'Não espere perder sua habilitação: fale com a equipe.', isFeaturedHome: false },
].map((g, i) => ({ studentName: '', autorizadoUsoImagem: true, order: i + 1, createdAt: '2026-10-06', ...g }));

// ---------- NEWS ----------
const covers = {
  'news-guaianases': I(2),
  'news-motoboy': I(7),
  'news-3': I(4),
  'news-2': I(6),
  'news-1': I(1),
};
db.news.forEach((n) => { if (covers[n.id]) n.coverImage = covers[n.id]; });

// Legislation articles must be reviewed by a human with an official, up-to-date source
// before going live (rules changed recently). Moved back to draft.
db.news.forEach((n) => {
  if (n.id === 'news-1' || n.id === 'news-2') { n.status = 'rascunho'; n.isFeaturedHome = false; }
});

const add = [
  {
    id: 'news-cursos-profissionalizantes',
    slug: 'cursos-profissionalizantes-itamarati',
    title: 'Cursos profissionalizantes: Motofrete, MOPP, cargas indivisíveis e emergência',
    summary: 'Para quem quer crescer no mercado de trabalho como motorista, a Itamarati oferece cursos com certificado. Conheça as opções e fale com a equipe.',
    content: `Quer aumentar suas oportunidades no mercado de trabalho? Além da primeira habilitação, a Itamarati oferece cursos profissionalizantes para motoristas.

### Alguns dos cursos divulgados pela equipe
- **Motofrete** – pilotagem segura, transporte de cargas, rotas e legislação;
- **MOPP** – movimentação operacional de produtos perigosos;
- **Transporte de cargas indivisíveis** – planejamento de rotas, sinalização, escolta e documentação;
- **Motorista de transporte de emergência** – formação para atuar no atendimento de emergência.

Valores, carga horária, modalidade e próximas turmas são informados diretamente pela equipe. Chame no WhatsApp e tire suas dúvidas.`,
    coverImage: I(5),
    category: 'Cursos',
    author: 'Equipe Itamarati',
    publishedAt: '2026-05-17',
    updatedAt: '2026-10-06',
    isFeaturedHome: true,
    sourceUrl: 'https://www.instagram.com/autoescolaitamarati/reel/DYdTAQFJyVr/',
  },
  {
    id: 'news-emergencia',
    slug: 'curso-motorista-transporte-de-emergencia',
    title: 'Curso de motorista de transporte de emergência',
    summary: 'Formação on-line para quem quer atuar na condução de veículos de emergência. Estude no seu tempo e fale com a equipe sobre inscrição.',
    content: `O curso de **motorista de transporte de emergência** prepara condutores para atuar com responsabilidade em uma das funções mais importantes do trânsito.

### Como funciona
- Estudo on-line, no celular ou computador;
- Conteúdo prático e direto ao ponto;
- Certificado ao final do curso;
- Suporte da equipe durante o curso.

Requisitos, valores e inscrição: fale com a equipe pelo WhatsApp.`,
    coverImage: I(3),
    category: 'Cursos',
    author: 'Equipe Itamarati',
    publishedAt: '2026-06-23',
    updatedAt: '2026-10-06',
    isFeaturedHome: true,
    sourceUrl: 'https://www.instagram.com/autoescolaitamarati/reel/DZ8U5V0J1eX/',
  },
];
add.forEach((a) => {
  const art = { status: 'publicado', ...a };
  const i = db.news.findIndex((n) => n.id === a.id);
  if (i >= 0) db.news[i] = art; else db.news.unshift(art);
});

db.news.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('gallery:', db.gallery.length, 'news:', db.news.map((n) => `${n.id}[${n.status}] ${n.coverImage}`));
