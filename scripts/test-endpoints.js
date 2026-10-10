const http = require('http');

const paths = [
  '/',
  '/sobre',
  '/servicos',
  '/cursos',
  '/galeria',
  '/noticias',
  '/noticias/esclarecimento-aulas-autoescola-obrigatorias',
  '/contato',
  '/politica-de-privacidade',
  '/robots.txt',
  '/sitemap.xml',
  '/admin',
];

async function checkPath(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          hasContent: data.length > 50,
          length: data.length,
        });
      });
    });
    req.on('error', (err) => {
      resolve({ path: urlPath, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing Autoescola Itamarati Endpoints...\n');
  for (const p of paths) {
    const res = await checkPath(p);
    if (res.statusCode === 200) {
      console.log(`[PASS] 200 OK  : ${res.path} (${res.length} bytes)`);
    } else {
      console.log(`[FAIL] ${res.statusCode || 'ERR'} : ${res.path} - ${res.error || ''}`);
    }
  }

  // Test Contact form API
  console.log('\nTesting /api/contact API...');
  const contactPayload = JSON.stringify({
    name: 'Teste Aluno',
    phone: '11999999999',
    email: 'teste@aluno.com',
    service: 'primeira-cnh',
    message: 'Gostaria de saber o valor para Categoria B',
  });

  const contactReq = http.request(
    'http://localhost:3000/api/contact',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000',
        'Content-Length': Buffer.byteLength(contactPayload),
      },
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(`[PASS] Contact API: ${res.statusCode} - ${data}`);
      });
    }
  );
  contactReq.write(contactPayload);
  contactReq.end();
}

run();
