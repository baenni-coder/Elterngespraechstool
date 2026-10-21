# Tests der Firestore Security Rules

Prüft `firestore.rules` mit dem offiziellen Firebase-Emulator: Jeder Zugriff, den
die Seiten wirklich machen, muss erlaubt sein - Zugriffe auf fremde Daten,
unbestätigte Konten und fremde Domains müssen scheitern.

Voraussetzung: Node.js und Java (für den Emulator).

```bash
cd tests/firestore-rules
npm install
npm test
```

Erwartet: `Ergebnis: 48 korrekt, 0 falsch`. Nach jeder Änderung an `firestore.rules`
(oder an Abfragen im Code) ausführen und die Tests bei Bedarf ergänzen.
