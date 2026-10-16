# Correção da persistência da galeria

## Diagnóstico

O código analisado gravava uploads em `data/uploads` e a galeria em `data/db.json`. Esses arquivos locais não são armazenamento persistente na Vercel. O site lia a cópia local da galeria, enquanto a tentativa de sincronização com Supabase não era aguardada e ignorava erros retornados pelo serviço. Assim, o painel podia mostrar sucesso sem persistência e a página pública não recebia os registros.

A consulta pública feita em 16/10/2026 retornou oito fotos já incluídas no projeto, sem URLs de novos uploads. Isso confirma o conteúdo atualmente exibido, mas não permite recuperar ou inventariar arquivos privados que não foram persistidos.

## Alterações

- Fotos enviadas para o bucket privado `itamarati-media` do Supabase; não há novas gravações de uploads no disco local.
- Leitura, gravação e exclusão da galeria diretamente na tabela `public.gallery`, aguardando confirmação do banco e propagando erros.
- Página inicial e galeria consultam a mesma fonte, sem cache de registros; invalidação das páginas após alterações.
- Imagens ainda não publicadas ficam visíveis apenas na sessão administrativa. Retirar a autorização bloqueia a URL da imagem, com respostas sem cache.
- Consentimento desmarcado por padrão, sem alteração das autorizações já existentes no banco.
- Uploads de até 4 MB, margem para o limite de requisição da hospedagem; validação por decodificação, correção da orientação, remoção de EXIF/GPS e conversão para WebP.
- Painel aguarda o upload, preserva mudanças feitas durante o envio, mostra falhas de armazenamento e distingue foto salva de foto publicada.
- A chave de serviço permanece exclusivamente no servidor. Sessões administrativas exigem segredo aleatório configurado, sem a chave pública fixa antiga. Isso é necessário antes de disponibilizar gravações privilegiadas no armazenamento.

## Antes de publicar

Esta branch não deve ser integrada à produção sem preparar o Supabase e as variáveis abaixo. O projeto Supabase configurado no código atual é `eoipvmwhbcchxibgkgjy`; confirmar o projeto efetivo nas variáveis da Vercel, sem divulgar os valores.

1. Obter acesso ao projeto correto da Itamarati e fazer backup dos registros existentes de `public.gallery`. Se houver backups de `data/db.json` e de `data/uploads` do ambiente anterior, preservá-los também.
2. Conferir as fotos existentes no banco, em especial autorizações e URLs. A migração preserva os registros e não importa o arquivo local por cima dos dados existentes. Se a tabela estiver vazia, preparar a importação dos registros reais a partir de um backup revisado.
3. Aplicar `supabase/migrations/20261016182155_gallery_persistent_storage.sql` pelo fluxo de migrações do projeto. Ela cria a tabela se necessário, restringe acesso direto, cria o bucket privado e adiciona um índice de consulta por imagem.
4. Configurar na Vercel, no ambiente de produção: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (ou chave secreta de servidor equivalente nesse campo) e `ADMIN_SESSION_SECRET` aleatório com no mínimo 32 caracteres. Nunca usar prefixo `NEXT_PUBLIC` nas duas chaves. Alterar o segredo encerra sessões anteriores; entrar novamente no painel.
5. Publicar a branch somente após a configuração. Fazer login, enviar uma foto de teste sem dados pessoais, salvar sem autorização e confirmar que fica oculta. Autorizar, conferir galeria e página inicial quando marcada como destaque, atualizar o navegador e testar novamente após novo deploy. Retirar autorização e confirmar que a URL deixa de abrir anonimamente. Excluir o registro de teste.
6. Revisar URLs antigas `/api/media/...`. Arquivos locais que ainda existirem continuam legíveis, mas fotos já perdidas no disco temporário precisarão ser reenviadas a partir dos originais. Não há evidência suficiente para afirmar quais arquivos são recuperáveis.

A autenticação e a persistência de outros módulos continuam com limitações documentadas na revisão de segurança anterior (PR #1); esta correção não substitui aquela revisão. As telas de notícias/hero também usam o endpoint de upload, mas a migração de seus registros locais não faz parte desta alteração.

## Verificação

Executar `npm ci` e `npm run test:gallery`.

O teste inicia o servidor Next de produção real e simula apenas o transporte remoto do Supabase. Verifica upload, retorno de erros, publicação, bloqueio por autorização, exclusão, paginação e persistência após reiniciar o processo do site. O teste SQL usa PostgreSQL local via PGlite para validar preservação dos dados e permissões. Esses testes não equivalem a uma validação na conta Supabase de produção.

## Bloqueio de validação em produção

Em 16/10/2026, a integração Vercel retornou HTTP 403 para o projeto `prj_ipV8J3xezUW2YNv0edEycbNILOIX`, na equipe `team_byUQbkoJOGfs5w1mf2YgrZGf`. Nenhuma das três contas Supabase conectadas listou o projeto `eoipvmwhbcchxibgkgjy`. Por isso, nenhuma migração foi aplicada ao banco de produção e a correção permanece separada para não interromper o site antes da configuração necessária.
