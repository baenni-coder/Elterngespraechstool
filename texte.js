// ============================================
// TEXTE FÜR DIE MAG-VARIANTE
// ============================================

// Die Eltern-Texte stehen weiterhin direkt in den HTML-Dateien und im Code.
// Nur in der MAG-Variante werden sie durch die Texte hier ersetzt.
// Fehlt ein Schlüssel, bleibt der Eltern-Text stehen.
//
// Muss NACH variante.js geladen werden (braucht VARIANTE).

const MAG_TEXTE = {
    // ---------- eltern-formular.html ----------
    'formular.seitentitel': 'Mitarbeitendengespräch - Terminwahl',
    'formular.titel': '📅 Mitarbeitendengespräch',
    'formular.untertitel': 'Bitte wähle deine verfügbaren Termine',
    'formular.untertitel_mit_name': (name) => `Schulleitung: ${name}`,
    'formular.label_name': 'Dein Name *',
    'formular.platzhalter_name': 'z.B. Vorname Nachname',
    'formular.label_email': 'Deine E-Mail-Adresse *',
    'formular.platzhalter_email': 'deine.email@beispiel.ch',
    'formular.label_termine': 'Welche Termine passen dir? * <span style="font-weight: normal; color: #666;">(Mehrfachauswahl möglich)</span>',
    'formular.label_termine_min': (anzahl, wort) => `Welche Termine passen dir? * <span style="font-weight: normal; color: #666;">(Bitte mindestens ${anzahl} ${wort} auswählen)</span>`,
    'formular.erfolg': '<strong>Vielen Dank!</strong><br>Deine Verfügbarkeit wurde erfolgreich übermittelt.<br><br>Du erhältst eine Bestätigung per E-Mail, sobald die Schulleitung die Termine zugeteilt hat.<br><br>Möchtest du deine Angaben ändern, fülle das Formular einfach nochmals mit demselben Namen aus - es zählt deine neueste Antwort.',
    'formular.fehler_link': 'Ungültiger Link. Bitte verwende den Link, den du von der Schulleitung erhalten hast.',
    'formular.fehler_keine_termine': 'Aktuell sind keine Termine verfügbar. Bitte melde dich bei der Schulleitung.',
    'formular.fehler_alle_vergeben': 'Alle Termine sind bereits vergeben. Bitte melde dich bei der Schulleitung für weitere Möglichkeiten.',
    'formular.fehler_kein_name': 'Bitte gib deinen Namen ein.',
    'formular.fehler_kein_termin': 'Bitte wähle mindestens einen Termin aus.',
    'formular.fehler_zu_wenig_termine': (min, minWort, anzahl, anzahlWort) => `Bitte wähle mindestens ${min} ${minWort} aus. Du hast ${anzahl} ${anzahlWort} ausgewählt.`,
    'formular.fehler_schluessel': 'Verschlüsselungskey konnte nicht geladen werden. Bitte melde dich bei der Schulleitung.',

    // ---------- index.html ----------
    'start.seitentitel': 'MAG-Planer',
    'start.titel': '📅 MAG-Planer',
    'start.button_leitung': '💼 Für Schulleitungen<br><small style="font-weight: normal; font-size: 14px;">Termine verwalten & zuteilen</small>',
    'start.button_formular': '👥 Für Mitarbeitende<br><small style="font-weight: normal; font-size: 14px;">Verfügbarkeit angeben</small>',
    'start.info': '<strong>Für Mitarbeitende:</strong> Klicke auf "Für Mitarbeitende" und gib deine verfügbaren Termine an.<br><br><strong>Für Schulleitungen:</strong> Melde dich an, um Termine zu erstellen und zuzuteilen.',

    // ---------- lehrer-login.html ----------
    // Registrierung ist in der MAG-Variante ausgeblendet; Konten werden in der Firebase Console angelegt.
    'login.seitentitel': 'Login Schulleitung',
    'login.titel': '💼 Login Schulleitung',
    'login.untertitel': 'Melde dich an, um Termine zu verwalten',
    'login.erfolg': '✓ Erfolgreich angemeldet! Du wirst weitergeleitet...',

    // ---------- lehrer-dashboard.html (Teil 1: Oberfläche) ----------
    // Hinweise zu "Elternteilen" erscheinen nur bei mehreren Antworten pro Name
    // und werden mit der Logik "neue Antwort ersetzt alte" hinfällig.
    'dashboard.seitentitel': 'MAG-Dashboard',
    'dashboard.titel': '💼 MAG-Dashboard',
    'dashboard.tab_antworten': '📨 Antworten (<span id="antworten-count">0</span>)',

    // Tab "Meine Termine"
    'dashboard.termine_intro': 'Erstelle Termine für Mitarbeitendengespräche.',
    'dashboard.label_name': 'Dein Name (optional)',
    'dashboard.hinweis_name': 'Wird den Mitarbeitenden im Formular angezeigt, damit sie die Formulare nicht verwechseln.',
    'dashboard.label_min_termine': 'Mindestanzahl Termine (die Mitarbeitende auswählen müssen)',
    'dashboard.hinweis_min_termine': 'Die Mitarbeitenden müssen mindestens diese Anzahl an Terminen ankreuzen.',
    'dashboard.hinweis_dauer': 'Wird beim Erstellen neuer Termine automatisch vorausgefüllt. Du kannst den Wert bei jedem einzelnen Termin überschreiben.',
    'dashboard.label_kontakt_email': 'Kontakt-E-Mail für Rückfragen (optional)',
    'dashboard.hinweis_kontakt_email': 'Wenn Mitarbeitende auf die Termin-Bestätigung antworten, landet die Nachricht an dieser Adresse. Wenn leer, wird deine Login-E-Mail verwendet.<br><br><strong>Hinweis:</strong> Der angezeigte Absender ist immer die zentrale Schul-Adresse - das ist technisch notwendig für die zuverlässige Zustellung (Spam-Schutz).',
    'dashboard.titel_termine_liste': 'Deine Termine',
    'dashboard.fehler_min_termine': 'Bitte gib für die Mindestanzahl Termine eine Zahl zwischen 1 und 10 ein.',
    'dashboard.fehler_dauer': 'Bitte gib für die Standardgesprächsdauer eine Zahl zwischen 5 und 120 Minuten ein.',
    'dashboard.fehler_kontakt_email': 'Bitte gib eine gültige Kontakt-E-Mail-Adresse ein oder lass das Feld leer.',

    // Tab "Link teilen"
    'dashboard.share_titel': 'Link mit Mitarbeitenden teilen',
    'dashboard.share_intro': 'Sende diesen Link an die Mitarbeitenden, damit sie ihre Verfügbarkeit angeben können.',
    'dashboard.share_box_titel': '📎 Link zum Formular',
    'dashboard.share_box_text': 'Kopiere diesen Link und sende ihn per E-Mail an die Mitarbeitenden:',
    'dashboard.share_tipp': '<strong>💡 Tipp:</strong> Die Mitarbeitenden brauchen kein Konto. Sie können direkt über den Link ihre Verfügbarkeit angeben.',
    'dashboard.link_kopiert': '✓ Link kopiert! Du kannst ihn jetzt in eine E-Mail einfügen.',

    // Tab "Antworten"
    'dashboard.antworten_titel': 'Antworten',
    'dashboard.antworten_intro': 'Übersicht der Mitarbeitenden, die ihre Verfügbarkeit angegeben haben.',

    // Tab "Zuteilung"
    'dashboard.zuteilung_intro': 'Weise jedem Termin die gewünschte Person zu.',
    'dashboard.zuteilung_anleitung': '<strong>Anleitung:</strong> Klicke auf eine Person, um sie einem Termin zuzuteilen. Bereits zugeteilte Personen werden bei anderen Terminen ausgegraut.',
    'dashboard.zuteilung_keine_daten': 'Bitte erstelle zuerst Termine und warte auf Antworten.',
    'dashboard.zuteilung_niemand': 'Niemand hat diesen Termin gewählt',
    'dashboard.zuteilung_leer': 'Bitte teile mindestens einer Person einen Termin zu.',

    // Tab "Verwaltung"
    'dashboard.verwaltung_intro': 'Verwaltungsfunktionen für deine Mitarbeitendengespräche.',
    'dashboard.reset_titel': 'Für neue MAG-Runde vorbereiten',
    'dashboard.reset_text': 'Verwende diese Funktion, wenn du eine neue MAG-Runde starten möchtest.<br><strong>Was wird gelöscht:</strong>',
    'dashboard.reset_liste_antworten': 'Alle Antworten',
    'dashboard.reset_bleibt': '<strong>Was bleibt erhalten:</strong> Deine Termine (werden wieder als verfügbar markiert)',
    'dashboard.reset_confirm_1': '⚠️ ACHTUNG!\n\nDies löscht ALLE Antworten und Zuteilungen.\nDeine Termine bleiben erhalten.\n\nWirklich fortfahren?',
    'dashboard.reset_confirm_2': 'Bist du WIRKLICH sicher? Diese Aktion kann nicht rückgängig gemacht werden!',
    'dashboard.reset_erfolg': '✓ Erfolgreich! Alle Antworten und Zuteilungen wurden gelöscht. Deine Termine sind wieder verfügbar.',
    'dashboard.alles_confirm_1': '⚠️⚠️ ACHTUNG! ⚠️⚠️\n\nDies löscht ALLES:\n- Alle Termine\n- Alle Antworten\n- Alle Zuteilungen\n\nWirklich ALLES löschen?',
    'dashboard.alles_confirm_2': 'LETZTE WARNUNG!\n\nDu löschst wirklich ALLE deine Daten.\nDies kann NICHT rückgängig gemacht werden!\n\nFortfahren?',
    'dashboard.alles_erfolg': '✓ Erfolgreich! Alle Daten wurden gelöscht. Du kannst jetzt von vorne beginnen.',

    // Konto-Hinweise (E-Mail-Bestätigung / Schul-Domain)
    'dashboard.konto_domain': (email, domains) => `<strong>Hinweis zu deinem Konto:</strong> Du bist mit <strong>${email}</strong> angemeldet. Bald funktioniert das Tool nur noch mit einer Schul-Adresse (@${domains.join(', @')}). Bitte melde dich beim Betreiber (siehe Impressum), um dein Konto umzustellen.`,
    'dashboard.konto_bestaetigen': '<strong>Bitte bestätige deine E-Mail-Adresse.</strong> Bald ist das nötig, um das Tool weiter zu nutzen. Du erhältst dazu einen Link per E-Mail.',
    'dashboard.konto_link_button': '📧 Bestätigungslink senden',
    'dashboard.konto_link_gesendet': (email) => `✓ Link an <strong>${email}</strong> gesendet. Nach dem Bestätigen bitte diese Seite neu laden. (Keine Mail erhalten? Bitte auch den Spam-Ordner prüfen.)`,
    'dashboard.konto_zu_viele': 'Es wurden zu viele Links angefordert. Bitte versuche es in einigen Minuten erneut.',

    // ---------- lehrer-dashboard.html (Teil 2: Mails, Kalender, Export) ----------
    'dashboard.platzhalter_ort': 'z.B. Büro Schulleitung',
    'dashboard.konsole_pruefen': 'Bitte prüfe die Konsole.',
    'dashboard.vorlagen_intro': 'Kopiere die E-Mail-Texte und sende sie an die Mitarbeitenden:',
    'dashboard.gesamt_titel': '📅 Deine Termine (Gesamt-Kalender)',
    'dashboard.gesamt_text': 'Lade alle zugeteilten Termine als eine Kalender-Datei herunter:',
    'dashboard.csv_text': 'Exportiere die Daten als CSV für Mail-Merge (z.B. in Outlook):',

    // Bestätigungsmail (automatisch) und Kopiervorlage (manuell)
    'mail.absender_fallback': 'Mitarbeitendengespräch',
    'mail.betreff': 'Dein Termin für das Mitarbeitendengespräch',
    'mail.text': (name, datum, zeit, dauer, ort, absender) => `Hallo ${name}

Hiermit bestätige ich den Termin für dein Mitarbeitendengespräch:

Datum: ${datum}
Uhrzeit: ${zeit} Uhr
Dauer: ${dauer} Minuten${ort ? `\nOrt: ${ort}` : ''}

Im Anhang findest du den Termin als Kalender-Datei (.ics), die du direkt in deinen Kalender importieren kannst.

Ich freue mich auf unser Gespräch.

Liebe Grüsse
${absender}`,
    'mail.vorlage': (name, datum, zeit, dauer, ort) => `Hallo ${name}

Hiermit bestätige ich den Termin für dein Mitarbeitendengespräch:

Datum: ${datum}
Uhrzeit: ${zeit} Uhr
Dauer: ${dauer} Minuten${ort ? `\nOrt: ${ort}` : ''}

Ich freue mich auf unser Gespräch.

Liebe Grüsse`,

    // Kalenderdatei (.ics) - Mitarbeitende sehen den Namen der Schulleitung,
    // die Schulleitung im Gesamt-Kalender den Namen der Person
    'ics.prodid': '-//MAG-Planer//DE',
    'ics.kalendername': 'Mitarbeitendengespräche',
    'ics.uid_praefix': 'mag',
    'ics.titel': (leitungName) => `Mitarbeitendengespräch mit ${leitungName}`,
    'ics.beschreibung': 'Mitarbeitendengespräch',
    'ics.titel_lehrperson': (name) => `MAG ${name}`,
    'ics.beschreibung_lehrperson': (name) => `Mitarbeitendengespräch mit ${name}`,

    // "Meine Termine als Kalenderdatei" (alle Termine, freie als reserviert)
    'dashboard.meine_termine_hinweis': 'Alle deine Termine für deinen eigenen Kalender: noch freie als „reserviert“, vergebene mit Namen. Lade die Datei nach Änderungen einfach erneut herunter und importiere sie – bestehende Einträge werden aktualisiert (bei Google Kalender nicht immer zuverlässig). Die Datei „Alle Termine herunterladen“ im Tab „Zuteilung“ verwendet dieselben Einträge – auch zusammen importiert bleibt es ein Eintrag pro Termin.',
    'dashboard.meine_termine_leer': 'Du hast noch keine Termine erstellt.',
    'ics.titel_reserviert': 'MAG – reserviert (noch nicht vergeben)',
    'ics.beschreibung_reserviert': 'Termin für Mitarbeitendengespräche - noch nicht vergeben',
    'ics.titel_vergeben': 'MAG - vergeben',
    'datei.ics_meine_termine': 'MAG_Meine_Termine.ics',

    // Dateinamen und CSV
    'datei.ics_einzel': (safeName) => `MAG_${safeName}.ics`,
    'datei.ics_alle': 'MAG_Alle.ics',
    'datei.csv': 'MAG_Export.csv',
    'csv.kopfzeile': 'Name,Email,Datum,Uhrzeit,Dauer',

    // Erneute Antwort derselben Person: die neueste ersetzt die früheren (nur MAG)
    'dashboard.antwort_ersetzt': (anzahl) => `Aktualisierte Antwort - ersetzt ${anzahl === 1 ? 'eine frühere Antwort' : anzahl + ' frühere Antworten'}`,
    'dashboard.neu_zuteilen': (namen) => `<strong>🔄 Neu zuteilen:</strong> ${namen} ${namen.includes(',') ? 'haben' : 'hat'} nach der Zuteilung erneut geantwortet. Die frühere Zuteilung gilt nicht mehr - bitte neu zuteilen und speichern.`,

    // ---------- impressum.html ----------
    // Die MAG-Datenschutzerklärung steht als eigener Block in impressum.html (data-nur-mag)
    'impressum.seitentitel': 'Impressum & Datenschutz - MAG-Planer',
    'impressum.verfuegbarkeit': 'Der Betreiber ist bemüht, den MAG-Planer möglichst unterbrechungsfrei anzubieten. Es kann jedoch keine Garantie für eine jederzeitige Verfügbarkeit übernommen werden. Wartungsarbeiten, technische Störungen oder andere Umstände können zu temporären Einschränkungen führen.',
    'impressum.zweck': 'Der MAG-Planer ist eine Webanwendung zur Koordination der Termine für Mitarbeitendengespräche (MAG). Die Schulleitungen erstellen Termine und teilen sie zu, die Mitarbeitenden geben ohne Login ihre verfügbaren Zeiten an. Gesprächsinhalte werden im Tool nicht erfasst.',

    // Tab "Hilfe" - die MAG-FAQ selbst steht als eigener Block in lehrer-dashboard.html (data-nur-mag)
    'hilfe.intro': 'Hier findest du Antworten auf häufig gestellte Fragen zur Nutzung des MAG-Planers.',
    'hilfe.kontakt': 'Falls du weitere Fragen hast oder technische Probleme auftreten, melde dich beim Betreiber (siehe Impressum).'
};

function istMagVariante() {
    return typeof VARIANTE !== 'undefined' && VARIANTE === 'mag';
}

// Gibt in der MAG-Variante den MAG-Text zurück, sonst den mitgegebenen Eltern-Text.
// Ist der MAG-Text eine Funktion, erhält sie die zusätzlichen Parameter.
function variantenText(key, elternText, ...params) {
    if (!istMagVariante() || !(key in MAG_TEXTE)) {
        return elternText;
    }
    const magText = MAG_TEXTE[key];
    return typeof magText === 'function' ? magText(...params) : magText;
}

// Ersetzt statische Texte im HTML (nur MAG-Variante):
//   data-mag-text="key"        -> textContent
//   data-mag-html="key"        -> innerHTML
//   data-mag-placeholder="key" -> placeholder
//   data-mag-ausblenden        -> Element ausblenden
//   data-nur-mag               -> Element einblenden (ist im HTML mit display: none versteckt)
document.addEventListener('DOMContentLoaded', () => {
    if (!istMagVariante()) return;

    document.querySelectorAll('[data-mag-text]').forEach(el => {
        el.textContent = variantenText(el.dataset.magText, el.textContent);
    });
    document.querySelectorAll('[data-mag-html]').forEach(el => {
        el.innerHTML = variantenText(el.dataset.magHtml, el.innerHTML);
    });
    document.querySelectorAll('[data-mag-placeholder]').forEach(el => {
        el.placeholder = variantenText(el.dataset.magPlaceholder, el.placeholder);
    });
    document.querySelectorAll('[data-mag-ausblenden]').forEach(el => {
        el.style.display = 'none';
    });
    document.querySelectorAll('[data-nur-mag]').forEach(el => {
        el.style.display = '';
    });
});
