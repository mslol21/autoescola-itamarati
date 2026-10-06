const fs = require('fs');
const path = require('path');

function createSvgPlaceholder({ title, subtitle, category, bgGradient, accentColor, iconSvg }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradient[0]}" />
      <stop offset="50%" stop-color="${bgGradient[1]}" />
      <stop offset="100%" stop-color="${bgGradient[2]}" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.25"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="800" fill="url(#bg)" />

  <!-- Geometric dynamic design elements -->
  <circle cx="1000" cy="150" r="350" fill="url(#glow)" />
  <circle cx="200" cy="650" r="280" fill="url(#glow)" opacity="0.6" />

  <g opacity="0.08" stroke="#ffffff" stroke-width="2" fill="none">
    <circle cx="600" cy="400" r="180" />
    <circle cx="600" cy="400" r="320" />
    <circle cx="600" cy="400" r="460" />
    <line x1="100" y1="400" x2="1100" y2="400" />
    <line x1="600" y1="50" x2="600" y2="750" />
  </g>

  <!-- Central Card & Typography -->
  <g transform="translate(100, 120)">
    <!-- Badge -->
    <rect x="0" y="0" width="220" height="42" rx="21" fill="${accentColor}" fill-opacity="0.9" />
    <text x="110" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${category.toUpperCase()}</text>

    <!-- Icon Graphic -->
    <g transform="translate(850, 40)" filter="url(#shadow)">
      <circle cx="60" cy="60" r="65" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-width="2" />
      ${iconSvg}
    </g>

    <!-- Main Title -->
    <text x="0" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="800" fill="#ffffff" filter="url(#shadow)">
      ${title}
    </text>

    <!-- Subtitle / Caption -->
    <text x="0" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="400" fill="#e2e8f0" max-width="800">
      ${subtitle}
    </text>

    <!-- Watermark Brand -->
    <g transform="translate(0, 480)">
      <rect x="0" y="0" width="320" height="54" rx="27" fill="#000000" fill-opacity="0.35" />
      <text x="160" y="34" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#ffffff" text-anchor="middle">
        AUTOESCOLA ITAMARATI
      </text>
    </g>
  </g>
</svg>`;
}

const icons = {
  car: `<path d="M40 70 L48 48 C50 44 54 42 58 42 L82 42 C86 42 90 44 92 48 L100 70 M36 70 L104 70 C108 70 110 74 110 78 L110 92 C110 96 108 98 104 98 L100 98 L100 92 L40 92 L40 98 L36 98 C32 98 30 96 30 92 L30 78 C30 74 32 70 36 70 Z M46 80 A5 5 0 1 0 46 80.1 M94 80 A5 5 0 1 0 94 80.1" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  moto: `<circle cx="45" cy="80" r="18" stroke="#ffffff" stroke-width="4" fill="none"/><circle cx="95" cy="80" r="18" stroke="#ffffff" stroke-width="4" fill="none"/><path d="M45 80 L65 55 L85 55 L95 80 M65 55 L65 72 L95 72 M78 45 L92 45" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  trophy: `<path d="M44 40 L96 40 L88 75 C88 84 80 92 70 92 C60 92 52 84 52 75 Z M70 92 L70 102 M56 102 L84 102 M44 48 L32 48 C28 48 26 56 30 64 L46 68 M96 48 L108 48 C112 48 114 56 110 64 L94 68" stroke="#ffffff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  building: `<rect x="35" y="35" width="70" height="70" rx="4" stroke="#ffffff" stroke-width="4" fill="none"/><line x1="50" y1="50" x2="60" y2="50" stroke="#ffffff" stroke-width="4"/><line x1="80" y1="50" x2="90" y2="50" stroke="#ffffff" stroke-width="4"/><line x1="50" y1="70" x2="60" y2="70" stroke="#ffffff" stroke-width="4"/><line x1="80" y1="70" x2="90" y2="70" stroke="#ffffff" stroke-width="4"/><rect x="62" y="85" width="16" height="20" stroke="#ffffff" stroke-width="4" fill="none"/>`,
  news: `<rect x="35" y="35" width="70" height="70" rx="4" stroke="#ffffff" stroke-width="4" fill="none"/><line x1="45" y1="50" x2="95" y2="50" stroke="#ffffff" stroke-width="4"/><line x1="45" y1="65" x2="80" y2="65" stroke="#ffffff" stroke-width="4"/><line x1="45" y1="80" x2="95" y2="80" stroke="#ffffff" stroke-width="4"/>`,
  steering: `<circle cx="70" cy="70" r="34" stroke="#ffffff" stroke-width="4" fill="none"/><circle cx="70" cy="70" r="12" stroke="#ffffff" stroke-width="4" fill="none"/><line x1="36" y1="70" x2="58" y2="70" stroke="#ffffff" stroke-width="4"/><line x1="82" y1="70" x2="104" y2="70" stroke="#ffffff" stroke-width="4"/><line x1="70" y1="82" x2="70" y2="104" stroke="#ffffff" stroke-width="4"/>`,
};

const assets = [
  {
    path: 'public/images/hero-modern-driver.jpg',
    data: {
      category: 'Sua Próxima Conquista',
      title: 'Liberdade e Conquista no Trânsito',
      subtitle: 'Aulas acolhedoras e equipe experiente para você conquistar sua CNH com autonomia.',
      bgGradient: ['#062547', '#0a3c6f', '#031a33'],
      accentColor: '#f4790b',
      iconSvg: icons.steering,
    },
  },
  {
    path: 'public/images/gallery/conquista-cnh-carro.jpg',
    data: {
      category: 'Conquista CNH',
      title: 'Aprovação Categoria B (Carro)',
      subtitle: 'Parabéns pela dedicação e conquista da habilitação de primeira.',
      bgGradient: ['#0f3460', '#16213e', '#1a1a2e'],
      accentColor: '#10b981',
      iconSvg: icons.trophy,
    },
  },
  {
    path: 'public/images/gallery/conquista-cnh-moto.jpg',
    data: {
      category: 'Conquista CNH',
      title: 'Aprovação Categoria A (Moto)',
      subtitle: 'Equilíbrio, técnica e aprovação com distinção no circuito de duas rodas.',
      bgGradient: ['#1e3a5f', '#132c48', '#0b1d30'],
      accentColor: '#f59e0b',
      iconSvg: icons.moto,
    },
  },
  {
    path: 'public/images/gallery/conquista-cnh-ab.jpg',
    data: {
      category: 'Conquista CNH',
      title: 'Habilitação Completa Categoria A/B',
      subtitle: 'Independência em dobro para conduzir carro e moto com segurança.',
      bgGradient: ['#183d5d', '#0d2b45', '#081c2f'],
      accentColor: '#06b6d4',
      iconSvg: icons.car,
    },
  },
  {
    path: 'public/images/gallery/aula-pratica-carro.jpg',
    data: {
      category: 'Aulas Práticas',
      title: 'Treinamento Prático na Cidade',
      subtitle: 'Instrutores experientes e didática paciente para o trânsito do dia a dia.',
      bgGradient: ['#1b4332', '#2d6a4f', '#081c15'],
      accentColor: '#52b788',
      iconSvg: icons.car,
    },
  },
  {
    path: 'public/images/gallery/recepcao-itamarati.jpg',
    data: {
      category: 'Instalações',
      title: 'Atendimento Acolhedor Itamarati',
      subtitle: 'Espaço climatizado e receptivo para você se sentir em casa desde o 1º dia.',
      bgGradient: ['#0f3b57', '#154e73', '#0a273b'],
      accentColor: '#f97316',
      iconSvg: icons.building,
    },
  },
  {
    path: 'public/images/gallery/simulador-direcao.jpg',
    data: {
      category: 'Tecnologia & Ensino',
      title: 'Simulador de Direção Veicular',
      subtitle: 'Ambiente controlado e interativo para aprender marchas e reações com calma.',
      bgGradient: ['#1a2a44', '#1f3557', '#111b2b'],
      accentColor: '#38bdf8',
      iconSvg: icons.steering,
    },
  },
  {
    path: 'public/images/gallery/frota-carros.jpg',
    data: {
      category: 'Veículos Modernos',
      title: 'Frota Revisada com Ar e Direção',
      subtitle: 'Carros modernos, comandos duplos e manutenção rigorosa preventiva.',
      bgGradient: ['#1c2d42', '#253d5a', '#101c2a'],
      accentColor: '#eab308',
      iconSvg: icons.car,
    },
  },
  {
    path: 'public/images/gallery/circuito-motos.jpg',
    data: {
      category: 'Pista de Treino',
      title: 'Circuito Exclusivo de Motos',
      subtitle: 'Prancha, cones e curvas no padrão do exame prático do DETRAN.',
      bgGradient: ['#283618', '#384d20', '#1c2710'],
      accentColor: '#dda15e',
      iconSvg: icons.moto,
    },
  },
  {
    path: 'public/images/gallery/equipe-instrutores.jpg',
    data: {
      category: 'Nossa Equipe',
      title: 'Instrutores Credenciados DETRAN',
      subtitle: 'Equipe dedicada, paciente e focada na sua segurança e autonomia.',
      bgGradient: ['#2c3e50', '#34495e', '#1a252f'],
      accentColor: '#3498db',
      iconSvg: icons.building,
    },
  },
  {
    path: 'public/images/news/news-legislacao-transito.jpg',
    data: {
      category: 'Legislação Oficial',
      title: 'Aulas em Autoescola Continuam Obrigatórias',
      subtitle: 'Governo Federal desmente boatos de redes sociais sobre fim das autoescolas.',
      bgGradient: ['#0f3057', '#00587a', '#008891'],
      accentColor: '#e7e7de',
      iconSvg: icons.news,
    },
  },
  {
    path: 'public/images/news/news-renovacao-cnh.jpg',
    data: {
      category: 'Dicas & Procedimentos',
      title: 'Prazos de Renovação de CNH Atualizados',
      subtitle: 'Critérios do CTB por faixa etária e procedimentos para condutores.',
      bgGradient: ['#2b2e4a', '#53354a', '#1e2033'],
      accentColor: '#e84545',
      iconSvg: icons.news,
    },
  },
  {
    path: 'public/images/news/news-dicas-exame.jpg',
    data: {
      category: 'Dicas Práticas',
      title: 'Como Vencer o Nervosismo no Exame Prático',
      subtitle: 'Dicas preparadas por nossos instrutores para manter o foco e a calma.',
      bgGradient: ['#1f4068', '#162447', '#1b1b2f'],
      accentColor: '#e43f5a',
      iconSvg: icons.steering,
    },
  },
];

assets.forEach((asset) => {
  const fullPath = path.join(process.cwd(), asset.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const svg = createSvgPlaceholder(asset.data);
  fs.writeFileSync(fullPath, svg, 'utf-8');
  console.log(`Generated: ${asset.path}`);
});
console.log('All seed assets created successfully!');
