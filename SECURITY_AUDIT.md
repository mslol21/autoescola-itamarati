# Auditoria técnica — Autoescola Itamarati

Data: 10/10/2026. Base: commit e517865. Escopo: erros, segurança, privacidade e persistência; identidade visual, CSS e textos comerciais preservados.

## Resultado e limite de verificação

Correções preparadas na branch `fix/security-privacy-persistence`. Não aplicadas na produção.
O projeto Supabase `eoipvmwhbcchxibgkgjy` não está disponível nas contas conectadas.
A API da Vercel retornou 403 para as variáveis do projeto `autoescola-itamarati`.
A conexão PostgreSQL direta também não ficou acessível neste ambiente.
Assim, não foram lidos registros pessoais, alteradas tabelas remotas, rotacionadas
credenciais reais nem verificado o deploy de produção. Não há conclusão de ausência
de invasão: não houve acesso aos logs reais para investigar incidentes.

## Achados confirmados no código e correções

| Prioridade | Achado | Correção preparada |
| --- | --- | --- |
| Crítica | Senha de conexão PostgreSQL e senha administrativa em arquivos versionados; segredo de sessão com fallback fixo | Credenciais removidas do código e dos dados iniciais; configuração somente no servidor; bootstrap exige senha nova e armazena scrypt com salt |
| Crítica | Cookie administrativo assinado com segredo conhecido; papel e formato insuficientemente validados; logout não revogava token | Sessão opaca aleatória, hash armazenado no banco, validade de oito horas, revogação no logout e invalidação ao trocar senha |
| Alta | JSON local como fonte de verdade e sincronização Supabase sem aguardar/conferir resultado | Banco remoto é a fonte de leitura e escrita; erros reais propagados; sem fallback silencioso quando banco configurado falha |
| Alta | Rotas administrativas GET públicas retornavam conteúdo inativo; validação limitada nos POST/PUT | Todas as rotas do painel exigem sessão; esquemas validam tipos, tamanhos, URLs e enums; verificação de origem nas mutações |
| Alta | Migração anterior não configurava RLS nem restringia tabelas privadas | Migração ativa RLS e revoga acesso anon/authenticated a conteúdo, credenciais, sessões e contatos; servidor autorizado usa chave privilegiada |
| Alta | Fotos não autorizadas podiam continuar acessíveis diretamente; cache de um ano | Storage privado; endpoint confere publicação/autorização por imagem; resposta sem cache persistente; fotos históricas retiradas de `/public` |
| Alta | Formulário podia confirmar sucesso com erro de banco e registrar dados pessoais em logs | Confirmação só após insert efetivo; logs sem payloads, telefone, e-mail ou nome; limitação compartilhada de requisições |
| Alta | Arquivos em disco local sujeito a perda em ambiente serverless | Upload persistente no Storage; imagens decodificadas e recodificadas, com limite de pixels/tamanho e remoção de EXIF/GPS |
| Média | Limitação de login apenas em memória e baseada em cabeçalho manipulável | Contador atômico no Postgres; chaves de IP por HMAC, cabeçalho de IP apenas da plataforma, limite adicional global |
| Média | URLs editáveis e JSON-LD permitiam conteúdo perigoso | URLs com protocolos restritos, validação do host do mapa, escape de `<` no JSON-LD e renderização textual do conteúdo editorial |
| Média | Galeria nova vinha com autorização marcada e notícia nova publicada | Formulários iniciam sem autorização e em rascunho; publicação continua disponível mediante ação explícita |
| Média | Dependências de produção com alertas de segurança | Atualização do Next.js, processamento de imagem e dependências transitivas; auditoria npm executada após instalação |

A ausência de RLS foi constatada no script versionado, não no estado real do banco.
A migração não contém exclusão de conteúdo editorial; remove apenas políticas antigas
dessas tabelas e sessões administrativas inválidas/expiradas. Preserva os cadastros e
transporta as correções já aprovadas de CFC online, 59 anos, 80 mil alunos e retirada
do serviço PCD. Execute com backup e validação no projeto correto.

## Testes

- Build de produção e verificação de tipos.
- Senhas com salt, credenciais inválidas e texto puro, URLs perigosas, tipos e limites.
- Execução real do SQL em PostgreSQL local via PGlite, com papéis anon/authenticated/service_role: acesso negado a tabelas privadas, políticas restritivas do bucket, contador atômico e reaplicação sem perda de conteúdo.
- Servidor Next.js real com transporte Supabase simulado: páginas públicas, APIs administrativas, origem externa, cookie forjado, login, persistência após reinício, falhas de gravação, logs sem dados pessoais, upload privado, revogação de fotos, troca de senha e logout.

Esses testes não substituem testes contra o Supabase e o Storage reais. A simulação de
transporte verifica a aplicação; o teste SQL valida a migração em um Postgres local.
Não foi realizada inspeção visual em navegador nesta auditoria; alterações de layout
não fazem parte do escopo.

## Ações necessárias para ativação

1. Conectar a conta Supabase que contém `eoipvmwhbcchxibgkgjy` e autorizar a Vercel no time correto.
2. Rotacionar imediatamente a senha PostgreSQL exposta e a senha do painel. Remover o texto do commit atual não apaga o histórico público. Revisar acessos e logs do projeto real.
3. Fazer backup, revisar/aplicar a migração e configurar as variáveis da `.env.example`. Confirmar que o bucket permanece privado e que anon/authenticated não leem contatos ou credenciais.
4. Migrar qualquer upload antigo existente apenas em `data/uploads` para o bucket privado, preservando os nomes usados no conteúdo. Não havia arquivos desse diretório no checkout auditado.
5. Validar em homologação e então integrar a branch e publicar. As sessões antigas serão invalidadas pela mudança de autenticação.

## Limites de privacidade

Fotos que já foram copiadas, indexadas ou publicadas no histórico do Git/serviços externos
não podem ser recolhidas pelo controle do site. A revogação bloqueia novos acessos pelo
endpoint protegido. Fotos externas mantêm as condições de acesso do provedor original.
Google Fonts e o mapa sob demanda são integrações existentes: podem receber IP e
metadados da conexão do visitante. Não foi acrescentado pixel ou ferramenta de rastreamento.
O prazo de retenção dos contatos precisa ser definido pela empresa; esta atualização
não apaga contatos existentes nem presume um prazo sem autorização.

## Auditoria final de dependências

`npm audit --omit=dev`: **0 vulnerabilidades reportadas** nas dependências de produção
com o lockfile verificado nesta auditoria. Isso não equivale a garantia de segurança.
A auditoria completa ainda aponta **5 alertas altos na cadeia de desenvolvimento
Tailwind 3 → chokidar/micromatch/fast-glob → braces**. O registro consultado não oferece
versão corrigida de braces na série usada; a correção automática propõe migrar para
Tailwind 4, o que exige revisão visual fora do escopo solicitado. Esses pacotes processam
os padrões locais do build, não entradas dos formulários do site. Permanecem documentados,
sem afirmar que foram corrigidos nem promover uma migração visual não validada.

Resultado final dos testes automatizados: 6 testes de unidade/SQL e 17 verificações de
integração. Build de produção aprovado. A integração usa servidor Next real e backend
Supabase simulado; banco real e deploy continuam pendentes de acesso.
