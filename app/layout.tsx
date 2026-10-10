import type { Metadata } from 'next';
import './globals.css';
import { db } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Autoescola Itamarati | CNH, Primeira Habilitação e Cursos em Guaianases',
  description:
    'Sua próxima conquista começa aqui. Há 59 anos formando condutores conscientes em Guaianases e Lajeado, São Paulo. CNH categorias A, B, AB, adição, renovação e cursos profissionalizantes homologados Senatran.',
  keywords: [
    'Autoescola Itamarati',
    'Autoescola em Guaianases',
    'Primeira Habilitação',
    'CNH Carro e Moto',
    'Adição de categoria',
    'Renovação de CNH SP',
    'Curso TCP Senatran',
    'Curso MOPP Senatran',
    'Autoescola Lajeado',
    'Simulador de Direção',
  ],
  authors: [{ name: 'Autoescola Itamarati' }],
  metadataBase: new URL('https://autoescolaitamarati.com.br'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://autoescolaitamarati.com.br',
    title: 'Autoescola Itamarati | Sua Próxima Conquista Começa Aqui',
    description:
      'Aulas práticas e curso teórico CFC somente online, com didática acolhedora, frota moderna e cursos Senatran em Guaianases, São Paulo.',
    siteName: 'Autoescola Itamarati',
    images: [
      {
        url: '/images/hero-facade.png',
        width: 335,
        height: 597,
        alt: 'Autoescola Itamarati - Formação de condutores e cursos profissionalizantes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Autoescola Itamarati | CNH e Cursos Homologados',
    description:
      '59 anos de tradição em Guaianases, São Paulo. Acolhimento, respeito e formação para todas as idades.',
    images: ['/images/hero-facade.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = db.getSettings();

  // Schema.org LocalBusiness structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DrivingSchool',
    name: settings.name,
    image: 'https://autoescolaitamarati.com.br/images/hero-facade.png',
    '@id': 'https://autoescolaitamarati.com.br/#drivingschool',
    url: 'https://autoescolaitamarati.com.br',
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: settings.city,
      addressRegion: settings.state,
      postalCode: settings.cep,
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.544577,
      longitude: -46.411408,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '13:00',
      },
    ],
    priceRange: '$$',
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-800 antialiased selection:bg-accent-400 selection:text-ink">
        <Navbar phone={settings.phone} whatsappClean={settings.whatsappClean} />
        <main className="flex-grow">{children}</main>
        <Footer settings={settings} />
        <FloatingWhatsApp whatsappClean={settings.whatsappClean} />
      </body>
    </html>
  );
}
