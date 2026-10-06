import React from 'react';
import { db } from '@/lib/db';
import ContactForm from '@/components/ContactForm';
import GoogleMapOnDemand from '@/components/GoogleMapOnDemand';
import { MapPin, Phone, MessageCircle, Mail, Clock, Navigation } from 'lucide-react';

export const metadata = {
  title: 'Fale Conosco | Autoescola Itamarati Guaianases',
  description:
    'Entre em contato com a Autoescola Itamarati. Endereço na R. Saturnino Pereira, 46 em Guaianases, telefone (11) 2554-2278 e atendimento ágil pelo WhatsApp.',
};

export const revalidate = 0;

export default function ContatoPage() {
  const settings = db.getSettings();

  const waUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappClean}&text=${encodeURIComponent(
    'Olá! Vim pela página de contato do site e gostaria de falar com a equipe de atendimento da Itamarati.'
  )}`;

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Canais de Atendimento
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Fale com a Autoescola Itamarati
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Tire suas dúvidas, consulte horários e venha nos visitar em Guaianases. Estamos à disposição para ajudar você a conquistar sua carteira.
        </p>
      </section>

      {/* Main Grid: Form + Contacts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200/90 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Nossos Contatos Oficiais</h2>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Endereço Confirmado</strong>
                    <span>{settings.address}</span>
                    <span className="block text-slate-500">{settings.district} · {settings.city} - {settings.state}</span>
                    <span className="block text-slate-500">CEP {settings.cep}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">WhatsApp Oficial</strong>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold hover:underline">
                      {settings.whatsapp}
                    </a>
                    <span className="block text-xs text-slate-500">Atendimento rápido com a recepção</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Telefone Fixo</strong>
                    <a href={`tel:${settings.phoneClean}`} className="text-slate-800 font-semibold hover:underline">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">E-mail</strong>
                    <a href={`mailto:${settings.email}`} className="text-slate-800 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pt-2 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900">Horários de Atendimento</strong>
                    <span>{settings.openingHoursWeekday}</span>
                    <span className="block">{settings.openingHoursSaturday}</span>
                    <span className="block text-slate-500">{settings.openingHoursSunday}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-accent-400" />
                  <span>Abrir rotas no GPS (Google Maps)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Envie uma mensagem para a nossa equipe
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Preencha os campos abaixo e entraremos em contato com você pelo WhatsApp ou telefone.
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Localização no Mapa
          </h2>
          <p className="text-sm text-slate-600">
            {settings.address}, {settings.district}, São Paulo - SP
          </p>
        </div>

        <GoogleMapOnDemand
          embedUrl={settings.googleMapsEmbedUrl}
          directUrl={settings.googleMapsUrl}
          address={`${settings.address}, ${settings.district}, São Paulo - SP`}
        />
      </section>
    </div>
  );
}
