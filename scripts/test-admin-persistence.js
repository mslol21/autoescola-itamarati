const http = require('http');

function postJson(urlPath, data, cookie) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
      'Content-Length': Buffer.byteLength(payload),
    };
    if (cookie) headers['Cookie'] = cookie;

    const req = http.request(
      `http://localhost:3000${urlPath}`,
      { method: 'POST', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          });
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJson(urlPath, cookie) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (cookie) headers['Cookie'] = cookie;

    const req = http.request(
      `http://localhost:3000${urlPath}`,
      { method: 'GET', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null,
          });
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function testAdminFlow() {
  console.log('Testing Admin Authentication & CMS Persistence...\n');

  // 1. Login
  const loginRes = await postJson('/api/auth/login', {
    username: 'admin',
    password: process.env.TEST_ADMIN_PASSWORD,
  });
  console.log(`[1] Login status: ${loginRes.statusCode} - ${JSON.stringify(loginRes.body)}`);

  const setCookie = loginRes.headers['set-cookie'];
  if (!setCookie) {
    throw new Error('No set-cookie returned!');
  }
  const sessionCookie = setCookie[0].split(';')[0];
  console.log(`[2] Acquired session cookie: ${sessionCookie.slice(0, 30)}...`);

  // 2. Verify Session
  const sessionCheck = await getJson('/api/auth/session', sessionCookie);
  console.log(`[3] Session verification: ${JSON.stringify(sessionCheck.body)}`);

  // 3. Test Privacy Check in Gallery:
  // Add an unauthorized photo
  const unauthPhoto = {
    id: 'test-unauth-photo-1',
    title: 'Foto de Teste Sem Autorização',
    category: 'conquistas',
    categoryLabel: 'Conquistas',
    imageUrl: '/images/gallery/conquista-cnh-carro.jpg',
    studentName: 'Aluno Teste',
    caption: 'Foto sem autorização registrada',
    isFeaturedHome: true,
    autorizadoUsoImagem: false, // CRITICAL: FALSE!
    order: 99,
    createdAt: '2026-10-06',
  };

  const saveGalleryRes = await postJson('/api/admin/gallery', unauthPhoto, sessionCookie);
  console.log(`[4] Created unauthorized photo: ${JSON.stringify(saveGalleryRes.body)}`);

  // Public check (no session cookie)
  const publicGallery = await getJson('/api/admin/gallery');
  const foundInPublic = publicGallery.body.some((i) => i.id === 'test-unauth-photo-1');
  console.log(
    `[5] Unauthorized photo in public gallery? ${foundInPublic ? 'FAIL (Exposed!)' : 'PASS (Correctly Hidden!)'}`
  );

  // Admin check (with session cookie)
  const adminGallery = await getJson('/api/admin/gallery', sessionCookie);
  const foundInAdmin = adminGallery.body.some((i) => i.id === 'test-unauth-photo-1');
  console.log(
    `[6] Unauthorized photo in admin panel? ${foundInAdmin ? 'PASS (Visible to Admin)' : 'FAIL'}`
  );

  // Clean up test photo
  const delReq = http.request(
    'http://localhost:3000/api/admin/gallery?id=test-unauth-photo-1',
    {
      method: 'DELETE',
      headers: { Cookie: sessionCookie },
    },
    (res) => {
      console.log(`[7] Cleaned up test photo: status ${res.statusCode}`);
    }
  );
  delReq.end();

  // 4. Test Draft Article Protection:
  const draftArticle = {
    id: 'test-draft-1',
    slug: 'artigo-em-rascunho-teste',
    title: 'Artigo de Teste em Rascunho',
    summary: 'Este artigo não deve aparecer no site público até ser publicado.',
    content: 'Conteúdo do artigo em rascunho.',
    coverImage: '/images/news/news-dicas-exame.jpg',
    category: 'Rascunho',
    author: 'Admin',
    status: 'rascunho', // DRAFT
    publishedAt: '2026-10-06',
    updatedAt: '2026-10-06',
    isFeaturedHome: false,
  };

  await postJson('/api/admin/news', draftArticle, sessionCookie);
  console.log(`[8] Created draft article`);

  // Public news check
  const publicNews = await getJson('/api/admin/news');
  const foundDraftPublic = publicNews.body.some((n) => n.id === 'test-draft-1');
  console.log(
    `[9] Draft in public news list? ${foundDraftPublic ? 'FAIL (Exposed!)' : 'PASS (Correctly Hidden!)'}`
  );

  // Admin news check
  const adminNews = await getJson('/api/admin/news', sessionCookie);
  const foundDraftAdmin = adminNews.body.some((n) => n.id === 'test-draft-1');
  console.log(
    `[10] Draft in admin news list? ${foundDraftAdmin ? 'PASS (Visible to Admin)' : 'FAIL'}`
  );

  // Clean up test article
  const delNewsReq = http.request(
    'http://localhost:3000/api/admin/news?id=test-draft-1',
    {
      method: 'DELETE',
      headers: { Cookie: sessionCookie },
    },
    (res) => {
      console.log(`[11] Cleaned up test draft article: status ${res.statusCode}`);
    }
  );
  delNewsReq.end();
}

testAdminFlow().catch(console.error);
