import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, getDocs, serverTimestamp, writeBatch, Timestamp, deleteField } from 'firebase/firestore';
import fs from 'fs';

const env = await initializeTestEnvironment({ projectId: 'demo-test', firestore: { rules: fs.readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8'), host: '127.0.0.1', port: 8085 } });
await env.withSecurityRulesDisabled(async ctx => {
  const db = ctx.firestore(); const s = (p, d) => setDoc(doc(db, p), d);
  await s('encryption_keys/A', { encryption_key: 'kA' }); await s('encryption_keys/B', { encryption_key: 'kB' });
  await s('settings/A', { teacher_name: 'A', min_termine_anzahl: 3 });
  await s('termine/tA1', { user_id: 'A', datum: '2026-11-02', zeit: '14:00', dauer_minuten: 30, ist_verfuegbar: true });
  await s('termine/tB1', { user_id: 'B', datum: '2026-11-02', zeit: '15:00', dauer_minuten: 30, ist_verfuegbar: true });
  await s('antworten/aA', { termin_gruppe_id: 'A', kindname_encrypted: 'x', kindname_hash: 'h', email_encrypted: 'y', verfuegbare_termine: ['tA1'] });
  await s('antworten/aB', { termin_gruppe_id: 'B', kindname_encrypted: 'x', kindname_hash: 'h', email_encrypted: 'y', verfuegbare_termine: ['tB1'] });
  await s('antworten/aU', { termin_gruppe_id: 'U', kindname_encrypted: 'x', kindname_hash: 'h', email_encrypted: 'y', verfuegbare_termine: [] });
  await s('antworten/aF', { termin_gruppe_id: 'F', kindname_encrypted: 'x', kindname_hash: 'h', email_encrypted: 'y', verfuegbare_termine: [] });
  await s('zuteilungen/zA', { termin_id: 'tA1', antwort_id: 'aA', user_id: 'A', status: 'zugeteilt' });
  await s('zuteilungen/zB', { termin_id: 'tB1', antwort_id: 'aB', user_id: 'B', status: 'zugeteilt' });
  await s('zuteilungen/zAlt', { termin_id: 'tA1', antwort_id: 'aA', status: 'zugeteilt' });
  await s('mail/mA', { to: 'e@x.ch', _meta: { lehrer_uid: 'A' } }); await s('mail/mB', { to: 'e@x.ch', _meta: { lehrer_uid: 'B' } });
});
const lehrer = (uid, email, verified = true) => env.authenticatedContext(uid, { email, email_verified: verified }).firestore();
const anon = env.unauthenticatedContext().firestore();
const A = lehrer('A', 'a@belose.ch'), B = lehrer('B', 'b@belose.ch');
const U = lehrer('U', 'u@belose.ch', false), F = lehrer('F', 'f@gmail.com');
const GROSS = lehrer('A', 'A.Muster@BeLoSe.CH'), TRICK1 = lehrer('A', 'a@belose.ch.evil.com'), TRICK2 = lehrer('A', 'a@notbelose.ch');

let ok = 0, fail = 0;
async function t(name, erwartet, fn) {
  try { await (erwartet ? assertSucceeds(fn()) : assertFails(fn())); ok++; console.log(`  ✓ ${erwartet ? 'ERLAUBT ' : 'VERBOTEN'}  ${name}`); }
  catch (e) { fail++; console.log(`  ✗ FALSCH   ${name}  (${e.message.split('\n')[0]})`); }
}
const antwort = (zu, extra = {}) => ({ termin_gruppe_id: zu, kindname_encrypted: 'enc', kindname_hash: 'hash', email_encrypted: 'enc', verfuegbare_termine: ['tA1'], created_at: serverTimestamp(), ...extra });

console.log('Eltern-Formular (ohne Login):');
await t('freie Termine einer Lehrperson lesen', true, () => getDocs(query(collection(anon, 'termine'), where('user_id', '==', 'A'), where('ist_verfuegbar', '==', true))));
await t('Settings + Schlüssel lesen', true, async () => { await getDoc(doc(anon, 'settings/A')); await getDoc(doc(anon, 'encryption_keys/A')); });
await t('Zuteilungen prüfen (termin_id in ...)', true, () => getDocs(query(collection(anon, 'zuteilungen'), where('termin_id', 'in', ['tA1']))));
await t('gültige Antwort absenden', true, () => addDoc(collection(anon, 'antworten'), antwort('A')));
await t('Antwort an nicht existierende Lehrperson', false, () => addDoc(collection(anon, 'antworten'), antwort('GIBTSNICHT')));
await t('Antwort mit Zusatzfeld (unverschlüsselter Name)', false, () => addDoc(collection(anon, 'antworten'), antwort('A', { kindname: 'Klartext' })));
await t('Antwort ohne Server-Zeitstempel', false, () => addDoc(collection(anon, 'antworten'), antwort('A', { created_at: Timestamp.fromMillis(0) })));
await t('Antworten lesen', false, () => getDoc(doc(anon, 'antworten/aA')));
await t('Mail einreihen', false, () => addDoc(collection(anon, 'mail'), { to: 'x@y.ch', _meta: { lehrer_uid: 'A' } }));

console.log('Registrierung (Konto noch unbestätigt):');
await t('eigenen Schlüssel anlegen', true, () => setDoc(doc(U, 'encryption_keys/U'), { encryption_key: 'kU' }));
await t('eigene Settings anlegen', true, () => setDoc(doc(U, 'settings/U'), { teacher_name: null, min_termine_anzahl: 3 }, { merge: true }));
await t('Termin anlegen', false, () => addDoc(collection(U, 'termine'), { user_id: 'U', datum: '2026-11-02', zeit: '10:00', dauer_minuten: 30, ist_verfuegbar: true }));
await t('eigene Antworten lesen', false, () => getDocs(query(collection(U, 'antworten'), where('termin_gruppe_id', '==', 'U'))));

console.log('Konto mit fremder Domain (bestätigt):');
await t('eigene Antworten lesen', false, () => getDocs(query(collection(F, 'antworten'), where('termin_gruppe_id', '==', 'F'))));
await t('Termin anlegen', false, () => addDoc(collection(F, 'termine'), { user_id: 'F', datum: '2026-11-02', zeit: '10:00', dauer_minuten: 30, ist_verfuegbar: true }));
await t('Mail einreihen', false, () => addDoc(collection(F, 'mail'), { to: 'x@y.ch', _meta: { lehrer_uid: 'F' } }));
await t('Domain-Trick a@belose.ch.evil.com', false, () => getDocs(query(collection(TRICK1, 'antworten'), where('termin_gruppe_id', '==', 'A'))));
await t('Domain-Trick a@notbelose.ch', false, () => getDocs(query(collection(TRICK2, 'antworten'), where('termin_gruppe_id', '==', 'A'))));
await t('Grossschreibung A.Muster@BeLoSe.CH', true, () => getDocs(query(collection(GROSS, 'antworten'), where('termin_gruppe_id', '==', 'A'))));

console.log('Lehrperson A - normale Nutzung (wie Dashboard):');
await t('eigene Antworten abfragen (loadAntworten)', true, () => getDocs(query(collection(A, 'antworten'), where('termin_gruppe_id', '==', 'A'))));
await t('eigene Termine abfragen', true, () => getDocs(query(collection(A, 'termine'), where('user_id', '==', 'A'))));
await t('Termin anlegen', true, () => addDoc(collection(A, 'termine'), { user_id: 'A', datum: '2026-11-03', zeit: '10:00', dauer_minuten: 30, ist_verfuegbar: true }));
await t('eigenen Termin als vergeben markieren', true, () => updateDoc(doc(A, 'termine/tA1'), { ist_verfuegbar: false }));
await t('eigene Antwort umbenennen (Zusammenführen/Trennen)', true, () => updateDoc(doc(A, 'antworten/aA'), { kindname_encrypted: 'neu-enc', kindname_hash: 'neu-hash', kindname: deleteField() }));
await t('Zuteilungen speichern: 1 löschen + 25 neu in einem Batch', true, async () => {
  const b = writeBatch(A); b.delete(doc(A, 'zuteilungen/zA'));
  for (let i = 0; i < 25; i++) b.set(doc(collection(A, 'zuteilungen')), { termin_id: 't' + i, antwort_id: 'a' + i, user_id: 'A', status: 'zugeteilt', created_at: serverTimestamp() });
  await b.commit(); });
await t('alte Zuteilung ohne user_id löschen', true, () => deleteDoc(doc(A, 'zuteilungen/zAlt')));
await t('eigene Mails abfragen (Limit-Anzeige)', true, () => getDocs(query(collection(A, 'mail'), where('_meta.lehrer_uid', '==', 'A'))));
await t('Mail einreihen (wie sendAutomaticEmails)', true, () => addDoc(collection(A, 'mail'), { to: 'e@x.ch', replyTo: 'a@belose.ch', message: { subject: 's', text: 't' }, expire_at: Timestamp.now(), _meta: { lehrer_uid: 'A', termin_id: 'tA1', antwort_id: 'aA', created_at: serverTimestamp() } }));
await t('eigene Settings speichern', true, () => setDoc(doc(A, 'settings/A'), { min_termine_anzahl: 4 }, { merge: true }));
await t('eigene Antwort löschen (Reset)', true, () => deleteDoc(doc(A, 'antworten/aA')));

console.log('Lehrperson A - Zugriff auf fremde Daten (muss scheitern):');
await t('ALLE Antworten abfragen (alter Code)', false, () => getDocs(collection(A, 'antworten')));
await t('Antwort von B lesen', false, () => getDoc(doc(A, 'antworten/aB')));
await t('Antwort von B löschen', false, () => deleteDoc(doc(A, 'antworten/aB')));
await t('eigene Antwort an B umhängen', false, () => updateDoc(doc(B, 'antworten/aB'), { termin_gruppe_id: 'A' }));
await t('Termin von B ändern', false, () => updateDoc(doc(A, 'termine/tB1'), { ist_verfuegbar: false }));
await t('Termin von B löschen', false, () => deleteDoc(doc(A, 'termine/tB1')));
await t('Termin im Namen von B anlegen', false, () => addDoc(collection(A, 'termine'), { user_id: 'B', datum: '2026-11-03', zeit: '10:00', dauer_minuten: 30 }));
await t('Zuteilung von B löschen', false, () => deleteDoc(doc(A, 'zuteilungen/zB')));
await t('Zuteilung ohne user_id anlegen', false, () => addDoc(collection(A, 'zuteilungen'), { termin_id: 'tA1', antwort_id: 'aA', status: 'zugeteilt' }));
await t('Zuteilung im Namen von B anlegen', false, () => addDoc(collection(A, 'zuteilungen'), { termin_id: 'tB1', antwort_id: 'aB', user_id: 'B' }));
await t('ALLE Mails abfragen (alter Code)', false, () => getDocs(collection(A, 'mail')));
await t('Mail von B lesen', false, () => getDoc(doc(A, 'mail/mB')));
await t('Mail im Namen von B einreihen', false, () => addDoc(collection(A, 'mail'), { to: 'e@x.ch', _meta: { lehrer_uid: 'B' } }));
await t('Mail mit eigenem Absender (from)', false, () => addDoc(collection(A, 'mail'), { to: 'e@x.ch', from: 'chef@bank.ch', _meta: { lehrer_uid: 'A' } }));
await t('Mail-Status ändern', false, () => updateDoc(doc(A, 'mail/mA'), { delivery: {} }));
await t('Settings von B ändern', false, () => setDoc(doc(A, 'settings/B'), { teacher_name: 'Hack' }));
await t('eigenen Schlüssel überschreiben', false, () => setDoc(doc(A, 'encryption_keys/A'), { encryption_key: 'neu' }));
await t('Schlüssel von B anlegen/überschreiben', false, () => setDoc(doc(A, 'encryption_keys/B'), { encryption_key: 'neu' }));

console.log(`\nErgebnis: ${ok} korrekt, ${fail} falsch`);
await env.cleanup();
process.exit(fail ? 1 : 0);
