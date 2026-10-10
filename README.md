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

O painel administrativo está localizado na rota `/admin` e opera com autenticação real e persistência no Supabase.

### Credenciais Iniciais
- **Usuário:** `admin`
- **Senha:** `[senha definida no ambiente]`
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
   - Criação e edição com validação; conteúdo renderizado como texto pelo React, sem executar HTML;
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

- **Framework:** Next.js 15.5.27 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS (paleta personalizada Azul Itamarati + Âmbar Vibrante)
- **Ícones:** Lucide React
- **Armazenamento:** Supabase como fonte de verdade. `data/db.json` serve apenas como conteúdo inicial e prévia local somente de leitura
- **Uploads:** Supabase Storage privado, validação e recodificação de imagens, remoção de EXIF/GPS e autorização de leitura por imagem

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
- Senha: `[senha definida no ambiente]`


## Segurança e configuração do ambiente

Leia [SECURITY_AUDIT.md](SECURITY_AUDIT.md) antes de publicar esta atualização.
As variáveis de servidor necessárias estão em `.env.example`. Sem configuração,
o site permite somente uma prévia com conteúdo inicial; autenticação e gravação
não retornam sucesso fictício. Nunca use chaves de produção em testes locais.

1. Substitua as credenciais expostas no histórico do repositório.
2. Faça backup do banco e dos uploads atuais.
3. Configure `DATABASE_URL` com certificado válido e uma senha administrativa nova
   em `ADMIN_BOOTSTRAP_PASSWORD` (12 a 128 caracteres).
4. Revise a migração em `supabase/migrations/`. Execute
   `node --env-file=.env.local scripts/migrate-supabase.js` contra o projeto correto.
   O script usa uma transação, preserva conteúdo existente e não redefine senhas
   já protegidas por scrypt. Não reutilize a senha antiga exposta.
5. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_ORIGIN` e
   `RATE_LIMIT_SECRET` no servidor. Nenhuma delas deve ter prefixo `NEXT_PUBLIC_`.
6. Execute `npm test`, `npm run build` e `npm run test:integration`.
7. Valide login, uma gravação e sua leitura após reinício, upload e revogação de
   autorização no ambiente de homologação antes de publicar.

Os scripts antigos de fotos editam o conteúdo inicial local, não o banco de produção.
Fotos novas são privadas até serem vinculadas a conteúdo publicado/autorizado.
Os arquivos históricos locais são servidos pelo mesmo controle de autorização.
