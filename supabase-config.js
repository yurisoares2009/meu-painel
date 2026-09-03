// ==========================================
// MEU PAINEL
// CONEXÃO COM SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://ieserkcibstmcmemrozd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_RSJio7lPm_vl8kRxdfNjoA_goL05CQ4";

// Cria a conexão e deixa disponível para todo o sistema
window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

console.log("==========================================");
console.log("SUPABASE CONECTADO!");
console.log("URL:", SUPABASE_URL);
console.log("Cliente Supabase:", window.supabaseClient);
console.log("==========================================");