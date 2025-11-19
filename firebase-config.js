// ============================================
// FIREBASE KONFIGURATION
// ============================================

// WICHTIG: Ersetze diese Werte mit deinen eigenen aus Firebase Console!
// Gehe zu: Firebase Console > Projekteinstellungen > Deine Apps > SDK-Setup und -Konfiguration
const firebaseConfig = {
    apiKey: "DEIN_API_KEY",
    authDomain: "DEIN_PROJEKT.firebaseapp.com",
    projectId: "DEIN_PROJEKT_ID",
    storageBucket: "DEIN_PROJEKT.appspot.com",
    messagingSenderId: "DEINE_SENDER_ID",
    appId: "DEINE_APP_ID"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
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
