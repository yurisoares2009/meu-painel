// ==========================================
/// ==========================================
// MEU PAINEL
// CONEXÃO COM SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://ieserkcibstmcmemrozd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_RSJio7lPm_vl8kRxdfNjoA_goL05CQ4";


// ==========================================
// VERIFICAR BIBLIOTECA
// ==========================================

if (
    typeof window.supabase === "undefined"
) {

    console.error(
        "ERRO: A biblioteca do Supabase não foi carregada."
    );

} else {

    // ==========================================
    // CRIAR CLIENTE SUPABASE
    // ==========================================

    const clienteSupabase =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_PUBLISHABLE_KEY
        );


    // ==========================================
    // DISPONIBILIZAR PARA O SISTEMA
    // ==========================================

    window.supabaseClient =
        clienteSupabase;


    // ==========================================
    // CONFIRMAÇÃO
    // ==========================================

    console.log(
        "SUPABASE CONECTADO!"
    );

    console.log(
        "URL:",
        SUPABASE_URL
    );

    console.log(
        "Supabase disponível:",
        !!window.supabaseClient
    );
}