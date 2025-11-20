# CLAUDE.md - Entwickler-Dokumentation für KI-Assistenten

Dieses Dokument enthält wichtige Informationen für KI-Assistenten, die bei der Weiterentwicklung dieses Projekts helfen.

## Projektübersicht

**Elterngesprächstool** - Ein Firebase-basiertes Koordinationssystem für Elterngespräche an Schulen.

### Kernfunktionalität
- Lehrpersonen erstellen Termine und verwalten Zuteilungen
- Eltern wählen Verfügbarkeiten aus (ohne Login)
- Automatische Berechnung gemeinsamer Termine bei getrennten Eltern
- Optionaler automatischer E-Mail-Versand (EmailJS)
- ICS-Kalender-Export und CSV-Export

## Technologie-Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend**: Firebase
  - Firebase Authentication (E-Mail/Passwort) - nur für Lehrpersonen
  - Cloud Firestore (NoSQL Database)
  - Firebase Hosting (optional)
- **Third-Party**: EmailJS für E-Mail-Versand (optional)
- **Locale**: Schweizer Deutsch (de-CH)

### Wichtige Dateien

```
/
├── index.html                  # Startseite (Login-Auswahl)
├── lehrer-login.html          # Login/Register für Lehrpersonen
├── lehrer-dashboard.html      # Hauptanwendung für Lehrpersonen
├── eltern-formular.html       # Formular für Eltern (kein Login)
├── firebase-config.js         # Firebase-Konfiguration & Helper
├── firestore.rules            # Sicherheitsregeln
├── firestore.indexes.json     # Composite Indexes
├── firebase.json              # Firebase Hosting Config
└── README.md                  # Benutzer-Dokumentation
```

## Architektur & Design-Entscheidungen

### 1. Authentifizierung
- **Lehrpersonen**: Firebase Authentication (E-Mail/Passwort)
- **Eltern**: KEIN Login erforderlich - öffnen Link mit `?teacher=<uid>`

### 2. Datenmodell (Firestore)

#### Collection: `termine`
```javascript
{
  user_id: string,           // UID der Lehrperson
  datum: string,             // "YYYY-MM-DD"
  zeit: string,              // "HH:MM"
  dauer_minuten: number,
  ist_verfuegbar: boolean,   // false wenn zugeteilt
  created_at: timestamp
}
```

#### Collection: `antworten`
```javascript
{
  termin_gruppe_id: string,      // UID der Lehrperson
  kindname: string,              // "Anna Müller"
  email: string,                 // Eltern-E-Mail
  verfuegbare_termine: [string], // Array von termin IDs
  created_at: timestamp
}
```

**Wichtig**: Bei mehreren Kindern oder getrennten Eltern werden MEHRERE Dokumente mit gleichem `kindname` erstellt.

#### Collection: `zuteilungen`
```javascript
{
  termin_id: string,
  antwort_id: string,
  status: "zugeteilt",
  created_at: timestamp
}
```

**Wichtig**: Bei getrennten Eltern werden MEHRERE Zuteilungen für denselben Termin erstellt (eine pro Elternteil).

#### Collection: `settings`
```javascript
{
  teacher_name: string | null,      // Optional: Name der Lehrperson
  min_termine_anzahl: number,       // Mindestanzahl Termine (Standard: 3)
  auto_email_enabled: boolean,      // Auto-E-Mail aktiv?
  emailjs_service_id: string,       // Optional
  emailjs_template_id: string,      // Optional
  emailjs_public_key: string,       // Optional
  updated_at: timestamp
}
```

Document ID = User UID der Lehrperson

### 3. Getrennte Eltern - Schnittmengen-Logik

**Kernkonzept**: Wenn mehrere Antworten mit gleichem `kindname` existieren, werden sie gruppiert und nur gemeinsame Termine angezeigt.

**Beispiel**:
```javascript
// Mutter füllt aus: "Anna Müller" - Termine [1, 2, 3]
{
  kindname: "Anna Müller",
  email: "mutter@example.com",
  verfuegbare_termine: ["termin-1", "termin-2", "termin-3"]
}

// Vater füllt aus: "Anna Müller" - Termine [2, 3, 4]
{
  kindname: "Anna Müller",
  email: "vater@example.com",
  verfuegbare_termine: ["termin-2", "termin-3", "termin-4"]
}

// Lehrperson sieht: Nur gemeinsame Termine [2, 3]
```

**Implementation** (in `lehrer-dashboard.html`):

1. **Gruppierung** (`loadAntworten` und `loadZuteilungsView`):
```javascript
const gruppierteAntworten = {};
allAntworten.forEach(antwort => {
  const kindname = antwort.kindname;
  if (!gruppierteAntworten[kindname]) {
    gruppierteAntworten[kindname] = [];
  }
  gruppierteAntworten[kindname].push(antwort);
});
```

2. **Schnittmenge berechnen**:
```javascript
if (antworten.length > 1) {
  // Mehrere Elternteile: Schnittmenge
  gemeinsameTermine = antworten[0].verfuegbare_termine.filter(terminId =>
    antworten.every(a => a.verfuegbare_termine.includes(terminId))
  );
} else {
  // Ein Elternteil: alle Termine
  gemeinsameTermine = antworten[0].verfuegbare_termine;
}
```

3. **Zuteilungen erstellen** (`saveZuteilungen`):
```javascript
// assignments = { kindname: terminId }
Object.entries(assignments).forEach(([kindname, terminId]) => {
  const gruppe = window.kinderGruppen[kindname];
  // Erstelle für JEDES Elternteil eine Zuteilung
  gruppe.antworten.forEach(antwort => {
    zuteilungenData.push({
      termin_id: terminId,
      antwort_id: antwort.id,
      status: 'zugeteilt'
    });
  });
});
```

### 4. Mehrere Kinder gleichzeitig

**Konzept**: Eltern können mehrere Kinder für die gleichen Termine erfassen.

**Implementation** (in `eltern-formular.html`):
- Dynamische Kinder-Liste mit "➕ Weiteres Kind hinzufügen" Button
- Beim Absenden wird für **jedes Kind** ein separates Dokument in `antworten` erstellt

```javascript
for (const kindname of kindnamen) {
  const dataToInsert = {
    termin_gruppe_id: teacherId,
    kindname: kindname,
    email: email,
    verfuegbare_termine: selectedTermine,
    created_at: firebase.firestore.FieldValue.serverTimestamp()
  };
  await db.collection('antworten').add(dataToInsert);
}
```

### 5. Assignments-Struktur

**Wichtig**: Die `assignments` Variable verwendet **Kindname als Key**, NICHT antwort_id!

```javascript
// RICHTIG:
assignments = {
  "Anna Müller": "termin-123",
  "Max Müller": "termin-456"
}

// FALSCH (alte Version):
assignments = {
  "antwort-abc": "termin-123",
  "antwort-def": "termin-456"
}
```

Dies ermöglicht die Gruppierung von getrennten Eltern unter dem gleichen Kindnamen.

### 6. E-Mail-Versand

**Automatisch** (optional, via EmailJS):
- Aktivierung in Einstellungen
- Wird nach `saveZuteilungen()` automatisch ausgeführt
- Sendet E-Mail an **alle Elternteile** in einer Gruppe
- Rate Limiting: 1 Sekunde zwischen E-Mails

**Manuell** (immer verfügbar):
- E-Mail-Vorlagen werden nach Zuteilung angezeigt
- ICS-Dateien für jedes Elternteil
- CSV-Export für Mail-Merge

### 7. LocalStorage

**Verwendung**: Speichert letzten verwendeten Link für einfachen Zugriff

```javascript
// Speichern (eltern-formular.html):
localStorage.setItem('elterngespraech_last_link', teacherId);

// Laden (index.html):
const lastTeacherId = localStorage.getItem('elterngespraech_last_link');
elternBtn.href = `eltern-formular.html?teacher=${lastTeacherId}`;
```

**Hinweis**: Nur der letzte Link wird gespeichert, NICHT mehrere Kinder-Links.

## Wichtige Funktionen

### lehrer-dashboard.html

#### `loadAntworten()`
- Lädt alle Antworten der Lehrperson
- Gruppiert nach `kindname`
- Berechnet gemeinsame Termine bei mehreren Eltern
- Zeigt "✓ 2 Elternteile haben geantwortet" wenn applicable

#### `loadZuteilungsView()`
- Erstellt `kinderGruppen` Objekt (global in `window`)
- Berechnet gemeinsame Termine für jede Gruppe
- Setzt `assignments` basierend auf existierenden Zuteilungen

#### `renderZuteilungsArea()`
- Iteriert über `kinderGruppen` (NICHT `allAntworten`)
- Zeigt nur gemeinsame Termine
- Zeigt alle E-Mail-Adressen bei mehreren Eltern

#### `saveZuteilungen()`
1. Löscht alte Zuteilungen
2. Erstellt neue Zuteilungen (für JEDEN Elternteil)
3. Aktualisiert Termin-Verfügbarkeit
4. Ruft `sendAutomaticEmails()` auf
5. Ruft `showEmailKalenderOptionen()` auf

#### `sendAutomaticEmails()`
- Iteriert über `assignments` (kindname → terminId)
- Sendet E-Mail an **alle Elternteile** in jeder Gruppe
- Gibt Status-Objekt zurück: `{ enabled, success, error }`

#### `showEmailKalenderOptionen(emailResult)`
- Zeigt E-Mail-Status an (wenn vorhanden)
- Erstellt für **jedes Elternteil** eine E-Mail-Vorlage
- Generiert ICS-Dateien

### eltern-formular.html

#### `loadTeacherName()`
- Lädt `teacher_name` aus Settings
- Zeigt "Lehrperson: {Name}" im Header
- Fallback: "Bitte wählen Sie Ihre verfügbaren Termine"

#### `submitForm()`
- Sammelt alle Kindnamen (dynamische Liste)
- Erstellt für **jedes Kind** einen separaten Eintrag
- Speichert Link im localStorage

#### `addKind()` / `removeKind()`
- Dynamisches Hinzufügen/Entfernen von Kinder-Eingabefeldern
- Mindestens 1 Kind muss vorhanden sein

## Firestore Security Rules

```javascript
match /termine/{terminId} {
  allow read: if true; // Public readable für Elternformular
  allow create: if isAuthenticated();
  allow update, delete: if isOwner(resource.data.user_id);
}

match /antworten/{antwortId} {
  allow read: if true;
  allow create: if true; // Eltern ohne Login
  allow update, delete: if false;
}

match /zuteilungen/{zuteilungId} {
  allow read: if true;
  allow create: if isAuthenticated();
  allow update: if isAuthenticated();
  allow delete: if isAuthenticated();
}

match /settings/{userId} {
  allow read: if true; // Public für Elternformular
  allow write: if isOwner(userId);
}
```

## Bekannte Besonderheiten

### 1. Tab-Reihenfolge
Die Tabs im Dashboard müssen in dieser Reihenfolge sein:
1. Meine Termine
2. Link teilen
3. Eltern-Antworten
4. Zuteilung
5. Verwaltung

Die `switchTab()` Funktion verwendet Indizes basierend auf dieser Reihenfolge.

### 2. Datumsformatierung
- Speicherformat: `"YYYY-MM-DD"` (String)
- Anzeige: Schweizer Format via `toLocaleDateString('de-CH')`
- Timezone: Europe/Zurich für ICS-Dateien

### 3. ICS-Datei Generierung
```javascript
const datum = new Date(termin.datum + 'T' + termin.zeit);
// WICHTIG: Concatenation mit 'T' für korrektes ISO Format
```

### 4. Batch Operations
Firestore Batches haben ein Limit von 500 Operationen. Bei großen Datenmengen muss dies berücksichtigt werden.

### 5. Empty Batch Check
```javascript
if (snapshot.docs.length > 0) {
  const batch = db.batch();
  // operations
  await batch.commit();
}
```
Firestore wirft Fehler bei leeren Batches - immer prüfen!

### 6. EmailJS Rate Limiting
1 Sekunde Pause zwischen E-Mails:
```javascript
await new Promise(resolve => setTimeout(resolve, 1000));
```

## Häufige Änderungsanfragen

### Feature: Neue Einstellung hinzufügen
1. Feld in `lehrer-dashboard.html` unter Einstellungen hinzufügen
2. In `loadSettings()` laden
3. In `saveSettings()` speichern
4. In Firestore Rules `settings` Collection prüfen

### Feature: Neue Daten in Antworten speichern
1. Feld in `eltern-formular.html` hinzufügen
2. In `submitForm()` zum `dataToInsert` Objekt hinzufügen
3. In `lehrer-dashboard.html` → `loadAntworten()` anzeigen

### Feature: E-Mail-Template ändern
1. In `showEmailKalenderOptionen()` den `emailText` anpassen
2. In EmailJS Dashboard das Template aktualisieren
3. In README.md die Template-Variablen dokumentieren

## Testing-Hinweise

### Test-Szenario: Getrennte Eltern
1. Lehrperson erstellt Termine [A, B, C, D]
2. Mutter füllt aus: "Test Kind" - wählt [A, B, C]
3. Vater füllt aus: "Test Kind" - wählt [B, C, D]
4. Im Dashboard sollte bei "Test Kind" erscheinen:
   - "✓ 2 Elternteile haben geantwortet"
   - Nur Termine [B, C] als Option

### Test-Szenario: Mehrere Kinder
1. Eltern öffnen Formular
2. Klicken "➕ Weiteres Kind hinzufügen"
3. Geben "Kind 1" und "Kind 2" ein
4. Wählen Termine
5. Im Dashboard sollten 2 separate Einträge erscheinen

## Migration Notes

### Von Supabase zu Firebase (2024)
- Ursprüngliche Version verwendete Supabase
- Migration zu Firebase wegen einfacherer Verwaltung
- Haupt-Änderungen:
  - `supabase.auth.signInWithPassword()` → `auth.signInWithEmailAndPassword()`
  - `supabase.from('table')` → `db.collection('table')`
  - `currentUser.id` → `currentUser.uid`

## Troubleshooting

### Problem: "Assignments is not iterable"
**Ursache**: Alte Code-Version verwendet `antwort_id` als Key
**Lösung**: Sicherstellen dass `assignments` `kindname` als Key verwendet

### Problem: E-Mails werden nicht versendet
**Prüfen**:
1. EmailJS Konfiguration in Settings korrekt?
2. `window.kinderGruppen` existiert?
3. Browser-Konsole für Fehler prüfen

### Problem: Gemeinsame Termine werden nicht angezeigt
**Prüfen**:
1. Ist `kindname` exakt gleich geschrieben?
2. Gruppierung in `loadAntworten()` korrekt?
3. Schnittmengen-Berechnung mit `.every()` korrekt?

## Zukünftige Erweiterungen

### Ideen für Features
- [ ] PDF-Export der Zuteilungen
- [ ] Erinnerungs-E-Mails vor Termin
- [ ] SMS-Benachrichtigungen
- [ ] Multi-Sprachen-Unterstützung
- [ ] Dark Mode
- [ ] Termin-Absagen durch Eltern
- [ ] Warteliste bei vollen Terminen

### Performance-Optimierungen
- [ ] Pagination bei vielen Terminen
- [ ] Lazy Loading der Antworten
- [ ] Caching von Settings im Frontend

## Code-Style Richtlinien

- **Variablen**: camelCase (z.B. `allTermine`, `kinderGruppen`)
- **Funktionen**: camelCase (z.B. `loadAntworten()`, `saveSettings()`)
- **Konstanten**: SCREAMING_SNAKE_CASE nicht verwendet
- **Kommentare**: Deutsch für User-Facing, Englisch für Code-Logik optional
- **Firestore Felder**: snake_case (z.B. `user_id`, `min_termine_anzahl`)
- **HTML IDs**: kebab-case (z.B. `eltern-formular`, `save-zuteilungen-btn`)

## Sicherheitshinweise

⚠️ **Wichtig**: Niemals Firebase Config (`apiKey`, `projectId`, etc.) in diesem Dokument speichern!

⚠️ **Wichtig**: EmailJS Keys sind client-side - keine sensitiven Daten im Template verwenden!

⚠️ **Wichtig**: Firestore Rules regelmäßig überprüfen, besonders bei neuen Collections!

## Letzte Updates

- **2024**: Migration von Supabase zu Firebase
- **2024**: Feature "Getrennte Eltern" implementiert
- **2024**: Feature "Mehrere Kinder" implementiert
- **2024**: Automatischer E-Mail-Versand (EmailJS) implementiert
- **2024**: Lehrperson-Name in Settings hinzugefügt
- **2024**: LocalStorage für letzten Link implementiert

---

**Hinweis für KI-Assistenten**: Bei Änderungen am Code immer prüfen:
1. Funktioniert die Schnittmengen-Logik noch?
2. Werden alle Elternteile bei E-Mail/ICS berücksichtigt?
3. Ist die `assignments` Struktur konsistent (kindname als Key)?
4. Sind die Firestore Rules aktualisiert?
5. Ist die README.md auf dem neuesten Stand?
