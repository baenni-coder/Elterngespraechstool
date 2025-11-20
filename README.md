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
  - Optionaler automatischer E-Mail-Versand (EmailJS)
  - E-Mail-Vorlagen und Kalender-Downloads (.ics)
  - CSV-Export für Mail-Merge

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
  teacher_name: string (optional, Name der Lehrperson)
  min_termine_anzahl: number (Mindestanzahl Termine)
  auto_email_enabled: boolean (Auto-E-Mail aktiv?)
  emailjs_service_id: string (optional, für E-Mail-Versand)
  emailjs_template_id: string (optional, für E-Mail-Versand)
  emailjs_public_key: string (optional, für E-Mail-Versand)
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
