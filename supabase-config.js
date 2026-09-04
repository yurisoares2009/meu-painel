// ==========================================
// MEU PAINEL
// CONEXÃO COM SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://ieserkcibstmcmemrozd.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_RSJio7lPm_vl8kRxdfNjoA_goL05CQ4";


// ==========================================
// INICIAR SUPABASE
// ==========================================

console.log("SUPABASE-CONFIG: iniciando...");


// Verificar se a biblioteca carregou

if (!window.supabase) {

    console.error(
        "SUPABASE-CONFIG: biblioteca do Supabase NÃO carregou."
    );

} else {

    console.log(
        "SUPABASE-CONFIG: biblioteca carregada."
    );


    try {

        // Criar conexão

        window.supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );


        // Confirmar conexão criada

        console.log(
            "SUPABASE-CONFIG: cliente criado."
        );

        console.log(
            "Supabase disponível:",
            !!window.supabaseClient
        );


    } catch (erro) {

        console.error(
            "SUPABASE-CONFIG: erro ao criar cliente:",
            erro
        );

    }

}