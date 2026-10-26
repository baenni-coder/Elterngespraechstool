// ============================================
// FIREBASE-KONFIGURATION PRO VARIANTE
// ============================================

// Die aktive Variante bestimmt variante.js (Hostname). Fehlt variante.js (z.B. alte,
// noch im Browser-Cache liegende HTML-Datei), gilt sicherheitshalber die Eltern-Variante.
const AKTIVE_VARIANTE = typeof VARIANTE !== 'undefined' ? VARIANTE : 'eltern';

const VARIANTEN = {
    eltern: {
        // WICHTIG: Werte aus Firebase Console > Projekteinstellungen > Deine Apps > SDK-Setup und -Konfiguration
        firebaseConfig: {
            apiKey: "AIzaSyCgowrNGd0TasK5QusQURdWBKRcB3vmCus",
            authDomain: "elterngespraechs-tool.firebaseapp.com",
            projectId: "elterngespraechs-tool",
            storageBucket: "elterngespraechs-tool.firebasestorage.app",
            messagingSenderId: "911556449022",
            appId: "1:911556449022:web:bd2f33cb4714538c438baf",
            measurementId: "G-QQQZH44E7H"
        }
    },
    mag: {
        // Eigenes Firebase-Projekt "mag-planer" (Datenbank in europe-west6 / Zürich)
        firebaseConfig: {
            apiKey: "AIzaSyCW065CuXN2ZcOtu1K-zDzAu4n5XgoTFLQ",
            authDomain: "mag-planer.firebaseapp.com",
            projectId: "mag-planer",
            storageBucket: "mag-planer.firebasestorage.app",
            messagingSenderId: "793880233537",
            appId: "1:793880233537:web:9b4f03cf476b107e3568c0"
        }
    }
};

const firebaseConfig = VARIANTEN[AKTIVE_VARIANTE].firebaseConfig;

if (!firebaseConfig) {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.innerHTML = '<p style="padding: 40px; font-family: sans-serif; text-align: center;">Diese Instanz ist noch nicht eingerichtet.</p>';
    });
    throw new Error(`Keine Firebase-Konfiguration für Variante "${AKTIVE_VARIANTE}" hinterlegt.`);
}

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
auth.languageCode = 'de'; // Sprache der Firebase-Mails (z.B. Bestätigungslink)
const db = firebase.firestore();

// Hilfsfunktionen
const helpers = {
    // Datum formatieren
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('de-CH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Prüfe ob Benutzer eingeloggt ist
    checkAuth: () => {
        return new Promise((resolve) => {
            auth.onAuthStateChanged((user) => {
                resolve(user);
            });
        });
    },

    // Logout
    logout: async () => {
        await auth.signOut();
        window.location.href = 'index.html';
    }
};

// ============================================
// ENCRYPTION HELPER FUNCTIONS
// ============================================
const crypto = {
    /**
     * Generiert einen zufälligen AES-256 Verschlüsselungskey
     * @returns {string} Base64-codierter Encryption Key
     */
    generateEncryptionKey: () => {
        // Generiere 256-bit (32 Bytes) zufälligen Key
        const key = CryptoJS.lib.WordArray.random(32);
        return key.toString(CryptoJS.enc.Base64);
    },

    /**
     * Verschlüsselt Text mit AES-256
     * @param {string} text - Zu verschlüsselnder Text
     * @param {string} key - Base64-codierter Encryption Key
     * @returns {string} Verschlüsselter Text
     */
    encrypt: (text, key) => {
        if (!text || text === null || text === undefined) {
            return '';
        }
        const encrypted = CryptoJS.AES.encrypt(text, key);
        return encrypted.toString();
    },

    /**
     * Entschlüsselt AES-256 verschlüsselten Text
     * @param {string} ciphertext - Verschlüsselter Text
     * @param {string} key - Base64-codierter Encryption Key
     * @returns {string} Entschlüsselter Text
     */
    decrypt: (ciphertext, key) => {
        if (!ciphertext || ciphertext === null || ciphertext === undefined) {
            return '';
        }
        try {
            const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error('Decryption error:', error);
            return '';
        }
    },

    /**
     * Erstellt SHA-256 Hash (für Gruppierung nach Kindnamen)
     * @param {string} text - Zu hashender Text
     * @returns {string} SHA-256 Hash
     */
    hash: (text) => {
        if (!text || text === null || text === undefined) {
            return '';
        }
        // Normalisiere Text (lowercase, trim) für konsistente Hashes
        const normalized = text.toLowerCase().trim();
        const hash = CryptoJS.SHA256(normalized);
        return hash.toString(CryptoJS.enc.Hex);
    },

    /**
     * Lädt oder erstellt den Encryption Key für eine Lehrperson
     * @param {string} userId - Firebase User UID
     * @returns {Promise<string>} Encryption Key
     */
    getOrCreateEncryptionKey: async (userId) => {
        const keyDoc = await db.collection('encryption_keys').doc(userId).get();

        if (keyDoc.exists) {
            return keyDoc.data().encryption_key;
        } else {
            // Erstelle neuen Key
            const newKey = crypto.generateEncryptionKey();
            await db.collection('encryption_keys').doc(userId).set({
                encryption_key: newKey,
                created_at: firebase.firestore.FieldValue.serverTimestamp()
            });
            return newKey;
        }
    },

    /**
     * Lädt den Encryption Key einer Lehrperson (für Elternformular)
     * @param {string} teacherId - Firebase User UID der Lehrperson
     * @returns {Promise<string|null>} Encryption Key oder null
     */
    getEncryptionKey: async (teacherId) => {
        const keyDoc = await db.collection('encryption_keys').doc(teacherId).get();
        return keyDoc.exists ? keyDoc.data().encryption_key : null;
    }
};
