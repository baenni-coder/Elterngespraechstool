// ============================================
// TEXTE FÜR DIE MAG-VARIANTE
// ============================================

// Die Eltern-Texte stehen weiterhin direkt in den HTML-Dateien und im Code.
// Nur in der MAG-Variante werden sie durch die Texte hier ersetzt.
// Fehlt ein Schlüssel, bleibt der Eltern-Text stehen.
//
// Muss NACH firebase-config.js geladen werden (braucht VARIANTE).

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
    'formular.erfolg': '<strong>Vielen Dank!</strong><br>Deine Verfügbarkeit wurde erfolgreich übermittelt.<br><br>Du erhältst eine Bestätigung per E-Mail, sobald die Schulleitung die Termine zugeteilt hat.',
    'formular.fehler_link': 'Ungültiger Link. Bitte verwende den Link, den du von der Schulleitung erhalten hast.',
    'formular.fehler_keine_termine': 'Aktuell sind keine Termine verfügbar. Bitte melde dich bei der Schulleitung.',
    'formular.fehler_alle_vergeben': 'Alle Termine sind bereits vergeben. Bitte melde dich bei der Schulleitung für weitere Möglichkeiten.',
    'formular.fehler_kein_name': 'Bitte gib deinen Namen ein.',
    'formular.fehler_kein_termin': 'Bitte wähle mindestens einen Termin aus.',
    'formular.fehler_zu_wenig_termine': (min, minWort, anzahl, anzahlWort) => `Bitte wähle mindestens ${min} ${minWort} aus. Du hast ${anzahl} ${anzahlWort} ausgewählt.`,
    'formular.fehler_schluessel': 'Verschlüsselungskey konnte nicht geladen werden. Bitte melde dich bei der Schulleitung.'
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
});
