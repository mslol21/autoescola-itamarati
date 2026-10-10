import { randomUUID } from 'node:crypto';
import { getSupabase } from '@/lib/supabase';
import { assertSameOrigin, handle, json, readJson } from '@/lib/http';
import { contactSchema } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
export async function POST(request: Request) { return handle(async () => {
  assertSameOrigin(request);
  const lead = contactSchema.parse(await readJson(request, 8192));
  await rateLimit(request, 'contact', 5, 600);
  const { error } = await getSupabase().from('contact_leads').insert({ id: randomUUID(), ...lead });
  if (error) throw new Error('LEAD_WRITE_FAILED');
  return json({ success: true, message: 'Mensagem recebida com sucesso! Nossa equipe entrará em contato em breve.' });
}); }
