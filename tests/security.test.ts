import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../lib/passwords';
import { safeUrl, gallerySchema, newsSchema, contactSchema, passwordSchema, settingsSchema } from '../lib/validation';
import seed from '../data/db.json';

test('Passwords use salted scrypt and reject wrong, plaintext and malformed credentials', async () => {
  const password = 'Correct test password 123!';
  const a = await hashPassword(password), b = await hashPassword(password);
  assert.notEqual(a,b); assert.equal(await verifyPassword(password,a),true);
  assert.equal(await verifyPassword('wrong',a),false);
  assert.equal(await verifyPassword(password,password),false);
  assert.equal(await verifyPassword(password,'scrypt$bad$00'),false);
  assert.equal(await verifyPassword('x'.repeat(129),a),false);
});
test('Unsafe URL protocols, credentials, control characters and protocol-relative URLs are rejected', () => {
  for (const input of ['javascript:alert(1)','data:text/html,<script>','//evil.test','/\\evil.test','https://user:pass@example.com','java\nscript:alert(1)','https://example.com\n']) assert.equal(safeUrl(input),false,input);
  for (const input of ['/api/media/photo.webp','#contato','https://example.com/photo.webp']) assert.equal(safeUrl(input),true,input);
});
test('Gallery authorization is explicit boolean and defaults to private', () => {
  const { autorizadoUsoImagem, ...item } = seed.gallery[0];
  assert.equal(gallerySchema.parse(item).autorizadoUsoImagem,false);
  assert.equal(gallerySchema.safeParse({...item, autorizadoUsoImagem:'true'}).success,false);
});
test('News defaults to draft and rejects unsafe external sources', () => {
  const { status,...article } = seed.news[0];
  assert.equal(newsSchema.parse(article).status,'rascunho');
  assert.equal(newsSchema.safeParse({...article,sourceUrl:'javascript:alert(1)'}).success,false);
});
test('Contact, password and map configuration enforce types and bounds', () => {
  assert.equal(contactSchema.safeParse({name:['attacker'],phone:'11999999999',service:'outros'}).success,false);
  assert.equal(contactSchema.safeParse({name:'Teste',email:'a@example.com',service:'outros',message:'x'.repeat(3001)}).success,false);
  assert.equal(passwordSchema.safeParse({currentPassword:'old',newPassword:'short'}).success,false);
  assert.equal(settingsSchema.safeParse({...seed.settings,googleMapsEmbedUrl:'https://attacker.test/embed'}).success,false);
  assert.equal(settingsSchema.safeParse(seed.settings).success,true);
});
