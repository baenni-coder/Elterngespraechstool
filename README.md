# Elterngesprächstool mit Firebase

Ein benutzerfreundliches Tool zur Koordination von Elterngesprächen. Lehrpersonen können Termine erstellen und Eltern können ihre Verfügbarkeit angeben - ganz ohne Login für Eltern!

## Features

- **Für Lehrpersonen:**
  - Termine erstellen und verwalten
  - Eltern-Antworten einsehen
  - Termine intelligent zuteilen
  - E-Mail-Vorlagen und Kalender-Downloads (.ics)
  - CSV-Export für Mail-Merge

- **Für Eltern:**
  - Einfache Terminauswahl ohne Login
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
3. Erstelle Termine im Tab "Meine Termine"
4. Kopiere den Link aus dem Tab "Link teilen"
5. Sende den Link per E-Mail an die Eltern
6. Warte auf die Antworten der Eltern (Tab "Eltern-Antworten")
7. Weise die Termine zu (Tab "Zuteilung")
8. Lade E-Mail-Vorlagen und Kalender-Dateien herunter

### Für Eltern

1. Öffne den Link, den du von der Lehrperson erhalten hast
2. Gib den Namen deines Kindes und deine E-Mail-Adresse ein
3. Wähle alle Termine aus, die für dich passen
4. Klicke auf "Verfügbarkeit absenden"
5. Du erhältst eine Bestätigung per E-Mail, sobald die Lehrperson die Termine zugeteilt hat

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
  kindname: string
  email: string
  verfuegbare_termine: array (IDs der Termine)
  created_at: timestamp
}
```

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
  min_termine_anzahl: number
  auto_email_enabled: boolean
  emailjs_service_id: string (optional)
  emailjs_template_id: string (optional)
  emailjs_public_key: string (optional)
  updated_at: timestamp
}
```

## Sicherheit

- **Authentication:** Nur registrierte Lehrpersonen können Termine erstellen und verwalten
- **Firestore Rules:**
  - Lehrer können nur ihre eigenen Termine bearbeiten
  - Eltern können Antworten erstellen (ohne Login), aber nicht bearbeiten
  - Zuteilungen können nur von eingeloggten Lehrern erstellt werden

## Technologie-Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS
- **Backend:** Firebase
  - Firebase Authentication (E-Mail/Passwort)
  - Cloud Firestore (NoSQL Datenbank)
  - Firebase Hosting (optional)

## Automatischer E-Mail-Versand (Optional)

Das Tool unterstützt optional automatischen E-Mail-Versand nach dem Zuteilen der Termine über **EmailJS**.

### EmailJS Setup

1. **Kostenloses Konto erstellen:**
   - Gehe zu [https://www.emailjs.com/](https://www.emailjs.com/)
   - Erstelle ein kostenloses Konto (200 E-Mails/Monat)

2. **E-Mail Service verbinden:**
   - Im Dashboard: Gehe zu **Email Services** > **Add New Service**
   - Wähle deinen E-Mail-Provider (Gmail, Outlook, etc.)
   - Folge den Anweisungen zur Verbindung

3. **E-Mail Template erstellen:**
   - Gehe zu **Email Templates** > **Create New Template**
   - Verwende folgende Template-Variablen:
     ```
     Betreff: Termin für Elterngespräch - {{to_name}}

     Guten Tag

     Hiermit bestätige ich den Termin für unser Elterngespräch:

     Kind: {{to_name}}
     Datum: {{termin_datum}}
     Uhrzeit: {{termin_zeit}} Uhr
     Dauer: {{termin_dauer}} Minuten

     Ich freue mich auf unser Gespräch.

     Mit freundlichen Grüssen
     {{lehrer_email}}
     ```
   - Speichere das Template und notiere die **Template ID**

4. **API Keys holen:**
   - Gehe zu **Account** > **General**
   - Kopiere deine **Public Key** (user_...)
   - Notiere die **Service ID** (service_...)

5. **Im Lehrer-Dashboard konfigurieren:**
   - Logge dich ein
   - Tab "Meine Termine" > Einstellungen
   - Aktiviere "Automatischer E-Mail-Versand"
   - Trage ein:
     - EmailJS Service ID
     - EmailJS Template ID
     - EmailJS Public Key
   - Klicke auf "Speichern"

### E-Mail Template Variablen

Das System sendet folgende Variablen an EmailJS:

| Variable | Beschreibung |
|----------|--------------|
| `to_email` | E-Mail-Adresse der Eltern |
| `to_name` | Name des Kindes |
| `termin_datum` | Formatiertes Datum (z.B. "Montag, 15. Januar 2024") |
| `termin_zeit` | Uhrzeit (z.B. "14:30") |
| `termin_dauer` | Dauer in Minuten (z.B. "30") |
| `lehrer_email` | Deine E-Mail-Adresse |

### Verwendung

Nach dem Setup werden E-Mails automatisch versendet, wenn du:
1. Termine zuteilst (Tab "Zuteilung")
2. Auf "Zuteilungen speichern" klickst
3. Der automatische E-Mail-Versand aktiviert ist

Du siehst eine Erfolgsmeldung mit der Anzahl versendeter E-Mails.

### Kosten

- EmailJS Free: 200 E-Mails/Monat kostenlos
- Für mehr E-Mails: Kostenpflichtige Pläne ab $7/Monat

### Alternative: Manuelle E-Mails

Wenn du keinen automatischen Versand möchtest:
- E-Mail-Vorlagen sind weiterhin verfügbar
- Kopiere den Text und sende manuell
- Oder verwende mailto-Links aus den E-Mail-Vorlagen

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
