const SUPABASE_URL = "https://odyqmukkfeqvezspcexi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_dryK4dYSZB08VtnsxaS0RQ_71f9bzWZ";

if (!window.supabase) {
    console.error("La librería de Supabase no se ha cargado correctamente en el HTML.");
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);