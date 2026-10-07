const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.eoipvmwhbcchxibgkgjy:sqdIrWgKVn21@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✓ Successfully connected to Supabase PostgreSQL!');

    // Read current data/db.json
    const dbJsonPath = path.join(__dirname, '..', 'data', 'db.json');
    const dbData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

    console.log('Creating database schema tables...');

    // 1. site_settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. hero_config
    await client.query(`
      CREATE TABLE IF NOT EXISTS hero_config (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. services
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT,
        category_label TEXT,
        short_desc TEXT,
        full_desc TEXT,
        for_whom TEXT,
        requirements JSONB DEFAULT '[]'::jsonb,
        stages JSONB DEFAULT '[]'::jsonb,
        faqs JSONB DEFAULT '[]'::jsonb,
        highlight BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        whatsapp_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. courses
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        kicker TEXT,
        short_desc TEXT,
        full_desc TEXT,
        carga_horaria TEXT,
        modalidade TEXT,
        homologacao TEXT,
        investimento TEXT,
        ementa JSONB DEFAULT '[]'::jsonb,
        publico_alvo TEXT,
        requisitos JSONB DEFAULT '[]'::jsonb,
        active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        badge TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 5. gallery
    await client.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        category_label TEXT,
        image_url TEXT NOT NULL,
        student_name TEXT,
        category_badge TEXT,
        caption TEXT,
        is_featured_home BOOLEAN DEFAULT false,
        autorizado_uso_imagem BOOLEAN DEFAULT true,
        "order" INT DEFAULT 0,
        created_at TEXT
      );
    `);

    // 6. news
    await client.query(`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        cover_image TEXT,
        category TEXT,
        author TEXT,
        status TEXT DEFAULT 'publicado',
        published_at TEXT,
        updated_at TEXT,
        is_featured_home BOOLEAN DEFAULT false,
        seo_title TEXT,
        seo_description TEXT,
        source_url TEXT
      );
    `);

    // 7. testimonials
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        author TEXT NOT NULL,
        category TEXT,
        text TEXT NOT NULL,
        rating INT DEFAULT 5,
        active BOOLEAN DEFAULT true,
        date TEXT
      );
    `);

    // 8. faqs
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id TEXT PRIMARY KEY,
        topic TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        "order" INT DEFAULT 0,
        active BOOLEAN DEFAULT true
      );
    `);

    // 9. admin_users
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 10. contact_leads
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        service TEXT,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    console.log('✓ All 10 tables created or verified successfully!');

    // ================= SEED DATA =================
    console.log('Seeding data into tables...');

    // 1. Site Settings
    await client.query(
      `
      INSERT INTO site_settings (id, data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW();
    `,
      ['main_settings', JSON.stringify(dbData.settings)]
    );

    // 2. Hero Config
    await client.query(
      `
      INSERT INTO hero_config (id, data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW();
    `,
      ['main_hero', JSON.stringify(dbData.hero)]
    );

    // 3. Services
    for (const s of dbData.services || []) {
      await client.query(
        `
        INSERT INTO services (id, slug, title, category, category_label, short_desc, full_desc, for_whom, requirements, stages, faqs, highlight, active, whatsapp_message)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          category_label = EXCLUDED.category_label,
          short_desc = EXCLUDED.short_desc,
          full_desc = EXCLUDED.full_desc,
          for_whom = EXCLUDED.for_whom,
          requirements = EXCLUDED.requirements,
          stages = EXCLUDED.stages,
          faqs = EXCLUDED.faqs,
          highlight = EXCLUDED.highlight,
          active = EXCLUDED.active,
          whatsapp_message = EXCLUDED.whatsapp_message;
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
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          kicker = EXCLUDED.kicker,
          short_desc = EXCLUDED.short_desc,
          full_desc = EXCLUDED.full_desc,
          carga_horaria = EXCLUDED.carga_horaria,
          modalidade = EXCLUDED.modalidade,
          homologacao = EXCLUDED.homologacao,
          investimento = EXCLUDED.investimento,
          ementa = EXCLUDED.ementa,
          publico_alvo = EXCLUDED.publico_alvo,
          requisitos = EXCLUDED.requisitos,
          active = EXCLUDED.active,
          is_featured = EXCLUDED.is_featured,
          badge = EXCLUDED.badge;
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
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          category_label = EXCLUDED.category_label,
          image_url = EXCLUDED.image_url,
          student_name = EXCLUDED.student_name,
          category_badge = EXCLUDED.category_badge,
          caption = EXCLUDED.caption,
          is_featured_home = EXCLUDED.is_featured_home,
          autorizado_uso_imagem = EXCLUDED.autorizado_uso_imagem,
          "order" = EXCLUDED."order",
          created_at = EXCLUDED.created_at;
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
          g.autorizadoUsoImagem ?? true,
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
        ON CONFLICT (id) DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          content = EXCLUDED.content,
          cover_image = EXCLUDED.cover_image,
          category = EXCLUDED.category,
          author = EXCLUDED.author,
          status = EXCLUDED.status,
          published_at = EXCLUDED.published_at,
          updated_at = EXCLUDED.updated_at,
          is_featured_home = EXCLUDED.is_featured_home,
          seo_title = EXCLUDED.seo_title,
          seo_description = EXCLUDED.seo_description,
          source_url = EXCLUDED.source_url;
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
        ON CONFLICT (id) DO UPDATE SET
          author = EXCLUDED.author,
          category = EXCLUDED.category,
          text = EXCLUDED.text,
          rating = EXCLUDED.rating,
          active = EXCLUDED.active,
          date = EXCLUDED.date;
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
        ON CONFLICT (id) DO UPDATE SET
          topic = EXCLUDED.topic,
          question = EXCLUDED.question,
          answer = EXCLUDED.answer,
          "order" = EXCLUDED."order",
          active = EXCLUDED.active;
      `,
        [f.id, f.topic, f.question, f.answer, f.order || 0, f.active ?? true]
      );
    }
    console.log(`✓ Seeded ${dbData.faqs?.length || 0} FAQ items.`);

    // 9. Admin Credentials
    const adminUser = dbData.adminCredentials?.username || 'admin';
    const adminPass = dbData.adminCredentials?.passwordHash || 'itamarati2026';
    await client.query(
      `
      INSERT INTO admin_users (id, username, password_hash, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        password_hash = EXCLUDED.password_hash,
        updated_at = NOW();
    `,
      ['primary_admin', adminUser, adminPass]
    );
    console.log('✓ Seeded admin user credentials.');

    console.log('\n========================================');
    console.log('🎉 SUPABASE MIGRATION AND SEED COMPLETED SUCCESSFULLY!');
    console.log('========================================');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
