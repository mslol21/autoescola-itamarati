import fs from 'fs';
import path from 'path';
import {
  HeroConfig,
  Service,
  Course,
  GalleryItem,
  NewsArticle,
  Testimonial,
  FaqItem,
  SiteSettings,
} from './types';

export interface DatabaseSchema {
  hero: HeroConfig;
  services: Service[];
  courses: Course[];
  gallery: GalleryItem[];
  news: NewsArticle[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  settings: SiteSettings;
  adminCredentials: {
    username: string;
    passwordHash: string; // SHA-256 hash or simple secure hash
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory cache to ensure speed and consistency
let dbCache: DatabaseSchema | null = null;

// Initial verified seed data
const initialSeedData: DatabaseSchema = {
  hero: {
    badge: 'Autoescola Itamarati · Guaianases, São Paulo',
    title: 'Seu próximo capítulo',
    titleHighlight: 'começa ao volante.',
    subtitle:
      'Aulas práticas e teóricas, orientação acolhedora e uma equipe experiente que caminha com você até a conquista da sua independência e habilitação.',
    ctaPrimaryText: 'Quero começar agora',
    ctaPrimaryHref: '#passo-a-passo',
    ctaSecondaryText: 'Conhecer a Itamarati',
    ctaSecondaryHref: '/sobre',
    heroImageUrl: '/images/hero-facade.png',
    heroImageAlt: 'Jovem condutor comemorando a conquista da habilitação com confiança ao volante',
  },
  settings: {
    name: 'Autoescola Itamarati',
    cnpj: '15.866.516/0001-90',
    address: 'R. Saturnino Pereira, 46 (esq. com R. Joaquim Leite)',
    district: 'Guaianases / Lajeado',
    city: 'São Paulo',
    state: 'SP',
    cep: '08411-009',
    phone: '(11) 2554-2278',
    phoneClean: '1125542278',
    whatsapp: '(11) 97053-9746',
    whatsappClean: '5511970539746',
    email: 'autoescolaitamarati@gmail.com',
    openingHoursWeekday: 'Segunda a Sexta: 08h às 19h',
    openingHoursSaturday: 'Sábado: 08h às 13h',
    openingHoursSunday: 'Domingo e feriados: Fechado',
    instagramUrl: 'https://www.instagram.com/autoescolaitamarati/',
    facebookUrl: 'https://www.facebook.com/autoescolaitamarati/',
    googleMapsUrl: 'https://www.google.com/maps/dir//R.+Saturnino+Pereira,+46+-+Guaianases+-+São+Paulo,+SP/',
    googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.1736451088164!2d-46.411496!3d-23.5445992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce644d75984a35%3A0x55208ba2c74c0fc2!2sR.%20Saturnino%20Pereira%2C%2046%20-%20Guaianases%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2008411-009!5e0!3m2!1sen!2sbr!4v1700826934514!5m2!1sen!2sbr',
    stats: {
      years: 58,
      graduatedStudents: '+60.000',
      completedClasses: '+1.000.000',
      trainingHours: '+1.000.000 h',
    },
  },
  services: [
    {
      id: 'srv-1',
      slug: 'primeira-habilitacao',
      title: 'Primeira Habilitação (Categorias A, B e AB)',
      category: 'primeira-habilitacao',
      categoryLabel: 'Primeira CNH',
      shortDesc: 'A conquista da sua liberdade. Aulas para motos (A), carros (B) ou ambas em conjunto com instrutores pacientes e metodologia testada.',
      fullDesc: 'O início da sua jornada no trânsito deve ser leve, seguro e bem orientado. Na Itamarati, você conta com apoio completo desde a matrícula, pré-cadastro, agendamento de exames médicos, simulador de direção até o exame prático final.',
      forWhom: 'Para quem completou 18 anos e deseja conquistar a independência de conduzir seu próprio veículo com tranquilidade.',
      requirements: [
        'Ter no mínimo 18 anos completos',
        'Documento de identidade oficial com foto (RG ou equivalente)',
        'CPF em situação regular',
        'Comprovante recente de residência em seu nome ou de parente de 1º grau',
      ],
      stages: [
        'Abertura de processo no DETRAN e exames médico e psicotécnico',
        'Curso teórico presencial ou EAD com simulados interativos',
        'Aprovação na prova teórica oficial',
        'Treinamento no simulador de direção (para categoria B)',
        'Aulas práticas em veículos modernos com instrutores credenciados',
        'Exame prático de direção e emissão da Permissão Para Dirigir (PPD)',
      ],
      faqs: [
        {
          q: 'Nunca peguei em um volante antes. Consigo aprender do zero?',
          a: 'Com certeza! A maioria dos nossos alunos começa sem nenhuma experiência prévia. Nossos instrutores têm paciência e método focado em construir sua autoconfiança passo a passo.',
        },
        {
          q: 'Como são os horários das aulas práticas?',
          a: 'Oferecemos ampla flexibilidade de agendamento de segunda a sábado para conciliar com seus estudos ou trabalho.',
        },
      ],
      highlight: true,
      active: true,
      whatsappMessage: 'Olá! Vim pelo site da Itamarati e quero informações sobre a Primeira Habilitação (valores, turmas e documentos). Podem me orientar?',
    },
    {
      id: 'srv-2',
      slug: 'adicao-de-categoria',
      title: 'Adição de Categoria (A ou B)',
      category: 'adicao',
      categoryLabel: 'Adição de Categoria',
      shortDesc: 'Já tem CNH de carro e quer pilotar moto? Ou já dirige moto e precisa de habilitação para carro? Amplie suas possibilidades.',
      fullDesc: 'O processo de adição de categoria é mais rápido, pois você já possui CNH válida e não precisa refazer o curso teórico tradicional, apenas o exame médico e as aulas práticas com o exame correspondente.',
      forWhom: 'Condutores que já possuem CNH categoria A ou B e desejam adicionar a outra categoria para lazer, economia de deslocamento ou trabalho.',
      requirements: [
        'Possuir CNH válida na categoria atual',
        'Exame de aptidão física e mental em clínica credenciada',
        'Não estar com a CNH suspensa ou cassada',
      ],
      stages: [
        'Abertura do processo de adição no DETRAN',
        'Realização do exame médico correspondente',
        'Aulas práticas na categoria solicitada (moto ou carro)',
        'Exame prático de direção veicular oficial',
        'Emissão da nova CNH atualizada',
      ],
      faqs: [
        {
          q: 'Preciso fazer prova teórica novamente para adicionar categoria?',
          a: 'Não! Para quem já possui CNH definitiva, o processo foca diretamente no exame médico, nas aulas práticas da categoria desejada e na prova prática.',
        },
      ],
      highlight: true,
      active: true,
      whatsappMessage: 'Olá! Já tenho CNH e gostaria de orientações sobre ADIÇÃO DE CATEGORIA. Poderiam me passar os detalhes?',
    },
    {
      id: 'srv-3',
      slug: 'renovacao-cnh',
      title: 'Renovação de CNH sem Burocracia',
      category: 'renovacao',
      categoryLabel: 'Renovação',
      shortDesc: 'Renove sua Carteira Nacional de Habilitação com agilidade, agendamento assistido e suporte completo.',
      fullDesc: 'Evite filas e dúvidas de documentação. A equipe da Itamarati auxilia em todas as etapas para renovar sua carteira com segurança e conforme as regras vigentes do Código de Trânsito Brasileiro.',
      forWhom: 'Condutores cuja CNH está próxima da data de vencimento ou já expirou.',
      requirements: [
        'CNH atual (ou documento com foto se perdida)',
        'Comprovante de residência atualizado',
        'Exame médico/psicotécnico (e toxicológico para categorias C, D ou E)',
      ],
      stages: [
        'Verificação de pontuação e eventuais impedimentos cadastrais',
        'Agendamento rápido da avaliação médica',
        'Pagamento das taxas oficiais estaduais',
        'Emissão e entrega da CNH física e disponibilização digital no aplicativo',
      ],
      faqs: [
        {
          q: 'Quanto tempo posso dirigir com a CNH vencida?',
          a: 'A legislação permite dirigir por até 30 dias após o vencimento impresso na habilitação. Após esse prazo, dirigir é infração gravíssima.',
        },
      ],
      highlight: false,
      active: true,
      whatsappMessage: 'Olá! Preciso renovar minha CNH e gostaria do suporte da Autoescola Itamarati para organizar o processo.',
    },
    {
      id: 'srv-4',
      slug: 'reciclagem-condutor-suspenso',
      title: 'Reciclagem para Condutor Suspenso',
      category: 'reciclagem',
      categoryLabel: 'Reciclagem',
      shortDesc: 'Recupere seu direito de dirigir de forma segura, cumprindo os módulos obrigatórios com apoio e transparência.',
      fullDesc: 'Se sua CNH foi suspensa por pontuação ou por infração específica, auxiliamos na realização do curso de reciclagem obrigatório para regularizar sua situação perante o DETRAN.',
      forWhom: 'Motoristas notificados com processo de suspensão do direito de dirigir que precisam cumprir o curso preventivo ou obrigatório de reciclagem.',
      requirements: [
        'Notificação ou protocolo do processo de suspensão no DETRAN',
        'Documento oficial de identificação',
      ],
      stages: [
        'Análise da situação cadastral do prontuário',
        'Matrícula no curso de reciclagem',
        'Cumprimento da carga horária regulamentada',
        'Avaliação teórica e baixa do bloqueio no sistema',
      ],
      faqs: [
        {
          q: 'Posso fazer o curso de reciclagem à distância?',
          a: 'Sim, dependendo das diretrizes do órgão de trânsito vigente, existem modalidades homologadas com flexibilidade de estudo.',
        },
      ],
      highlight: false,
      active: true,
      whatsappMessage: 'Olá! Preciso de orientações sobre o curso de reciclagem para condutor com CNH suspensa. Podem me ajudar?',
    },
    {
      id: 'srv-5',
      slug: 'habilitacao-para-idosos',
      title: 'Habilitação Acolhedora (Sem Restrição de Idade)',
      category: 'especiais',
      categoryLabel: 'Atendimento Acolhedor',
      shortDesc: 'Nunca é tarde para realizar o sonho de dirigir. Atendimento personalizado, respeito ao ritmo de cada aluno e instrutores preparados.',
      fullDesc: 'Acreditamos que a mobilidade é sinônimo de liberdade e autonomia em qualquer fase da vida. Não existe limite máximo de idade na lei brasileira para aprender a dirigir. Nosso diferencial é a paciência, o acolhimento e a atenção humanizada.',
      forWhom: 'Pessoas de todas as idades, incluindo a terceira idade, que desejam tirar a primeira habilitação ou retomar a direção com segurança.',
      requirements: [
        'Aptidão no exame médico e psicológico credenciado',
        'Documento com foto e comprovante de residência',
        'Vontade de conquistar a sua independência!',
      ],
      stages: [
        'Conversa inicial acolhedora para entender seus objetivos e ritmo',
        'Acompanhamento nos exames de saúde',
        'Aulas no simulador para ambientação segura',
        'Aulas práticas respeitando o tempo de aprendizado de cada pessoa',
      ],
      faqs: [
        {
          q: 'Existe limite máximo de idade para tirar a CNH?',
          a: 'Não! O Código de Trânsito Brasileiro não estipula idade máxima. O único critério é a aptidão nos exames de saúde física e mental.',
        },
      ],
      highlight: true,
      active: true,
      whatsappMessage: 'Olá! Gostaria de saber mais sobre o atendimento humanizado para habilitação sem restrição de idade da Itamarati.',
    },
    {
      id: 'srv-6',
      slug: 'alteracao-pcd-para-manual',
      title: 'Alteração de CNH Especial PCD para Manual',
      category: 'especiais',
      categoryLabel: 'Alteração de Restrição',
      shortDesc: 'Mudança de CNH adaptada ou com restrição para categoria convencional com respaldo técnico e agilidade.',
      fullDesc: 'Se você possui alguma restrição na CNH que deseja retirar ou atualizar para veículos convencionais, nossa equipe orienta todos os trâmites junto à junta médica do DETRAN.',
      forWhom: 'Condutores que desejam alterar restrições médicas registradas na CNH.',
      requirements: [
        'CNH atualizada',
        'Laudo médico atualizado se aplicável',
        'Nova avaliação médica perante perito credenciado',
      ],
      stages: [
        'Abertura do processo de revisão de restrições',
        'Perícia médica no órgão oficial',
        'Aulas complementares se exigido pela junta médica',
        'Emissão da CNH atualizada',
      ],
      faqs: [
        {
          q: 'Como funciona a perícia médica para retirar a restrição?',
          a: 'Nossa equipe orienta a documentação necessária para que você realize a perícia no DETRAN com tranquilidade.',
        },
      ],
      highlight: false,
      active: true,
      whatsappMessage: 'Olá! Gostaria de tirar dúvidas sobre o serviço de alteração de CNH com restrição PCD para manual.',
    },
  ],
  courses: [
    {
      id: 'crs-1',
      slug: 'transporte-coletivo-passageiros-tcp',
      title: 'Transporte Coletivo de Passageiros (TCP)',
      kicker: 'Curso Homologado · Senatran',
      shortDesc: 'Capacitação para condução segura em transporte coletivo urbano e rodoviário, alinhado às exigências legais e segurança dos passageiros.',
      fullDesc: 'Matricule-se e prepare-se para conduzir veículos de transporte coletivo de passageiros com responsabilidade, respeito aos usuários e condução preventiva. Curso à distância homologado pela Senatran com flexibilidade de horários.',
      cargaHoraria: '50 horas-aula (conforme homologação vigente Senatran)',
      modalidade: '100% online, com estudo flexível no seu ritmo',
      homologacao: 'Homologado pela Senatran em conformidade com as resoluções vigentes',
      investimento: 'Sob consulta com condições facilitadas',
      ementa: [
        'Legislação de trânsito específica aplicada ao transporte de passageiros',
        'Direção defensiva e gerenciamento de riscos em vias urbanas e rodovias',
        'Primeiros socorros e conduta preventiva em emergências',
        'Relacionamento interpessoal e atendimento ao cidadão e pessoas com deficiência',
        'Noções de mecânica básica, inspeção e manutenção preventiva do veículo',
        'Responsabilidade social e cidadania no trânsito',
      ],
      publicoAlvo: 'Motoristas com CNH nas categorias D ou E que desejam atuar no transporte de passageiros.',
      requisitos: [
        'Ter no mínimo 21 anos completos',
        'Estar habilitado no mínimo na categoria D',
        'Não estar cumprindo pena de suspensão do direito de dirigir ou cassação',
      ],
      active: true,
      isFeatured: true,
      badge: 'Destaque Profissional',
    },
    {
      id: 'crs-2',
      slug: 'produtos-perigosos-mopp',
      title: 'Movimentação Operacional de Produtos Perigosos (MOPP)',
      kicker: 'Curso Homologado · Senatran',
      shortDesc: 'Conhecimento essencial e obrigatório para o transporte seguro e eficiente de cargas químicas, combustíveis e produtos perigosos.',
      fullDesc: 'O curso de MOPP capacita condutores para atuar no transporte rodoviário de cargas perigosas, priorizando prevenção de acidentes, manuseio seguro de EPIs, documentação e protocolos rigorosos de segurança ambiental.',
      cargaHoraria: '50 horas-aula (formação) / 16 horas-aula (atualização)',
      modalidade: '100% online — estude onde e quando puder',
      homologacao: 'Homologado pela Senatran com integração aos sistemas oficiais',
      investimento: 'Condições e formas de pagamento sob consulta via WhatsApp',
      ementa: [
        'Legislação específica sobre produtos perigosos e normas ambientais',
        'Direção defensiva de alta performance para transporte de cargas perigosas',
        'Noções de primeiros socorros e atuação em sinistros',
        'Prevenção de incêndio e manuseio de extintores específicos',
        'Classificação, rotulagem e documentação de expedição de produtos perigosos',
        'Uso de equipamentos de proteção individual (EPIs) e procedimentos de emergência',
      ],
      publicoAlvo: 'Condutores habilitados nas categorias B, C, D ou E interessados em atuar no setor químico, de combustíveis ou transportes especializados.',
      requisitos: [
        'Ter no mínimo 21 anos completos',
        'Estar habilitado no mínimo na categoria B',
        'Não ter cometido infração grave ou gravíssima nos últimos 12 meses',
      ],
      active: true,
      isFeatured: true,
      badge: 'Alta Demanda',
    },
    {
      id: 'crs-3',
      slug: 'transporte-emergencia',
      title: 'Condutor de Veículos de Emergência',
      kicker: 'Curso Homologado · Senatran',
      shortDesc: 'Capacite-se para conduzir ambulâncias, viaturas de resgate e veículos de urgência com técnica e serenidade.',
      fullDesc: 'Formação especializada para atuação em resgate e socorro, enfatizando os limites do Código de Trânsito Brasileiro sobre prioridade de passagem, iluminação especial e preservação da integridade da equipe e do paciente.',
      cargaHoraria: '50 horas-aula',
      modalidade: '100% online com suporte da equipe Itamarati',
      homologacao: 'Homologado pela Senatran',
      investimento: 'Consulte valores e condições especiais',
      ementa: [
        'Legislação e regras de trânsito para veículos com prioridade de circulação',
        'Direção defensiva sob situações de estresse e emergência',
        'Noções de suporte básico à vida e primeiros socorros',
        'Relacionamento interpessoal em momentos críticos',
        'Comunicação via rádio e integração com a equipe multidisciplinar de saúde',
      ],
      publicoAlvo: 'Motoristas que desejam atuar no SAMU, ambulâncias privadas, bombeiros civis e serviços de urgência.',
      requisitos: [
        'Ter no mínimo 21 anos',
        'Estar habilitado nas categorias A, B, C, D ou E',
      ],
      active: true,
      isFeatured: true,
      badge: 'Saúde & Resgate',
    },
    {
      id: 'crs-4',
      slug: 'transporte-escolar',
      title: 'Condutor de Transporte Escolar',
      kicker: 'Curso Homologado · Senatran',
      shortDesc: 'A responsabilidade de transportar o futuro. Formação completa com foco em cuidado com crianças e segurança máxima.',
      fullDesc: 'Seja para vans escolares, micro-ônibus ou ônibus dedicados, este curso prepara o motorista para todas as particularidades de convívio e segurança com estudantes de todas as faixas etárias.',
      cargaHoraria: '50 horas-aula',
      modalidade: '100% online',
      homologacao: 'Homologado pela Senatran',
      investimento: 'Consulte condições facilitadas',
      ementa: [
        'Legislação específica de transporte escolar e itens obrigatórios',
        'Direção defensiva preventiva para veículos de transporte coletivo infantil',
        'Noções de primeiros socorros e conduta em imprevistos com crianças',
        'Psicologia e relacionamento interpessoal com crianças, adolescentes e pais',
      ],
      publicoAlvo: 'Condutores interessados em trabalhar com transporte escolar próprio ou contratado.',
      requisitos: [
        'Ter no mínimo 21 anos',
        'Estar habilitado na categoria D ou E',
      ],
      active: true,
      isFeatured: false,
      badge: 'Escolar',
    },
    {
      id: 'crs-5',
      slug: 'cargas-indivisiveis',
      title: 'Transporte de Cargas Indivisíveis',
      kicker: 'Curso Especializado · Senatran',
      shortDesc: 'Capacitação para operação e condução de veículos de grande porte e cargas com pesos e dimensões excedentes.',
      fullDesc: 'O transporte de vigas, transformadores, turbinas e pás eólicas exige conhecimento refinado de planejamento de itinerário, regras de batedores e segurança viária.',
      cargaHoraria: '50 horas-aula',
      modalidade: '100% online',
      homologacao: 'Homologado pela Senatran',
      investimento: 'Consulte valores atualizados',
      ementa: [
        'Marco regulatório e autorizações especiais de trânsito (AET)',
        'Dinâmica veicular com carga especial e centro de gravidade elevado',
        'Planejamento de rotas, pontes, viadutos e comunicação com a fiscalização',
        'Sinalização de veículos de escolta e procedimentos de segurança',
      ],
      publicoAlvo: 'Motoristas profissionais das categorias C e E.',
      requisitos: [
        'Ter no mínimo 21 anos',
        'Estar habilitado na categoria C ou E',
      ],
      active: true,
      isFeatured: false,
      badge: 'Cargas Pesadas',
    },
    {
      id: 'crs-6',
      slug: 'atendimento-pre-hospitalar-aph',
      title: 'Atendimento Pré-Hospitalar (APH) para Motoristas',
      kicker: 'Capacitação Profissionalizante',
      shortDesc: 'Habilidade vital para socorristas e condutores que precisam agir com assertividade nos primeiros minutos pós-incidente.',
      fullDesc: 'Conheça protocolos internacionais de suporte básico, controle de hemorragias, estabilização de coluna e comunicação eficaz com os serviços médicos oficiais.',
      cargaHoraria: '40 horas-aula',
      modalidade: '100% online',
      homologacao: 'Curso livre profissionalizante com emissão de certificado',
      investimento: 'Consulte valores acessíveis',
      ementa: [
        'Avaliação da segurança da cena e biossegurança do socorrista',
        'Suporte básico de vida (RCP) e uso do desfibrilador externo automático (DEA)',
        'Imobilização provisória e transporte seguro de vítimas',
        'Atendimento em afogamentos, queimaduras e traumas cranioencefálicos',
      ],
      publicoAlvo: 'Motoristas, monitores, bombeiros civis e pessoas interessadas em primeiros socorros avançados.',
      requisitos: ['Idade mínima de 18 anos'],
      active: true,
      isFeatured: false,
      badge: 'Primeiros Socorros',
    },
    {
      id: 'crs-7',
      slug: 'nr35-trabalho-em-altura',
      title: 'NR35 · Segurança no Trabalho em Altura',
      kicker: 'Norma Regulamentadora MTE',
      shortDesc: 'Requisitos essenciais e boas práticas para atividades realizadas acima de 2 metros do nível inferior com risco de queda.',
      fullDesc: 'Atende às exigências do Ministério do Trabalho e Emprego para profissionais que acessam carrocerias altas, caminhões-tanque, caçambas ou silos durante carregamento e descarga.',
      cargaHoraria: '08 a 16 horas-aula (conforme categoria de formação ou reciclagem)',
      modalidade: '100% online',
      homologacao: 'Certificado em conformidade com as diretrizes da NR35 MTE',
      investimento: 'Consulte via WhatsApp',
      ementa: [
        'Legislação e normas técnicas complementares',
        'Análise de Risco (AR) e Permissão de Trabalho (PT)',
        'Equipamentos de Proteção Individual (EPI) e Coletiva (EPC)',
        'Técnicas de ancoragem, linha de vida e inspeção de talabartes',
        'Noções de primeiros socorros em acidentes de queda',
      ],
      publicoAlvo: 'Motoristas de transporte rodoviário de cargas, ajudantes e operadores de logística.',
      requisitos: ['Maior de 18 anos'],
      active: true,
      isFeatured: false,
      badge: 'Norma de Segurança',
    },
    {
      id: 'crs-8',
      slug: 'nr20-seguranca-inflamaveis',
      title: 'NR20 · Segurança com Inflamáveis e Combustíveis',
      kicker: 'Norma Regulamentadora MTE',
      shortDesc: 'Capacitação obrigatória para atuação em postos, transportes e instalações com líquidos inflamáveis e combustíveis.',
      fullDesc: 'O curso de NR20 orienta condutores e trabalhadores sobre as medidas de proteção, riscos de explosão, procedimentos operacionais e prevenção em ambientes com hidrocarbonetos e vapores tóxicos.',
      cargaHoraria: 'Básico (8h), Intermediário (16h) ou Avançado (32h)',
      modalidade: '100% online',
      homologacao: 'Certificação em conformidade com a NR20',
      investimento: 'Consulte de acordo com a carga horária escolhida',
      ementa: [
        'Propriedades físicas e perigos dos produtos inflamáveis',
        'Fontes de ignição e métodos de controle de fagulhas',
        'Procedimentos de carga, descarga e abastecimento seguro',
        'Plano de Resposta a Emergências e combate a princípios de incêndio',
      ],
      publicoAlvo: 'Motoristas de caminhão-tanque, operadores de pista e equipes de distribuição de combustíveis.',
      requisitos: ['Maior de 18 anos'],
      active: true,
      isFeatured: false,
      badge: 'Norma de Segurança',
    },
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Aprovação de Primeira na Categoria B',
      category: 'conquistas',
      categoryLabel: 'Conquistas',
      imageUrl: '/images/insta/insta-02.jpg',
      studentName: 'Rafael Onofre',
      categoryBadge: 'Categoria B',
      caption: 'Sorriso de quem superou a ansiedade e conquistou a independência no volante de primeira.',
      isFeaturedHome: true,
      autorizadoUsoImagem: false,
      order: 1,
      createdAt: '2026-02-15',
    },
    {
      id: 'gal-2',
      title: 'Superação e Confiança no Exame Prático',
      category: 'conquistas',
      categoryLabel: 'Conquistas',
      imageUrl: '/images/insta/insta-07.jpg',
      studentName: 'Sara Pinheiro',
      categoryBadge: 'Categoria A',
      caption: 'Parabéns à Sara pela dedicação e excelente desempenho no circuito de motos.',
      isFeaturedHome: true,
      autorizadoUsoImagem: false,
      order: 2,
      createdAt: '2026-03-01',
    },
    {
      id: 'gal-3',
      title: 'Adição de Categoria Concluída com Sucesso',
      category: 'conquistas',
      categoryLabel: 'Conquistas',
      imageUrl: '/images/insta/insta-04.jpg',
      studentName: 'Carlos Silva',
      categoryBadge: 'Categoria A/B',
      caption: 'Carlos agora habilitado para moto e carro, pronto para novas oportunidades de trabalho.',
      isFeaturedHome: true,
      autorizadoUsoImagem: false,
      order: 3,
      createdAt: '2026-03-20',
    },
    {
      id: 'gal-4',
      title: 'Aulas Práticas com Foco e Paciência',
      category: 'aulas',
      categoryLabel: 'Aulas Práticas',
      imageUrl: '/images/insta/insta-04.jpg',
      studentName: 'Aline & Instrutor Bruno',
      categoryBadge: 'Aulas na Rua',
      caption: 'Treinamento de baliza e circulação no trânsito real com orientação detalhada e acolhedora.',
      isFeaturedHome: true,
      autorizadoUsoImagem: false,
      order: 4,
      createdAt: '2026-04-05',
    },
    {
      id: 'gal-5',
      title: 'Nossa Recepção e Atendimento Acolhedor',
      category: 'estrutura',
      categoryLabel: 'Instalações',
      imageUrl: '/images/hero-facade.png',
      studentName: 'Equipe de Atendimento',
      categoryBadge: 'Recepção',
      caption: 'Espaço climatizado, confortável e atendimento atencioso desde o seu primeiro contato.',
      isFeaturedHome: false,
      autorizadoUsoImagem: false,
      order: 5,
      createdAt: '2026-04-10',
    },
    {
      id: 'gal-6',
      title: 'Treinamento no Simulador de Direção',
      category: 'estrutura',
      categoryLabel: 'Tecnologia',
      imageUrl: '/images/insta/insta-02.jpg',
      studentName: 'Simulador Moderno',
      categoryBadge: 'Simulador',
      caption: 'Ambiente controlado e interativo para aprender marcha, pedais e reflexos com tranquilidade antes das ruas.',
      isFeaturedHome: false,
      autorizadoUsoImagem: false,
      order: 6,
      createdAt: '2026-04-12',
    },
    {
      id: 'gal-7',
      title: 'Frota Moderna e Higienizada',
      category: 'estrutura',
      categoryLabel: 'Veículos',
      imageUrl: '/images/insta/insta-04.jpg',
      studentName: 'Carros com Direção Assistida e Ar',
      categoryBadge: 'Frota',
      caption: 'Veículos novos com manutenção rigorosa e comandos duplos para total segurança do aluno.',
      isFeaturedHome: false,
      autorizadoUsoImagem: false,
      order: 7,
      createdAt: '2026-04-15',
    },
    {
      id: 'gal-8',
      title: 'Pista de Treinamento de Motocicletas',
      category: 'aulas',
      categoryLabel: 'Treinamento Moto',
      imageUrl: '/images/insta/insta-07.jpg',
      studentName: 'Pista de Moto',
      categoryBadge: 'Circuito',
      caption: 'Prancha, cones e curvas no padrão do exame prático oficial do DETRAN.',
      isFeaturedHome: false,
      autorizadoUsoImagem: false,
      order: 8,
      createdAt: '2026-04-18',
    },
    {
      id: 'gal-9',
      title: 'Equipe de Instrutores Credenciados',
      category: 'equipe',
      categoryLabel: 'Nossa Equipe',
      imageUrl: '/images/insta/insta-01.jpg',
      studentName: 'Instrutores Itamarati',
      categoryBadge: 'Equipe',
      caption: 'Profissionais dedicados, credenciados pelo DETRAN e constantemente reciclados em didática humanizada.',
      isFeaturedHome: false,
      autorizadoUsoImagem: false,
      order: 9,
      createdAt: '2026-04-20',
    },
  ],
  news: [
    {
      id: 'news-1',
      slug: 'esclarecimento-aulas-autoescola-obrigatorias',
      title: 'Esclarecimento Oficial: Aulas em Autoescolas Continuam Obrigatórias no Brasil',
      summary: 'Secretaria de Comunicação Social (Secom) desmente boatos disseminados em redes sociais sobre suposto fim da obrigatoriedade das autoescolas.',
      content: `Recentemente, circularam em redes sociais mensagens e vídeos imprecisos alegando que as autoescolas teriam deixado de ser obrigatórias para a obtenção da Carteira Nacional de Habilitação (CNH).

O Governo Federal, por meio da Secretaria de Comunicação Social (Secom), e a Secretaria Nacional de Trânsito (Senatran) emitiram comunicado esclarecendo que a informação é **falsa**.

### O que diz a legislação vigente?
A formação teórica e prática realizada em Centros de Formação de Condutores (CFCs) credenciados continua sendo exigência legal expressa no Código de Trânsito Brasileiro (Lei nº 9.503/1997) e nas resoluções vigentes do Conselho Nacional de Trânsito (Contran).

### Por que a formação profissional é indispensável?
A formação de motoristas não se resume a aprender a movimentar um veículo mecânico. Ela abrange:
- Conhecimento aprofundado da legislação de trânsito brasileira;
- Noções cruciais de primeiros socorros e mecânica preventiva;
- Consciência de direção defensiva e proteção aos pedestres e ciclistas;
- Ética e convivência compartilhada no espaço público.

A Autoescola Itamarati reforça seu compromisso com a formação séria, segura e transparente de novos motoristas.`,
      coverImage: '/images/insta/insta-01.jpg',
      category: 'Legislação & Fatos',
      author: 'Equipe Pedagógica Itamarati',
      status: 'publicado',
      publishedAt: '2026-01-20',
      updatedAt: '2026-01-20',
      isFeaturedHome: true,
      seoTitle: 'Aulas em Autoescola São Obrigatórias? Entenda o Esclarecimento Oficial',
      seoDescription: 'Governo esclarece notícias falsas sobre o fim das autoescolas. Entenda as exigências legais do CTB.',
      sourceUrl: 'https://www.gov.br/secom/pt-br/fatos/brasil-contra-fake/noticias/2024/aulas-em-autoescolas-sao-obrigatorias-para-obtencao-da-carteira-de-motorista-1',
    },
    {
      id: 'news-2',
      slug: 'novas-regras-renovacao-cnh-prazos-validade',
      title: 'Prazos de Validade da CNH: O que Mudou na Renovação',
      summary: 'Entenda os critérios de validade do exame de aptidão física e mental de acordo com a faixa etária do condutor.',
      content: `Com as atualizações do Código de Trânsito Brasileiro, os prazos de validade do exame de aptidão física e mental para renovação da CNH foram ajustados conforme a idade do condutor:

- **Condutores com menos de 50 anos de idade:** exame válido por até 10 anos;
- **Condutores com idade igual ou superior a 50 anos e inferior a 70 anos:** exame válido por até 5 anos;
- **Condutores com 70 anos de idade ou mais:** exame válido por até 3 anos.

> **Importante:** O médico perito examinador pode fixar prazo menor caso identifique condições clínicas específicas.

### Dica para condutores profissionais
Condutores com CNH nas categorias C, D ou E continuam sujeitos à obrigatoriedade do exame toxicológico periódico com janela de detecção mínima de 90 dias a cada 2 anos e meio.

A equipe da Autoescola Itamarati está à disposição para auxiliar você no agendamento e trâmites de renovação.`,
      coverImage: '/images/insta/insta-06.jpg',
      category: 'Dicas & Procedimentos',
      author: 'Atendimento Itamarati',
      status: 'publicado',
      publishedAt: '2026-02-10',
      updatedAt: '2026-02-10',
      isFeaturedHome: true,
      seoTitle: 'Prazos de Renovação de CNH Atualizados: Entenda por Idade',
      seoDescription: 'Confira os prazos oficiais de renovação da Carteira Nacional de Habilitação conforme a idade do condutor.',
      sourceUrl: 'https://www.detran.sp.gov.br/',
    },
    {
      id: 'news-3',
      slug: 'como-vencer-o-nervosismo-no-exame-pratico',
      title: 'Como Vencer a Ansiedade no Dia do Exame Prático de Direção',
      summary: 'Dicas práticas preparadas pelos nossos instrutores para manter a calma e mostrar tudo o que você aprendeu nas aulas.',
      content: `O exame prático é o momento mais aguardado do processo de habilitação. É natural sentir um 'frio na barriga', mas o nervosismo excessivo não precisa atrapalhar o seu desempenho.

### 1. Durma bem na noite anterior
O cansaço físico reduz os reflexos e a capacidade de concentração. Evite bebidas energéticas em excesso antes do exame.

### 2. Chegue com antecedência e respire fundo
Chegar correndo aumenta a frequência cardíaca e a sensação de urgência. Planeje chegar com tempo hábil para se ambientar e tomar uma água.

### 3. Ajuste banco, retrovisores e cinto sem pressa
Este é o seu ritual de partida. Não tenha vergonha de levar 30 segundos adicionais para garantir que a postura e os espelhos estão na posição perfeita para você.

### 4. Lembre-se: o examinador apenas avalia o que você já treinou
Você completou a carga horária e foi liberado pelo seu instrutor porque demonstrou capacidade técnica. O examinador não quer prejudicá-lo, apenas conferir se você executa os comandos com calma e segurança.

A confiança se constrói aula após aula. A equipe Itamarati torce por cada um dos seus alunos!`,
      coverImage: '/images/insta/insta-04.jpg',
      category: 'Dicas para Alunos',
      author: 'Coordenação de Trânsito Itamarati',
      status: 'publicado',
      publishedAt: '2026-03-05',
      updatedAt: '2026-03-05',
      isFeaturedHome: true,
      seoTitle: 'Dicas Para Vencer o Nervosismo no Exame de Direção | Autoescola Itamarati',
      seoDescription: 'Conselhos práticos de instrutores para controlar a ansiedade e passar no exame prático do DETRAN.',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      author: 'Rafael Onofre',
      category: 'Categoria A / B',
      text: 'Tirei minha primeira CNH com eles e hj por graça de Deus adicionei outra categoria com eles também. Recomendo demais não tem dor de cabeça!',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-2',
      author: 'Gustavo Alves',
      category: 'Categoria A / B',
      text: 'Hoje é um dia muito especial para mim. Após meses de dedicação, aprendizado e um pouco de ansiedade, finalmente conquistei minha carteira de habilitação. Gostaria de agradecer aos meus instrutores, que com paciência e experiência me guiaram por cada passo desse caminho.',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-3',
      author: 'Fernanda Melo',
      category: 'Categoria A / B',
      text: 'Quero agradecer a todos vocês pela recepção e atendimento exclusivo que tiveram conosco. Pela qualidade de atendimento, comprometimento e agilidade, sou muito grata por essa conquista!',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-4',
      author: 'Lilian Rodrigues',
      category: 'Categoria A / B',
      text: 'Quero deixar aqui minha gratidão a todos da Autoescola Itamarati. Desde os instrutores que são muito pacientes e focam realmente na sua dificuldade, como também a recepção em especial a Beth. Sem dor de cabeça, sem burocracia e todos muito empenhados a te ajudar!',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-5',
      author: 'Jhennifer Tomas',
      category: 'Categoria A',
      text: 'A melhor autoescola de Guaianases! Agendamentos super rápidos e ótimos profissionais. Meus agradecimentos ao instrutor Bruno Lima, um excelente profissional, paciente e totalmente dedicado ao que faz. Sou grata pelos ensinamentos!',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-6',
      author: 'Sara Pinheiro',
      category: 'Categoria A',
      text: 'Autoescola maravilhosa! Consegui fazer tudo super rápido e foi muito tranquilo. Sou muito grata a todos, principalmente ao instrutor Vando que me ajudou muito e consegui passar de primeira! Indico demais.',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-7',
      author: 'Danilza Fernandes',
      category: 'Categoria A',
      text: 'Foi uma experiência incrível tirar a minha habilitação com a Itamarati. Quero agradecer a todos os funcionários desde o atendimento e principalmente ao instrutor Roberto que me deu as aulas e todas as instruções, me ensinou do zero com paciência e dedicação!',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-8',
      author: 'Daniel Castro',
      category: 'Categoria A / B',
      text: 'Estou muito satisfeito com a Autoescola Itamarati! Eu não sabia dirigir, cheguei na autoescola com muito medo. E todos os instrutores passam confiança e tranquilidade para uma direção segura e com responsabilidade.',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
    {
      id: 'test-9',
      author: 'Aline Vieira',
      category: 'Categoria B',
      text: 'Melhor autoescola sem dúvidas, sem enrolação! Bete e Sr. Nelson super atenciosos e prontos para ajudar, os instrutores fora da curva, profissionais com selo de excelência no que fazem. Vando, Carlos, Roberto e Bruno são excelentes!',
      rating: 5,
      active: true,
      date: 'Avaliação confirmada',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      topic: 'Primeira Habilitação',
      question: 'Quais são os documentos necessários para dar início à primeira CNH?',
      answer: 'Para se matricular, você precisa de um documento de identificação original com foto (RG, passaporte ou carteira de trabalho), CPF e um comprovante recente de residência (com emissão dos últimos 3 meses) em seu nome ou de pais/cônjuge.',
      order: 1,
      active: true,
    },
    {
      id: 'faq-2',
      topic: 'Primeira Habilitação',
      question: 'Qual é o prazo médio do processo no DETRAN?',
      answer: 'O processo formal tem validade de até 12 meses a contar da data de abertura no órgão de trânsito. A conclusão das etapas costuma depender da sua disponibilidade de agenda para exames e aulas práticas.',
      order: 2,
      active: true,
    },
    {
      id: 'faq-3',
      topic: 'Aulas & Simulador',
      question: 'Como funciona a etapa de simulador de direção?',
      answer: 'O simulador permite vivenciar situações cotidianas de trânsito, como arrancadas em subida, trocas de marcha e frenagens seguras, em ambiente virtual e controlado antes de ir para as ruas com o instrutor.',
      order: 3,
      active: true,
    },
    {
      id: 'faq-4',
      topic: 'Cursos Profissionalizantes',
      question: 'Os cursos como TCP e MOPP são homologados pela Senatran?',
      answer: 'Sim! Todos os nossos cursos profissionalizantes são devidamente homologados pela Secretaria Nacional de Trânsito (Senatran), integrados aos registros oficiais e válidos em todo o território nacional.',
      order: 4,
      active: true,
    },
    {
      id: 'faq-5',
      topic: 'Cursos Profissionalizantes',
      question: 'Posso fazer os cursos especializados totalmente pela internet?',
      answer: 'Sim, a modalidade à distância (EAD) é 100% online, permitindo que você assista às aulas pelo celular, tablet ou computador no horário que for mais conveniente para sua rotina de trabalho.',
      order: 5,
      active: true,
    },
    {
      id: 'faq-6',
      topic: 'Condições & Atendimento',
      question: 'Quais formas de pagamento são aceitas pela autoescola?',
      answer: 'Aceitamos cartão de crédito (com possibilidade de parcelamento), débito, Pix e opções sob consulta. Fale diretamente com nossa recepção para encontrar a condição mais confortável para você.',
      order: 6,
      active: true,
    },
    {
      id: 'faq-7',
      topic: 'Localização & Horários',
      question: 'Onde a Autoescola Itamarati está localizada?',
      answer: 'Estamos em Guaianases / Lajeado, na Rua Saturnino Pereira, nº 46 (esquina com a Rua Joaquim Leite), em São Paulo - SP. Atendemos de segunda a sexta das 08h às 19h e aos sábados das 08h às 13h.',
      order: 7,
      active: true,
    },
  ],
  adminCredentials: {
    username: 'admin',
    passwordHash: 'itamarati2026', // Can be updated in admin panel
  },
};

// Safe atomic read
function loadDatabase(): DatabaseSchema {
  if (dbCache) {
    return dbCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeedData, null, 2), 'utf-8');
      dbCache = JSON.parse(JSON.stringify(initialSeedData));
      return dbCache!;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(fileContent);
    dbCache = { ...initialSeedData, ...parsed };
    return dbCache!;
  } catch (error) {
    console.error('Error loading db.json, falling back to seed data:', error);
    dbCache = JSON.parse(JSON.stringify(initialSeedData));
    return dbCache!;
  }
}

// Safe atomic write
function saveDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    const tempFile = path.join(DATA_DIR, `db.tmp.${Date.now()}`);
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    dbCache = data;
    return true;
  } catch (error) {
    console.error('Error saving db.json:', error);
    return false;
  }
}

export const db = {
  // HERO
  getHeroConfig: (): HeroConfig => {
    return loadDatabase().hero;
  },
  updateHeroConfig: (config: Partial<HeroConfig>): HeroConfig => {
    const current = loadDatabase();
    current.hero = { ...current.hero, ...config };
    saveDatabase(current);
    return current.hero;
  },

  // SETTINGS
  getSettings: (): SiteSettings => {
    return loadDatabase().settings;
  },
  updateSettings: (settings: Partial<SiteSettings>): SiteSettings => {
    const current = loadDatabase();
    current.settings = { ...current.settings, ...settings };
    saveDatabase(current);
    return current.settings;
  },

  // SERVICES
  getServices: (onlyActive = true): Service[] => {
    const all = loadDatabase().services;
    return onlyActive ? all.filter((s) => s.active) : all;
  },
  getServiceBySlug: (slug: string): Service | undefined => {
    return loadDatabase().services.find((s) => s.slug === slug);
  },
  saveService: (service: Service): Service => {
    const current = loadDatabase();
    const index = current.services.findIndex((s) => s.id === service.id);
    if (index >= 0) {
      current.services[index] = service;
    } else {
      current.services.push(service);
    }
    saveDatabase(current);
    return service;
  },
  deleteService: (id: string): boolean => {
    const current = loadDatabase();
    current.services = current.services.filter((s) => s.id !== id);
    return saveDatabase(current);
  },

  // COURSES
  getCourses: (onlyActive = true): Course[] => {
    const all = loadDatabase().courses;
    return onlyActive ? all.filter((c) => c.active) : all;
  },
  getCourseBySlug: (slug: string): Course | undefined => {
    return loadDatabase().courses.find((c) => c.slug === slug);
  },
  saveCourse: (course: Course): Course => {
    const current = loadDatabase();
    const index = current.courses.findIndex((c) => c.id === course.id);
    if (index >= 0) {
      current.courses[index] = course;
    } else {
      current.courses.push(course);
    }
    saveDatabase(current);
    return course;
  },
  deleteCourse: (id: string): boolean => {
    const current = loadDatabase();
    current.courses = current.courses.filter((c) => c.id !== id);
    return saveDatabase(current);
  },

  // GALLERY
  // NOTE: Strict privacy rule: if onlyAuthorized is true (public site), only items with autorizadoUsoImagem === true are returned!
  getGalleryItems: (options?: {
    onlyAuthorized?: boolean;
    onlyFeaturedHome?: boolean;
    category?: string;
  }): GalleryItem[] => {
    let items = loadDatabase().gallery;
    if (options?.onlyAuthorized) {
      items = items.filter((item) => item.autorizadoUsoImagem === true);
    }
    if (options?.onlyFeaturedHome) {
      items = items.filter((item) => item.isFeaturedHome);
    }
    if (options?.category && options.category !== 'todos') {
      items = items.filter((item) => item.category === options.category);
    }
    return items.sort((a, b) => a.order - b.order);
  },
  saveGalleryItem: (item: GalleryItem): GalleryItem => {
    const current = loadDatabase();
    const index = current.gallery.findIndex((g) => g.id === item.id);
    if (index >= 0) {
      current.gallery[index] = item;
    } else {
      current.gallery.push(item);
    }
    saveDatabase(current);
    return item;
  },
  deleteGalleryItem: (id: string): boolean => {
    const current = loadDatabase();
    current.gallery = current.gallery.filter((g) => g.id !== id);
    return saveDatabase(current);
  },

  // NEWS CMS
  getNewsArticles: (options?: {
    onlyPublished?: boolean;
    onlyFeaturedHome?: boolean;
    category?: string;
    search?: string;
  }): NewsArticle[] => {
    let articles = loadDatabase().news;
    if (options?.onlyPublished) {
      articles = articles.filter((a) => a.status === 'publicado');
    }
    if (options?.onlyFeaturedHome) {
      articles = articles.filter((a) => a.isFeaturedHome);
    }
    if (options?.category && options.category !== 'todas') {
      articles = articles.filter((a) => a.category === options.category);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
      );
    }
    return articles.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  },
  getNewsArticleBySlug: (slug: string): NewsArticle | undefined => {
    return loadDatabase().news.find((a) => a.slug === slug);
  },
  saveNewsArticle: (article: NewsArticle): NewsArticle => {
    const current = loadDatabase();
    const index = current.news.findIndex((n) => n.id === article.id);
    if (index >= 0) {
      current.news[index] = article;
    } else {
      current.news.push(article);
    }
    saveDatabase(current);
    return article;
  },
  deleteNewsArticle: (id: string): boolean => {
    const current = loadDatabase();
    current.news = current.news.filter((n) => n.id !== id);
    return saveDatabase(current);
  },

  // TESTIMONIALS
  getTestimonials: (onlyActive = true): Testimonial[] => {
    const all = loadDatabase().testimonials;
    return onlyActive ? all.filter((t) => t.active) : all;
  },
  saveTestimonial: (testimonial: Testimonial): Testimonial => {
    const current = loadDatabase();
    const index = current.testimonials.findIndex((t) => t.id === testimonial.id);
    if (index >= 0) {
      current.testimonials[index] = testimonial;
    } else {
      current.testimonials.push(testimonial);
    }
    saveDatabase(current);
    return testimonial;
  },
  deleteTestimonial: (id: string): boolean => {
    const current = loadDatabase();
    current.testimonials = current.testimonials.filter((t) => t.id !== id);
    return saveDatabase(current);
  },

  // FAQS
  getFaqs: (onlyActive = true): FaqItem[] => {
    const all = loadDatabase().faqs;
    const filtered = onlyActive ? all.filter((f) => f.active) : all;
    return filtered.sort((a, b) => a.order - b.order);
  },
  saveFaq: (faq: FaqItem): FaqItem => {
    const current = loadDatabase();
    const index = current.faqs.findIndex((f) => f.id === faq.id);
    if (index >= 0) {
      current.faqs[index] = faq;
    } else {
      current.faqs.push(faq);
    }
    saveDatabase(current);
    return faq;
  },
  deleteFaq: (id: string): boolean => {
    const current = loadDatabase();
    current.faqs = current.faqs.filter((f) => f.id !== id);
    return saveDatabase(current);
  },

  // ADMIN AUTH
  verifyAdminPassword: (password: string): boolean => {
    const current = loadDatabase();
    return current.adminCredentials.passwordHash === password;
  },
  changeAdminPassword: (newPassword: string): boolean => {
    const current = loadDatabase();
    current.adminCredentials.passwordHash = newPassword;
    return saveDatabase(current);
  },
};
