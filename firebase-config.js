// ============================================
// FIREBASE KONFIGURATION
// ============================================

// WICHTIG: Ersetze diese Werte mit deinen eigenen aus Firebase Console!
// Gehe zu: Firebase Console > Projekteinstellungen > Deine Apps > SDK-Setup und -Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyCgowrNGd0TasK5QusQURdWBKRcB3vmCus",
  authDomain: "elterngespraechs-tool.firebaseapp.com",
  projectId: "elterngespraechs-tool",
  storageBucket: "elterngespraechs-tool.firebasestorage.app",
  messagingSenderId: "911556449022",
  appId: "1:911556449022:web:bd2f33cb4714538c438baf",
  measurementId: "G-QQQZH44E7H"
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
