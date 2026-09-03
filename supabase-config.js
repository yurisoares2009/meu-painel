// ==========================================
// MEU PAINEL
// CONEXÃO COM SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://ieserkcibstmcmemrozd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_RSJio7lPm_vl8kRxdfNjoA_goL05CQ4";

// Cria o cliente Supabase
const clienteSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

// Disponibiliza para todo o sistema
window.supabaseClient = clienteSupabase;

// Também deixamos disponível como "supabase"
window.meuSupabase = clienteSupabase;

console.log("SUPABASE CONECTADO!");
console.log("Supabase disponível:", !!window.supabaseClient);
