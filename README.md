# Autoescola Itamarati — Plataforma Web Completa & Painel Administrativo

Novo site contemporâneo e painel administrativo da **Autoescola Itamarati** (Guaianases / Lajeado, São Paulo). 

Desenvolvido sob o conceito criativo: **“Sua próxima conquista começa aqui”**, transmitindo liberdade, independência, confiança e novas possibilidades, com visual jovem, acolhedor e profissional.

---

## 🚗 1. O que foi Implementado

### Site Público (Front-end Moderno & Responsivo)
- **Cabeçalho com Navegação Rápida:** Logo moderno, navegação enxuta (*Seu objetivo*, *Nossa experiência*, *Serviços*, *Cursos Senatran*, *Galeria*, *Novidades*, *Contato*) e botão direto para WhatsApp.
- **Hero Editorial de Alto Impacto:** Identificação clara de autoescola com tipografia marcante, foto de condutor em alta resolução e botões *“Quero começar agora”* e *“Conhecer a Itamarati”*. Sem carrosséis automáticos clichês.
- **Escolha seu Próximo Passo (Sem Cadastro):** Seletor interativo em 4 abas (*Quero minha 1ª habilitação*, *Quero adicionar categoria*, *Já tenho CNH e busco outro serviço*, *Quero conhecer os cursos*), com resumo objetivo e encaminhamento contextualizado ao WhatsApp ou página interna correspondente.
- **A Experiência Itamarati:** Apresentação dos diferenciais confirmados (atendimento humanizado para todas as idades, didática paciente, simulador de direção, frota moderna com ar e direção assistida, e horários flexíveis).
- **Conquistas que Merecem Aparecer:** Mosaico de fotos reais de alunos habilitados, alimentado dinamicamente pelo painel administrativo com checagem de autorização de imagem.
- **Conheça por Dentro:** Apresentação fotográfica da infraestrutura física, simulador e pista de motocicletas em composição visual exclusiva.
- **Como Começar em 3 Passos:** Explicação transparente do primeiro contato (*Conte seu objetivo*, *Receba orientação clara*, *Combine os próximos passos*).
- **Depoimentos Reais:** Avaliações autênticas de alunos com nomes e categorias confirmadas (Rafael Onofre, Gustavo Alves, Fernanda Melo, Lilian Rodrigues, etc.), sem selos ou notas fictícias.
- **Cursos Homologados Senatran:** Catálogo com cards interativos e modal completo com ementas, carga horária e requisitos (TCP, MOPP, Emergência, Escolar, Cargas Indivisíveis, APH, NR35 e NR20).
- **Novidades e Dicas de Trânsito:** Destaque para matéria principal e publicações secundárias com fonte oficial governamental/Senatran indicada.
- **Dúvidas Frequentes (FAQ):** Acordeões acessíveis divididos por tópicos (Primeira CNH, Cursos, Agendamento, Pagamento).
- **Localização e Contato:** Endereço confirmado na R. Saturnino Pereira, 46 (Guaianases), horários de atendimento, telefones e mapa interativo sob demanda.
- **Páginas Internas Dedicadas:**
  - `/sobre` — 59 anos de tradição, mais de 80.000 habilitados e princípios éticos;
  - `/servicos` — Detalhamento de Primeira Habilitação, Adição de Categoria, Renovação, Reciclagem, Habilitação Acolhedora para Idosos;
  - `/cursos` — Cursos profissionais à distância homologados Senatran;
  - `/galeria` — Galeria fotográfica completa com filtros por categoria e lightbox com navegação por teclado (Esc, setas);
  - `/noticias` e `/noticias/[slug]` — Blog completo com busca, filtros, páginas individuais e links de fontes oficiais;
  - `/contato` — Formulário de contato funcional com validação e retorno imediato;
  - `/politica-de-privacidade` — Conformidade estrita com a LGPD;
  - `/_not-found` — Página 404 personalizada.

---

## 🔐 2. Painel Administrativo Completo (`/admin`)

O painel administrativo está localizado na rota `/admin` e opera com autenticação real e persistência atômica no servidor.

### Credenciais Iniciais
- **Usuário:** `admin`
- **Senha:** `itamarati2026`
*(A senha pode ser alterada diretamente na aba de Configurações do painel).*

### Funcionalidades do Painel:
1. **Hero & Página Inicial:** Edite títulos, subtítulo, frases de destaque, botões e faça upload da foto principal do Hero.
2. **Serviços & Habilitação:** Crie, edite, ative/desative e exclua serviços com descrição para quem é indicado, requisitos e etapas.
3. **Cursos Profissionalizantes Senatran:** Gerencie cursos, cargas horárias, modalidade online, ementa e destaque na página inicial.
4. **Galeria de Fotos com Gestão de Privacidade:**
   - Upload de fotos para os álbuns (*Conquistas*, *Aulas*, *Estrutura*, *Equipe*, *Eventos*);
   - **Controle de Autorização de Uso de Imagem (LGPD):** Fotos marcadas como não autorizadas são **automaticamente bloqueadas do site público** e permanecem visíveis apenas no painel administrativo;
   - Definição de fotos que aparecem no mosaico da Home.
5. **CMS de Notícias & Blog:**
   - Criação e edição com sanitização contra scripts maliciosos;
   - Status (*Rascunho*, *Publicado*, *Arquivado*); rascunhos nunca aparecem publicamente;
   - Modal de pré-visualização antes da publicação;
   - Inserção de link da fonte externa governamental/oficial;
   - Metadados de SEO (Título e descrição SEO personalizados).
6. **Depoimentos Reais:** Adicione e edite relatos autênticos de alunos com categorias.
7. **Perguntas Frequentes (FAQ):** Organize dúvidas por assunto com ordenação.
8. **Contatos, Endereços e Horários:** Atualize telefone fixo, número do WhatsApp, endereço, horários de segunda a sábado e redes sociais sem mexer no código.
9. **Alteração de Senha:** Troca de senha da equipe com confirmação.

---

## 🛠️ 3. Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (paleta personalizada Azul Itamarati + Âmbar Vibrante)
- **Ícones:** Lucide React
- **Armazenamento:** Motor de banco de dados com gravação atômica (`data/db.json`), garantindo persistência sem depender de chaves de nuvem externas indisponíveis
- **Uploads:** API nativa com validação de MIME types (JPG, PNG, WebP) e limite de tamanho

---

## 🚀 4. Como Executar o Projeto

### Modo de Produção (Recomendado)
```bash
npm run build
npm run start
```
Acesse em seu navegador: [http://localhost:3000](http://localhost:3000)

### Modo de Desenvolvimento
```bash
npm run dev
```

### Para Acessar a Área da Equipe
Acesse: [http://localhost:3000/admin](http://localhost:3000/admin)
- Usuário: `admin`
- Senha: `itamarati2026`
