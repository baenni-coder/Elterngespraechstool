// ============================================
// SUPABASE KONFIGURATION
// ============================================

// WICHTIG: Ersetze diese Werte mit deinen eigenen aus Supabase!
const SUPABASE_URL = 'https://rpgxmnqbxwkbfqyoftyx.supabase.co/'; // z.B. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwZ3htbnFieHdrYmZxeW9mdHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA3MzEsImV4cCI6MjA3NTQ3NjczMX0.pM2Zza8S9PBbf3OgcML0GVycakBW-6JjyqIdt0dEAvc'; // Der lange public/anon key

// Supabase Client initialisieren
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
    checkAuth: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Logout
    logout: async () => {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    }
};