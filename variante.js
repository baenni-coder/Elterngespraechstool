// ============================================
// VARIANTE: Elterngespräch / Mitarbeitendengespräch (MAG)
// ============================================

// Derselbe Code läuft als zwei getrennte Instanzen mit je eigener Datenbank.
// Welche Variante aktiv ist, entscheidet der Hostname. Jeder unbekannte Hostname
// ergibt die Eltern-Variante - so bleibt die bestehende Installation unverändert.
//
// Eigene Datei ohne Firebase-Abhängigkeit, damit auch Seiten ohne Firebase
// (z.B. impressum.html) die Variante kennen. Muss VOR firebase-config.js und texte.js
// geladen werden.

// Hostnamen der MAG-Instanz (noch festzulegen)
const MAG_HOSTNAMES = [];

function ermittleVariante() {
    const host = window.location.hostname;
    if (MAG_HOSTNAMES.includes(host)) {
        return 'mag';
    }
    // Lokales Testen: ?variante=mag (nur auf localhost, nie auf der Live-Domain)
    const istLokal = host === 'localhost' || host === '127.0.0.1' || host === '';
    if (istLokal && new URLSearchParams(window.location.search).get('variante') === 'mag') {
        return 'mag';
    }
    return 'eltern';
}

const VARIANTE = ermittleVariante();
