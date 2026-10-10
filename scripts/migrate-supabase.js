// Run with node --env-file=.env.local scripts/migrate-supabase.js after reviewing the SQL migration.
// Existing content is preserved. This never resets an administrator's password.
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required');
const client = new Client({ connectionString, ssl: { rejectUnauthorized: true, ...(process.env.DATABASE_CA_CERT ? { ca: process.env.DATABASE_CA_CERT } : {}) }, connectionTimeoutMillis: 15000 });
(async () => {
 try {
  await client.connect();
  await client.query('BEGIN');
  const migrations = fs.readdirSync(path.join(__dirname,'../supabase/migrations')).filter(x=>x.endsWith('.sql')).sort();
  for (const file of migrations) await client.query(fs.readFileSync(path.join(__dirname,'../supabase/migrations',file),'utf8'));
  const dbData = JSON.parse(fs.readFileSync(path.join(__dirname,'../data/db.json'),'utf8'));
    // ================= SEED DATA =================
    console.log('Seeding data into tables...');

    // 1. Site Settings
    await client.query(
      `
      INSERT INTO site_settings (id, data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id) DO NOTHING;
    `,
      ['main_settings', JSON.stringify(dbData.settings)]
    );

    // 2. Hero Config
    await client.query(
      `
      INSERT INTO hero_config (id, data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id) DO NOTHING;
    `,
      ['main_hero', JSON.stringify(dbData.hero)]
    );

    // 3. Services
    for (const s of dbData.services || []) {
      await client.query(
        `
        INSERT INTO services (id, slug, title, category, category_label, short_desc, full_desc, for_whom, requirements, stages, faqs, highlight, active, whatsapp_message)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO NOTHING;
      `,
        [
          s.id,
          s.slug,
          s.title,
          s.category,
          s.categoryLabel,
          s.shortDesc,
          s.fullDesc,
          s.forWhom,
          JSON.stringify(s.requirements || []),
          JSON.stringify(s.stages || []),
          JSON.stringify(s.faqs || []),
          s.highlight ?? false,
          s.active ?? true,
          s.whatsappMessage || '',
        ]
      );
    }
    console.log(`✓ Seeded ${dbData.services?.length || 0} services.`);

    // 4. Courses
    for (const c of dbData.courses || []) {
      await client.query(
        `
        INSERT INTO courses (id, slug, title, kicker, short_desc, full_desc, carga_horaria, modalidade, homologacao, investimento, ementa, publico_alvo, requisitos, active, is_featured, badge)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO NOTHING;
      `,
        [
          c.id,
          c.slug,
          c.title,
          c.kicker || '',
          c.shortDesc || '',
          c.fullDesc || '',
          c.cargaHoraria || '',
          c.modalidade || '',
          c.homologacao || '',
          c.investimento || '',
          JSON.stringify(c.ementa || []),
          c.publicoAlvo || '',
          JSON.stringify(c.requisitos || []),
          c.active ?? true,
          c.isFeatured ?? false,
          c.badge || '',
        ]
      );
    }
    console.log(`✓ Seeded ${dbData.courses?.length || 0} courses.`);

    // 5. Gallery
    for (const g of dbData.gallery || []) {
      await client.query(
        `
        INSERT INTO gallery (id, title, category, category_label, image_url, student_name, category_badge, caption, is_featured_home, autorizado_uso_imagem, "order", created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;
      `,
        [
          g.id,
          g.title,
          g.category,
          g.categoryLabel,
          g.imageUrl,
          g.studentName || '',
          g.categoryBadge || '',
          g.caption || '',
          g.isFeaturedHome ?? false,
          g.autorizadoUsoImagem ?? false,
          g.order || 0,
          g.createdAt || '',
        ]
      );
    }
    console.log(`✓ Seeded ${dbData.gallery?.length || 0} gallery items.`);

    // 6. News
    for (const n of dbData.news || []) {
      await client.query(
        `
        INSERT INTO news (id, slug, title, summary, content, cover_image, category, author, status, published_at, updated_at, is_featured_home, seo_title, seo_description, source_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT (id) DO NOTHING;
      `,
        [
          n.id,
          n.slug,
          n.title,
          n.summary || '',
          n.content || '',
          n.coverImage || '',
          n.category || '',
          n.author || '',
          n.status || 'publicado',
          n.publishedAt || '',
          n.updatedAt || '',
          n.isFeaturedHome ?? false,
          n.seoTitle || '',
          n.seoDescription || '',
          n.sourceUrl || '',
        ]
      );
    }
    console.log(`✓ Seeded ${dbData.news?.length || 0} news articles.`);

    // 7. Testimonials
    for (const t of dbData.testimonials || []) {
      await client.query(
        `
        INSERT INTO testimonials (id, author, category, text, rating, active, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO NOTHING;
      `,
        [t.id, t.author, t.category, t.text, t.rating || 5, t.active ?? true, t.date || '']
      );
    }
    console.log(`✓ Seeded ${dbData.testimonials?.length || 0} testimonials.`);

    // 8. FAQs
    for (const f of dbData.faqs || []) {
      await client.query(
        `
        INSERT INTO faqs (id, topic, question, answer, "order", active)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING;
      `,
        [f.id, f.topic, f.question, f.answer, f.order || 0, f.active ?? true]
      );
    }
    console.log(`✓ Seeded ${dbData.faqs?.length || 0} FAQ items.`);


  const existing = await client.query("SELECT id,password_hash FROM public.admin_users WHERE username = 'admin'");
  if (!existing.rows.length || !/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(existing.rows[0].password_hash)) {
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (!password || password.length < 12 || password.length > 128 || password === existing.rows[0]?.password_hash) throw new Error('A new ADMIN_BOOTSTRAP_PASSWORD (12-128 characters) is required to replace insecure credentials');
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await promisify(crypto.scrypt)(password,salt,64);
    const encoded = `scrypt$${salt}$${hash.toString('hex')}`;
    await client.query("INSERT INTO public.admin_users(id,username,password_hash) VALUES('primary_admin','admin',$1) ON CONFLICT(username) DO UPDATE SET password_hash=EXCLUDED.password_hash,updated_at=now()",[encoded]);
    await client.query('DELETE FROM public.admin_sessions');
  }
  await client.query('COMMIT');
  console.log('Database bootstrap and security migration completed. Existing editorial content preserved.');
 } catch (error) {
  await client.query('ROLLBACK').catch(()=>{});
  console.error('Migration failed; transaction rolled back.', { code: error.code || 'CONFIGURATION_OR_MIGRATION_ERROR' });
  process.exitCode = 1;
 } finally { await client.end(); }
})();
