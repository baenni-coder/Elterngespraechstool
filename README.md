# Elterngesprächstool mit Firebase

Ein benutzerfreundliches Tool zur Koordination von Elterngesprächen. Lehrpersonen können Termine erstellen und Eltern können ihre Verfügbarkeit angeben - ganz ohne Login für Eltern!

## Features

- **Für Lehrpersonen:**
  - Termine erstellen und verwalten
  - Eigenen Namen konfigurieren (wird Eltern angezeigt)
  - Mindestanzahl Termine festlegen (die Eltern auswählen müssen)
  - Eltern-Antworten einsehen (gruppiert nach Kindname)
  - Gemeinsame Termine bei getrennten Eltern (automatische Schnittmenge)
  - Termine intelligent zuteilen
  - Optionaler automatischer E-Mail-Versand (via Firebase "Trigger Email" Extension, z.B. mit Hoststar-SMTP)
  - E-Mail-Vorlagen und Kalender-Downloads (.ics)
  - CSV-Export für Mail-Merge
  - **Datenschutz: AES-256 Verschlüsselung** für sensible Daten (Kindernamen, E-Mails)

- **Für Eltern:**
  - Einfache Terminauswahl ohne Login
  - Mehrere Kinder gleichzeitig für gleiche Termine erfassen
  - Lehrperson-Name wird angezeigt (zur Orientierung)
  - Getrennte Eltern können unabhängig Termine wählen
  - Lokaler Link-Speicher (automatischer Rücksprung zum letzten Formular)
  - Übersichtliche Darstellung verfügbarer Termine
  - Mehrfachauswahl möglich

## Setup - Firebase Projekt einrichten

### 1. Firebase Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Gib einen Projektnamen ein (z.B. "elterngespraech-tool")
4. Folge den Anweisungen (Google Analytics ist optional)

### 2. Firebase Authentication aktivieren

1. In der Firebase Console: Gehe zu **Authentication** > **Sign-in method**
2. Aktiviere **E-Mail/Passwort**
3. Klicke auf "Speichern"

### 3. Firestore Database erstellen

1. In der Firebase Console: Gehe zu **Firestore Database**
2. Klicke auf "Datenbank erstellen"
3. Wähle **Produktionsmodus starten**
4. Wähle eine Region (z.B. europe-west6 für die Schweiz)
5. Klicke auf "Aktivieren"

### 4. Firebase Konfiguration eintragen

1. In der Firebase Console: Gehe zu **Projekteinstellungen** (Zahnrad-Symbol oben links)
2. Scrolle runter zu "Ihre Apps" und klicke auf das Web-Symbol (`</>`)
3. Registriere die App (Name: z.B. "Elterngesprächstool")
4. Kopiere die Firebase-Konfiguration

**Öffne die Datei `firebase-config.js` und ersetze die Platzhalter:**

```javascript
const firebaseConfig = {
    apiKey: "HIER_DEINEN_API_KEY",
    authDomain: "DEIN_PROJEKT.firebaseapp.com",
    projectId: "DEINE_PROJEKT_ID",
    storageBucket: "DEIN_PROJEKT.appspot.com",
    messagingSenderId: "DEINE_SENDER_ID",
    appId: "DEINE_APP_ID"
};
```

### 5. Firestore Rules deployen

Die Sicherheitsregeln sind bereits in der Datei `firestore.rules` definiert. Um sie zu deployen:

**Option A: Firebase CLI (empfohlen)**

```bash
# Firebase CLI installieren (falls noch nicht installiert)
npm install -g firebase-tools

# In Firebase einloggen
firebase login

# Firebase initialisieren (nur beim ersten Mal)
firebase init

# Wähle:
# - Firestore
# - Hosting
# - Wähle dein Projekt aus
# - Übernehme die Standard-Dateinamen (firestore.rules, etc.)

# Projekt ID in .firebaserc eintragen
# Öffne .firebaserc und ersetze "DEIN_FIREBASE_PROJEKT_ID" mit deiner echten Projekt-ID

# Rules und Indexes deployen
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

**Option B: Manuell über Firebase Console**

1. Gehe zu **Firestore Database** > **Regeln**
2. Kopiere den Inhalt von `firestore.rules` und füge ihn ein
3. Klicke auf "Veröffentlichen"

### 6. Composite Indexes erstellen

Firestore benötigt spezielle Indexes für komplexe Abfragen. Diese werden automatisch erstellt, wenn du die CLI verwendest (`firebase deploy --only firestore:indexes`).

Falls du die Indexes manuell erstellen musst:

1. Öffne die App und teste die Funktionen
2. Wenn ein Index fehlt, zeigt Firestore einen Link in der Browser-Konsole
3. Klicke auf den Link, um den Index automatisch zu erstellen

### 7. Firebase Hosting (optional)

Um die App auf Firebase Hosting zu deployen:

```bash
# Projekt ID in .firebaserc eintragen (falls noch nicht geschehen)

# Hosting deployen
firebase deploy --only hosting

# Deine App ist jetzt live unter:
# https://DEINE-PROJEKT-ID.web.app
```

**Alternative: GitHub Pages**

Du kannst die App auch auf GitHub Pages hosten:

1. Erstelle ein GitHub Repository
2. Pushe alle Dateien
3. Gehe zu Repository Settings > Pages
4. Wähle den Branch (z.B. main) und den Ordner (root)
5. Deine App ist dann unter `https://DEIN-USERNAME.github.io/REPO-NAME/` verfügbar

## Verwendung

### Für Lehrpersonen

1. Öffne die App und klicke auf "Für Lehrpersonen"
2. Erstelle ein Konto mit deiner E-Mail-Adresse
3. **Einstellungen konfigurieren (Tab "Meine Termine"):**
   - Trage deinen Namen ein (z.B. "Frau Müller") - wird den Eltern angezeigt
   - Lege die Mindestanzahl der Termine fest (die Eltern auswählen müssen)
   - Optional: Aktiviere automatischen E-Mail-Versand (siehe unten)
4. Erstelle Termine im Tab "Meine Termine"
5. Kopiere den Link aus dem Tab "Link teilen"
6. Sende den Link per E-Mail an die Eltern
7. Warte auf die Antworten der Eltern (Tab "Eltern-Antworten")
   - Bei getrennten Eltern werden automatisch nur gemeinsame Termine angezeigt
   - Wenn beide Elternteile geantwortet haben, siehst du: "✓ 2 Elternteile haben geantwortet"
8. Weise die Termine zu (Tab "Zuteilung")
9. Lade E-Mail-Vorlagen und Kalender-Dateien herunter (oder automatischer Versand)

### Für Eltern

1. Öffne den Link, den du von der Lehrperson erhalten hast
2. **Mehrere Kinder erfassen (optional):**
   - Gib den Namen deines ersten Kindes ein
   - Klicke auf "➕ Weiteres Kind hinzufügen" für weitere Kinder
   - Alle Kinder bekommen die gleichen Termine
3. Gib deine E-Mail-Adresse ein
4. Wähle alle Termine aus, die für dich passen
5. Klicke auf "Verfügbarkeit absenden"
6. Der Link wird lokal gespeichert - beim nächsten Besuch auf der Startseite kommst du direkt zurück
7. Du erhältst eine Bestätigung per E-Mail, sobald die Lehrperson die Termine zugeteilt hat

### Besonderheit: Getrennte Eltern

Wenn beide Elternteile unabhängig voneinander das Formular ausfüllen:

**Beispiel: Anna's Eltern sind getrennt**
1. **Mutter füllt aus:** "Anna Müller" - wählt Termine [Mo 10:00, Di 14:00, Mi 16:00]
2. **Vater füllt aus:** "Anna Müller" - wählt Termine [Di 14:00, Mi 16:00, Do 11:00]
3. **Lehrperson sieht:** Nur die gemeinsamen Termine [Di 14:00, Mi 16:00]
4. **Lehrperson teilt zu:** z.B. Di 14:00
5. **Beide Eltern erhalten:** E-Mail mit Termin Di 14:00

➡️ Das System berechnet automatisch die Schnittmenge der verfügbaren Termine!

## Datenstruktur (Firestore)

### Collection: `termine`
```
{
  user_id: string (UID des Lehrers)
  datum: string (YYYY-MM-DD)
  zeit: string (HH:MM)
  dauer_minuten: number
  ist_verfuegbar: boolean
  created_at: timestamp
}
```

### Collection: `antworten`
```
{
  termin_gruppe_id: string (UID des Lehrers)
  kindname: string (veraltet, nur für Kompatibilität)
  email: string (veraltet, nur für Kompatibilität)
  kindname_encrypted: string (AES-256 verschlüsselter Kindname)
  email_encrypted: string (AES-256 verschlüsselte E-Mail)
  kindname_hash: string (SHA-256 Hash für Gruppierung)
  verfuegbare_termine: array (IDs der Termine)
  created_at: timestamp
}
```

**Hinweis:** Die Felder `kindname` und `email` bleiben für Rückwärtskompatibilität erhalten, werden aber von der neuen Version nicht mehr verwendet. Neue Einträge speichern nur die verschlüsselten Versionen.

### Collection: `zuteilungen`
```
{
  termin_id: string
  antwort_id: string
  status: string
  created_at: timestamp
}
```

### Collection: `settings`
```
{
  teacher_name: string (optional, Name der Lehrperson)
  min_termine_anzahl: number (Mindestanzahl Termine)
  auto_email_enabled: boolean (Auto-E-Mail aktiv?)
  absender_email: string (optional, eigene Absender-Adresse für E-Mails)
  updated_at: timestamp
}
```

### Collection: `mail` (Versand-Warteschlange)
Wird von der Firebase "Trigger Email" Extension verarbeitet und nach erfolgreichem Versand automatisch ergänzt:
```
{
  to: string | string[]            // Empfänger
  from: string (optional)          // Absender (sonst Extension-Default)
  replyTo: string                  // Antwort-an
  message: {
    subject: string
    text: string
    attachments: [{ filename, content, contentType }]
  }
  _meta: { lehrer_uid, termin_id, antwort_id, created_at }
  delivery: { state, ... }         // von der Extension ergänzt
}
```

### Collection: `encryption_keys`
```
{
  encryption_key: string (Base64-codierter AES-256 Schlüssel)
  created_at: timestamp
}
```

**Hinweis:** Document ID = Teacher UID. Jede Lehrperson hat einen eigenen Verschlüsselungskey.

## Sicherheit

- **Authentication:** Nur registrierte Lehrpersonen können Termine erstellen und verwalten
- **Firestore Rules:**
  - Lehrer können nur ihre eigenen Termine bearbeiten
  - Eltern können Antworten erstellen (ohne Login), aber nicht bearbeiten
  - Zuteilungen können nur von eingeloggten Lehrern erstellt werden
- **Datenverschlüsselung:**
  - Sensible Daten (Kindernamen und E-Mail-Adressen) werden **verschlüsselt** in Firestore gespeichert
  - Verwendet AES-256 Verschlüsselung (client-seitig)
  - Jede Lehrperson hat einen eigenen Verschlüsselungskey
  - Verschlüsselungskeys werden automatisch bei der Registrierung generiert
  - Für die Gruppierung von Antworten (z.B. getrennte Eltern) wird ein SHA-256 Hash verwendet
  - Die verschlüsselten Daten können nur von der zuständigen Lehrperson entschlüsselt werden

### Migration bestehender Daten

Falls Sie das Tool bereits verwenden und auf die neue verschlüsselte Version upgraden:

1. Loggen Sie sich als Lehrperson ein
2. Öffnen Sie `migrate-data.html` in Ihrem Browser
3. Klicken Sie auf "Migration starten"
4. Das Tool verschlüsselt automatisch alle bestehenden Antworten

**Hinweis:** Die Migration fügt verschlüsselte Felder hinzu, löscht aber die originalen Daten nicht. So bleibt die Kompatibilität erhalten.

## Technologie-Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Backend:** Firebase
  - Firebase Authentication (E-Mail/Passwort)
  - Cloud Firestore (NoSQL Datenbank)
  - Firebase Hosting (optional)

## Automatischer E-Mail-Versand (Optional)

Das Tool nutzt die offizielle **Firebase "Trigger Email" Extension** für den automatischen
E-Mail-Versand. Lehrpersonen müssen nichts mehr konfigurieren - das Setup erfolgt einmalig
zentral durch den Betreiber.

Der Code schreibt nach jeder Zuteilung Mail-Dokumente in die Firestore-Collection `mail`.
Die Extension versendet sie im Hintergrund via beliebigem SMTP-Server (empfohlen: das
Postfach des eigenen Web-Hosters, z.B. Hoststar / Hostpoint).

### Einmaliges Setup (durch Betreiber)

1. **Firebase-Projekt auf Blaze-Plan upgraden** (Pay-as-you-go; bei Schul-Volumen
   praktisch kostenlos, da Cloud-Functions-Free-Tier 2 Mio. Calls/Monat umfasst).

2. **SMTP-Postfach bereitstellen** - z.B. bei Hoststar im Control Panel ein Postfach
   wie `elterngespraech@deinedomain.ch` anlegen. SMTP-Daten von Hostpoint:
   - Server: `asmtp.mail.hostpoint.ch`
   - Port: `465` (SSL/TLS)
   - User: volle E-Mail-Adresse, Passwort: Postfach-Passwort

3. **Extension installieren** über Firebase Console → Extensions → Suche
   "Trigger Email from Firestore" (`firebase/firestore-send-email`). Konfiguration:
   - **Collection path:** `mail`
   - **SMTP connection URI:**
     `smtps://NAME%40DOMAIN.CH:PASSWORT@asmtp.mail.hostpoint.ch:465`
     (das `@` im Username als `%40` URL-encoden)
   - **Default FROM address:** `Elterngespräch <elterngespraech@deinedomain.ch>`
   - **Default REPLY-TO address:** leer lassen (wird pro Mail gesetzt)

4. **Firestore-Rules deployen** (siehe `firestore.rules`) - die `mail`-Collection
   muss für authentifizierte User schreibbar sein:
   ```
   firebase deploy --only firestore:rules
   ```

5. **Budget-Alarm einrichten** (Firebase Console → Budgets) - empfohlen CHF 5/Monat,
   schützt vor unerwartet hoher Nutzung.

### Versand-Limits (Hoststar/Hostpoint typisch)

- ~500 Mails/Tag pro Postfach
- ~50 Empfänger pro Mail
- Für eine Schule mit ~25 Familien × 2 Runden/Jahr (~50 Mails/Jahr) reicht das weit aus.

### Nutzung als Lehrperson

1. Im Dashboard unter Einstellungen die Option **"Automatischer E-Mail-Versand aktivieren"** anhaken.
2. Optional: eigene **Absender-E-Mail-Adresse** eintragen (Eltern sehen diese als Absender).
   Wenn leer, wird der Default aus der Extension-Konfiguration verwendet, und die Login-E-Mail
   der Lehrperson dient als "Antwort an".
3. Nach dem Speichern der Zuteilungen werden die E-Mails inkl. ICS-Anhang automatisch eingereiht.

### Alternative: Manuelle E-Mails

Wenn die Option deaktiviert ist:
- E-Mail-Vorlagen sind weiterhin verfügbar
- Kopiere den Text und sende manuell
- ICS-Dateien können einzeln heruntergeladen werden

## Troubleshooting

### Fehler: "Missing or insufficient permissions"
- Prüfe ob die Firestore Rules korrekt deployed sind
- Stelle sicher, dass du als Lehrer eingeloggt bist

### Fehler: "The query requires an index"
- Klicke auf den Link in der Browser-Konsole
- Oder deploye die Indexes mit `firebase deploy --only firestore:indexes`

### Termine werden nicht angezeigt
- Prüfe die Firebase Console > Firestore Database
- Stelle sicher, dass die Termine mit der richtigen `user_id` erstellt wurden

### Eltern können keine Antworten senden
- Prüfe die Firestore Rules
- Stelle sicher, dass die `antworten` Collection Schreibrechte für alle hat

## Weiterentwicklung

Mögliche Erweiterungen:

- E-Mail-Versand automatisieren (Firebase Cloud Functions)
- SMS-Benachrichtigungen
- Erinnerungen vor dem Termin
- Multi-Sprachen-Unterstützung
- Dark Mode
- Export in weitere Formate (PDF, etc.)

## Support

Bei Fragen oder Problemen:
1. Prüfe die Firebase Console für Fehler
2. Öffne die Browser-Konsole (F12) für JavaScript-Fehler
3. Prüfe die Firestore Rules und Indexes

## Lizenz

MIT License - Du kannst das Tool frei verwenden und anpassen.
