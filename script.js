// ==========================================
// MEU PAINEL
// SISTEMA COMPLETO
// LOGIN SUPABASE + CLIENTES + SITES + FINANCEIRO
// ==========================================


// ==========================================
// VERIFICAR SUPABASE
// ==========================================

function bancoDisponivel() {

    return (
        typeof window.supabaseClient !== "undefined" &&
        window.supabaseClient !== null
    );

}


// ==========================================
// LOGIN
// ==========================================

async function entrar() {

    const usuario =
        document.getElementById("usuario");

    const senha =
        document.getElementById("senha");

    const erro =
        document.getElementById("erro");

    if (!usuario || !senha) {
        return;
    }

    const email =
        usuario.value.trim();

    const password =
        senha.value;

    if (!email || !password) {

        if (erro) {
            erro.innerText =
                "Digite seu e-mail e sua senha.";
        }

        return;
    }

    if (!bancoDisponivel()) {

        if (erro) {
            erro.innerText =
                "Banco de dados não conectado.";
        }

        console.error(
            "Supabase não disponível."
        );

        return;
    }

    try {

        if (erro) {
            erro.innerText =
                "Entrando...";
        }

        const { data, error } =
            await window.supabaseClient.auth.signInWithPassword({

                email: email,
                password: password

            });

        if (error) {

            console.error(
                "Erro no login:",
                error
            );

            if (erro) {
                erro.innerText =
                    "E-mail ou senha incorretos.";
            }

            return;
        }

        if (!data || !data.session) {

            if (erro) {
                erro.innerText =
                    "Não foi possível iniciar a sessão.";
            }

            return;
        }

        console.log(
            "LOGIN REALIZADO COM SUCESSO!"
        );

        window.location.href =
            "painel.html";

    } catch (error) {

        console.error(
            "Erro inesperado no login:",
            error
        );

        if (erro) {
            erro.innerText =
                "Erro ao entrar no painel.";
        }

    }

}


// ==========================================
// VERIFICAR LOGIN
// ==========================================

async function verificarLogin() {

    if (!bancoDisponivel()) {

        console.error(
            "Supabase não está disponível."
        );

        return false;
    }

    try {

        const { data, error } =
            await window.supabaseClient.auth.getSession();

        if (error) {

            console.error(
                "Erro ao verificar sessão:",
                error
            );

            return false;
        }

        if (!data || !data.session) {

            console.log(
                "Usuário não está logado."
            );

            window.location.href =
                "index.html";

            return false;
        }

        console.log(
            "Usuário autenticado:",
            data.session.user.email
        );

        return true;

    } catch (error) {

        console.error(
            "Erro ao verificar login:",
            error
        );

        return false;
    }

}


// ==========================================
// SAIR
// ==========================================

async function sair() {

    if (bancoDisponivel()) {

        try {

            await window.supabaseClient.auth.signOut();

        } catch (error) {

            console.error(
                "Erro ao sair:",
                error
            );

        }

    }

    localStorage.clear();

    window.location.href =
        "index.html";

}


// ==========================================
// NAVEGAÇÃO
// ==========================================

function mostrarInicio() {

    window.location.href =
        "painel.html";

}


function mostrarSitesMenu() {

    window.location.href =
        "painel.html";

}


function abrirFinanceiro() {

    window.location.href =
        "financeiro.html";

}


function abrirClientes() {

    window.location.href =
        "clientes.html";

}


function novoSite() {

    localStorage.removeItem(
        "siteEditando"
    );

    window.location.href =
        "novo-site.html";

}


function novoCliente() {

    localStorage.removeItem(
        "clienteEditandoId"
    );

    window.location.href =
        "novo-cliente.html";

}


function novoPagamento() {

    localStorage.removeItem(
        "pagamentoEditando"
    );

    localStorage.removeItem(
        "clienteParaPagamento"
    );

    window.location.href =
        "novo-pagamento.html";

}


function voltar() {

    localStorage.removeItem(
        "siteEditando"
    );

    localStorage.removeItem(
        "clienteEditandoId"
    );

    localStorage.removeItem(
        "pagamentoEditando"
    );

    window.location.href =
        "painel.html";

}


// ==========================================
// CLIENTES - SUPABASE
// ==========================================

async function carregarClientesDoBanco() {

    console.log(
        "================================="
    );

    console.log(
        "BUSCANDO CLIENTES NO SUPABASE"
    );

    console.log(
        "================================="
    );


    if (!bancoDisponivel()) {

        console.error(
            "ERRO: Supabase não está disponível nesta página."
        );

        return [];

    }


    try {

        const { data, error } =
            await window.supabaseClient
                .from("clientes")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(
                "================================="
            );

            console.error(
                "ERRO AO BUSCAR CLIENTES:"
            );

            console.error(
                error
            );

            console.error(
                "Mensagem:",
                error.message
            );

            console.error(
                "Detalhes:",
                error.details
            );

            console.error(
                "Código:",
                error.code
            );

            console.error(
                "================================="
            );

            alert(
                "Erro ao carregar clientes:\n\n" +
                error.message
            );

            return [];

        }


        console.log(
            "CLIENTES ENCONTRADOS:",
            data
        );

        console.log(
            "TOTAL DE CLIENTES:",
            data ? data.length : 0
        );


        return data || [];


    } catch (error) {

        console.error(
            "ERRO INESPERADO AO BUSCAR CLIENTES:",
            error
        );

        alert(
            "Erro ao carregar clientes:\n\n" +
            (
                error.message ||
                error
            )
        );

        return [];

    }

}


// ==========================================
// MOSTRAR CLIENTES
// ==========================================

async function mostrarClientes(
    clientesParaMostrar = null
) {

    const lista =
        document.getElementById(
            "listaClientes"
        );

    if (!lista) {
        return;
    }


    let clientes =
        clientesParaMostrar;


    if (clientes === null) {

        clientes =
            await carregarClientesDoBanco();

    }


    lista.innerHTML = "";


    if (!clientes || !clientes.length) {

        lista.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum cliente cadastrado
                </h2>

                <p>
                    Cadastre seu primeiro cliente.
                </p>

            </div>

        `;

        return;

    }


    clientes.forEach(
        function(cliente) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "site";


            const whatsapp =
                cliente.whatsapp
                    ? cliente.whatsapp.replace(
                        /\D/g,
                        ""
                    )
                    : "";


            card.innerHTML = `

                <h2>
                    ${cliente.empresa || ""}
                </h2>

                <p>
                    <strong>Responsável:</strong>
                    ${cliente.responsavel || ""}
                </p>

                ${
                    cliente.telefone
                        ? `
                        <p>
                            <strong>Telefone:</strong>
                            ${cliente.telefone}
                        </p>
                        `
                        : ""
                }

                ${
                    cliente.whatsapp
                        ? `
                        <p>
                            <strong>WhatsApp:</strong>
                            ${cliente.whatsapp}
                        </p>
                        `
                        : ""
                }

                ${
                    cliente.email
                        ? `
                        <p>
                            <strong>E-mail:</strong>
                            ${cliente.email}
                        </p>
                        `
                        : ""
                }

                ${
                    cliente.endereco
                        ? `
                        <p>
                            <strong>Endereço:</strong>
                            ${cliente.endereco}
                        </p>
                        `
                        : ""
                }

                ${
                    cliente.created_at
                        ? `
                        <p>
                            <strong>Cliente desde:</strong>
                            ${
                                new Date(
                                    cliente.created_at
                                ).toLocaleDateString(
                                    "pt-BR"
                                )
                            }
                        </p>
                        `
                        : ""
                }

                ${
                    cliente.observacoes
                        ? `
                        <p>
                            <strong>Observações:</strong><br>
                            ${cliente.observacoes}
                        </p>
                        `
                        : ""
                }

                <div class="acoes">

                    <button
                        onclick="abrirCliente('${cliente.id}')"
                    >
                        VER CLIENTE
                    </button>

                    ${
                        whatsapp
                            ? `
                            <a
                                href="https://wa.me/55${whatsapp}"
                                target="_blank"
                            >
                                WHATSAPP
                            </a>
                            `
                            : ""
                    }

                    <button
                        onclick="editarCliente('${cliente.id}')"
                    >
                        EDITAR
                    </button>

                    <button
                        onclick="excluirCliente('${cliente.id}')"
                    >
                        EXCLUIR
                    </button>

                </div>

            `;


            lista.appendChild(
                card
            );

        }
    );

}


// ==========================================
// PESQUISAR CLIENTES
// ==========================================

async function pesquisarClientes() {

    const campo =
        document.getElementById(
            "pesquisaCliente"
        );

    if (!campo) {
        return;
    }


    const pesquisa =
        campo.value
            .toLowerCase()
            .trim();


    const clientes =
        await carregarClientesDoBanco();


    if (!pesquisa) {

        mostrarClientes(
            clientes
        );

        return;
    }


    const resultados =
        clientes.filter(
            function(cliente) {

                return (

                    (cliente.empresa || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (cliente.responsavel || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (cliente.telefone || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (cliente.whatsapp || "")
                        .toLowerCase()
                        .includes(pesquisa)

                    ||

                    (cliente.email || "")
                        .toLowerCase()
                        .includes(pesquisa)

                );

            }
        );


    mostrarClientes(
        resultados
    );

}


// ==========================================
// ABRIR CLIENTE
// ==========================================

function abrirCliente(id) {

    localStorage.setItem(
        "clienteVisualizando",
        id
    );

    window.location.href =
        "cliente.html";

}


// ==========================================
// SALVAR CLIENTE
// ==========================================

async function salvarCliente() {

    const campoEmpresa =
        document.getElementById(
            "clienteEmpresa"
        );

    const campoResponsavel =
        document.getElementById(
            "clienteResponsavel"
        );


    if (
        !campoEmpresa ||
        !campoResponsavel
    ) {
        return;
    }


    const empresa =
        campoEmpresa.value.trim();


    const responsavel =
        campoResponsavel.value.trim();


    const telefone =
        document.getElementById(
            "clienteTelefone"
        )?.value.trim() || "";


    const whatsapp =
        document.getElementById(
            "clienteWhatsapp"
        )?.value.trim() || "";


    const email =
        document.getElementById(
            "clienteEmail"
        )?.value.trim() || "";


    const endereco =
        document.getElementById(
            "clienteEndereco"
        )?.value.trim() || "";


    const observacoes =
        document.getElementById(
            "clienteObservacoes"
        )?.value.trim() || "";


    if (
        !empresa ||
        !responsavel
    ) {

        alert(
            "Preencha o nome da empresa e o responsável."
        );

        return;
    }


    if (!bancoDisponivel()) {

        alert(
            "Supabase não está conectado."
        );

        return;
    }


    const clienteEditandoId =
        localStorage.getItem(
            "clienteEditandoId"
        );


    try {

        // ======================================
        // ATUALIZAR CLIENTE
        // ======================================

        if (clienteEditandoId) {

            const { error } =
                await window.supabaseClient
                    .from("clientes")
                    .update({

                        empresa,
                        responsavel,
                        telefone,
                        whatsapp,
                        email,
                        endereco,
                        observacoes

                    })
                    .eq(
                        "id",
                        clienteEditandoId
                    );


            if (error) {

                console.error(
                    "Erro ao atualizar:",
                    error
                );

                alert(
                    "Erro ao atualizar cliente:\n\n" +
                    error.message
                );

                return;
            }


            localStorage.removeItem(
                "clienteEditandoId"
            );


            alert(
                "Cliente atualizado com sucesso!"
            );


            window.location.href =
                "clientes.html";


            return;
        }


        // ======================================
        // NOVO CLIENTE
        // ======================================

        const { data, error } =
            await window.supabaseClient
                .from("clientes")
                .insert({

                    empresa,
                    responsavel,
                    telefone,
                    whatsapp,
                    email,
                    endereco,
                    observacoes

                })
                .select()
                .single();


        if (error) {

            console.error(
                "Erro ao cadastrar:",
                error
            );

            alert(
                "Erro ao cadastrar cliente:\n\n" +
                error.message
            );

            return;
        }


        console.log(
            "Cliente cadastrado:",
            data
        );


        alert(
            "Cliente cadastrado com sucesso!"
        );


        window.location.href =
            "clientes.html";


    } catch (error) {

        console.error(
            "Erro inesperado:",
            error
        );

        alert(
            "Erro ao conectar com o banco:\n\n" +
            (
                error.message ||
                error
            )
        );

    }

}


// ==========================================
// EDITAR CLIENTE
// ==========================================

function editarCliente(
    clienteId
) {

    localStorage.setItem(
        "clienteEditandoId",
        clienteId
    );

    window.location.href =
        "novo-cliente.html";

}


// ==========================================
// PREENCHER CLIENTE PARA EDIÇÃO
// ==========================================

async function verificarEdicaoCliente() {

    const campoEmpresa =
        document.getElementById(
            "clienteEmpresa"
        );


    if (!campoEmpresa) {
        return;
    }


    const clienteId =
        localStorage.getItem(
            "clienteEditandoId"
        );


    if (!clienteId) {
        return;
    }


    const clientes =
        await carregarClientesDoBanco();


    const cliente =
        clientes.find(
            function(item) {

                return String(
                    item.id
                ) === String(
                    clienteId
                );

            }
        );


    if (!cliente) {

        alert(
            "Cliente não encontrado."
        );

        return;
    }


    document.getElementById(
        "clienteEmpresa"
    ).value =
        cliente.empresa || "";


    document.getElementById(
        "clienteResponsavel"
    ).value =
        cliente.responsavel || "";


    document.getElementById(
        "clienteTelefone"
    ).value =
        cliente.telefone || "";


    document.getElementById(
        "clienteWhatsapp"
    ).value =
        cliente.whatsapp || "";


    document.getElementById(
        "clienteEmail"
    ).value =
        cliente.email || "";


    document.getElementById(
        "clienteEndereco"
    ).value =
        cliente.endereco || "";


    document.getElementById(
        "clienteObservacoes"
    ).value =
        cliente.observacoes || "";

}


// ==========================================
// EXCLUIR CLIENTE
// ==========================================

async function excluirCliente(
    clienteId
) {

    if (
        !confirm(
            "Tem certeza que deseja excluir este cliente?"
        )
    ) {
        return;
    }


    if (!bancoDisponivel()) {

        alert(
            "Supabase não está conectado."
        );

        return;
    }


    try {

        const { error } =
            await window.supabaseClient
                .from("clientes")
                .delete()
                .eq(
                    "id",
                    clienteId
                );


        if (error) {

            console.error(
                "Erro ao excluir:",
                error
            );

            alert(
                "Erro ao excluir cliente:\n\n" +
                error.message
            );

            return;
        }


        alert(
            "Cliente excluído com sucesso!"
        );


        await mostrarClientes();

    } catch (error) {

        console.error(
            "Erro:",
            error
        );

        alert(
            "Erro ao conectar com o banco:\n\n" +
            (
                error.message ||
                error
            )
        );

    }

}


// ==========================================
// DETALHES DO CLIENTE
// ==========================================

async function mostrarDetalhesCliente() {

    const dados =
        document.getElementById(
            "dadosCliente"
        );


    const listaSites =
        document.getElementById(
            "sitesDoCliente"
        );


    if (
        !dados ||
        !listaSites
    ) {
        return;
    }


    const clienteId =
        localStorage.getItem(
            "clienteVisualizando"
        );


    if (!clienteId) {

        dados.innerHTML = `

            <h2>
                Cliente não encontrado
            </h2>

            <p>
                Volte para a página de clientes.
            </p>

        `;

        return;
    }


    const clientes =
        await carregarClientesDoBanco();


    const cliente =
        clientes.find(
            function(item) {

                return String(
                    item.id
                ) === String(
                    clienteId
                );

            }
        );


    if (!cliente) {

        dados.innerHTML = `

            <h2>
                Cliente não encontrado
            </h2>

        `;

        return;
    }


    dados.innerHTML = `

        <h1>
            ${cliente.empresa || ""}
        </h1>

        <p>
            <strong>Responsável:</strong>
            ${cliente.responsavel || ""}
        </p>

        ${
            cliente.telefone
                ? `
                <p>
                    <strong>Telefone:</strong>
                    ${cliente.telefone}
                </p>
                `
                : ""
        }

        ${
            cliente.whatsapp
                ? `
                <p>
                    <strong>WhatsApp:</strong>
                    ${cliente.whatsapp}
                </p>
                `
                : ""
        }

        ${
            cliente.email
                ? `
                <p>
                    <strong>E-mail:</strong>
                    ${cliente.email}
                </p>
                `
                : ""
        }

        ${
            cliente.endereco
                ? `
                <p>
                    <strong>Endereço:</strong>
                    ${cliente.endereco}
                </p>
                `
                : ""
        }

        ${
            cliente.created_at
                ? `
                <p>
                    <strong>Cliente desde:</strong>
                    ${
                        new Date(
                            cliente.created_at
                        ).toLocaleDateString(
                            "pt-BR"
                        )
                    }
                </p>
                `
                : ""
        }

        ${
            cliente.observacoes
                ? `
                <p>
                    <strong>Observações:</strong><br>
                    ${cliente.observacoes}
                </p>
                `
                : ""
        }

    `;


    // ======================================
    // SITES DO CLIENTE
    // ======================================

    const sites =
        JSON.parse(
            localStorage.getItem(
                "sites"
            )
        ) || [];


    const sitesCliente =
        sites.filter(
            function(site) {

                return String(
                    site.clienteId
                ) === String(
                    cliente.id
                );

            }
        );


    listaSites.innerHTML = "";


    if (!sitesCliente.length) {

        listaSites.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum site cadastrado
                </h2>

                <p>
                    Ainda não existe nenhum
                    site cadastrado para este cliente.
                </p>

            </div>

        `;

    } else {

        sitesCliente.forEach(
            function(site) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "site";


                card.innerHTML = `

                    <h2>
                        ${site.nomeSite || ""}
                    </h2>

                    <p>
                        <strong>Empresa:</strong>
                        ${cliente.empresa}
                    </p>

                    <p>
                        <strong>Categoria:</strong>
                        ${site.categoria || ""}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${site.status || ""}
                    </p>

                    <div class="acoes">

                        <a
                            href="${site.url}"
                            target="_blank"
                        >
                            ABRIR SITE
                        </a>

                    </div>

                `;


                listaSites.appendChild(
                    card
                );

            }
        );

    }


    mostrarFinanceiroDoCliente(
        cliente
    );

}


// ==========================================
// CARREGAR CLIENTES PARA NOVO SITE
// ==========================================

async function carregarClientesNoSite() {

    const campoCliente =
        document.getElementById(
            "clienteDoSite"
        );


    if (!campoCliente) {
        return;
    }


    const clientes =
        await carregarClientesDoBanco();


    campoCliente.innerHTML = "";


    const inicial =
        document.createElement(
            "option"
        );


    inicial.value = "";


    inicial.textContent =
        "Selecione o cliente";


    campoCliente.appendChild(
        inicial
    );


    clientes.forEach(
        function(cliente) {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                cliente.id;


            opcao.textContent =
                cliente.empresa;


            campoCliente.appendChild(
                opcao
            );

        }
    );

}


// ==========================================
// SALVAR SITE
// ==========================================

async function salvarOuAtualizar() {

    const campoCliente =
        document.getElementById(
            "clienteDoSite"
        );


    const campoNomeSite =
        document.getElementById(
            "nomeSite"
        );


    const campoUrl =
        document.getElementById(
            "url"
        );


    if (
        !campoCliente ||
        !campoNomeSite ||
        !campoUrl
    ) {
        return;
    }


    const clienteId =
        campoCliente.value;


    const nomeSite =
        campoNomeSite.value.trim();


    const url =
        campoUrl.value.trim();


    const categoria =
        document.getElementById(
            "categoria"
        )?.value || "";


    const status =
        document.getElementById(
            "status"
        )?.value || "";


    const observacoes =
        document.getElementById(
            "observacoes"
        )?.value.trim() || "";


    if (
        !clienteId ||
        !nomeSite ||
        !url
    ) {

        alert(
            "Selecione um cliente e preencha os campos obrigatórios."
        );

        return;
    }


    const clientes =
        await carregarClientesDoBanco();


    const cliente =
        clientes.find(
            function(item) {

                return String(
                    item.id
                ) === String(
                    clienteId
                );

            }
        );


    if (!cliente) {

        alert(
            "Cliente não encontrado."
        );

        return;
    }


    let sites =
        JSON.parse(
            localStorage.getItem(
                "sites"
            )
        ) || [];


    const index =
        localStorage.getItem(
            "siteEditando"
        );


    const site = {

        clienteId:
            cliente.id,

        clienteEmpresa:
            cliente.empresa,

        empresa:
            cliente.empresa,

        nomeSite:
            nomeSite,

        url:
            url,

        categoria:
            categoria,

        status:
            status,

        observacoes:
            observacoes,

        data:
            new Date()
                .toLocaleDateString(
                    "pt-BR"
                )

    };


    if (index !== null) {

        sites[
            Number(index)
        ] = site;


        localStorage.removeItem(
            "siteEditando"
        );


        alert(
            "Site atualizado com sucesso!"
        );

    } else {

        sites.push(
            site
        );


        alert(
            "Site cadastrado com sucesso!"
        );

    }


    localStorage.setItem(
        "sites",
        JSON.stringify(
            sites
        )
    );


    window.location.href =
        "painel.html";

}


// ==========================================
// MOSTRAR SITES
// ==========================================

function mostrarSites() {

    const lista =
        document.getElementById(
            "listaSites"
        );


    if (!lista) {
        return;
    }


    const sites =
        JSON.parse(
            localStorage.getItem(
                "sites"
            )
        ) || [];


    lista.innerHTML = "";


    if (!sites.length) {

        lista.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum site cadastrado
                </h2>

                <p>
                    Clique em "+ NOVO SITE"
                    para cadastrar seu primeiro site.
                </p>

            </div>

        `;

        return;
    }


    sites.forEach(
        function(site, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "site";


            card.innerHTML = `

                <h2>
                    ${
                        site.empresa ||
                        site.clienteEmpresa ||
                        "Sem cliente"
                    }
                </h2>

                <p>
                    <strong>Site:</strong>
                    ${site.nomeSite || ""}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${site.categoria || ""}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${site.status || ""}
                </p>

                <div class="acoes">

                    <a
                        href="${site.url}"
                        target="_blank"
                    >
                        ABRIR SITE
                    </a>

                    <button
                        onclick="editarSite(${index})"
                    >
                        EDITAR
                    </button>

                    <button
                        onclick="excluirSite(${index})"
                    >
                        EXCLUIR
                    </button>

                </div>

            `;


            lista.appendChild(
                card
            );

        }
    );

}


// ==========================================
// EDITAR SITE
// ==========================================

function editarSite(index) {

    localStorage.setItem(
        "siteEditando",
        index
    );


    window.location.href =
        "novo-site.html";

}


// ==========================================
// EXCLUIR SITE
// ==========================================

function excluirSite(index) {

    let sites =
        JSON.parse(
            localStorage.getItem(
                "sites"
            )
        ) || [];


    if (
        !confirm(
            "Tem certeza que deseja excluir este site?"
        )
    ) {
        return;
    }


    sites.splice(
        index,
        1
    );


    localStorage.setItem(
        "sites",
        JSON.stringify(
            sites
        )
    );


    mostrarSites();

    atualizarContadores();

}


// ==========================================
// EDITAR SITE - PREENCHER
// ==========================================

function verificarEdicao() {

    const campoCliente =
        document.getElementById(
            "clienteDoSite"
        );


    if (!campoCliente) {
        return;
    }


    const index =
        localStorage.getItem(
            "siteEditando"
        );


    if (index === null) {
        return;
    }


    const sites =
        JSON.parse(
            localStorage.getItem(
                "sites"
            )
        ) || [];


    const site =
        sites[
            Number(index)
        ];


    if (!site) {
        return;
    }


    campoCliente.value =
        site.clienteId || "";


    document.getElementById(
        "nomeSite"
    ).value =
        site.nomeSite || "";


    document.getElementById(
        "url"
    ).value =
        site.url || "";


    document.getElementById(
        "categoria"
    ).value =
        site.categoria || "";


    document.getElementById(
        "status"
    ).value =
        site.status || "";


    document.getElementById(
        "observacoes"
    ).value =
        site.observacoes || "";

}


// ==========================================
// CONTADORES
// ==========================================

function atualizarContadores() {

    const sites =
        JSON.parse(
            localStorage.getItem(
                "sites"
            )
        ) || [];


    const total =
        sites.length;


    const online =
        sites.filter(
            function(site) {

                return (
                    site.status &&
                    site.status.includes(
                        "ONLINE"
                    )
                );

            }
        ).length;


    const manutencao =
        sites.filter(
            function(site) {

                return (
                    site.status &&
                    site.status.includes(
                        "MANUTENÇÃO"
                    )
                );

            }
        ).length;


    const offline =
        sites.filter(
            function(site) {

                return (
                    site.status &&
                    site.status.includes(
                        "OFFLINE"
                    )
                );

            }
        ).length;


    const contadorSites =
        document.getElementById(
            "contadorSites"
        );


    const contadorOnline =
        document.getElementById(
            "contadorOnline"
        );


    const contadorManutencao =
        document.getElementById(
            "contadorManutencao"
        );


    const contadorOffline =
        document.getElementById(
            "contadorOffline"
        );


    if (contadorSites) {

        contadorSites.innerText =
            total;

    }


    if (contadorOnline) {

        contadorOnline.innerText =
            online;

    }


    if (contadorManutencao) {

        contadorManutencao.innerText =
            manutencao;

    }


    if (contadorOffline) {

        contadorOffline.innerText =
            offline;

    }

}


// ==========================================
// FINANCEIRO
// ==========================================

function formatarDinheiro(valor) {

    return Number(
        valor || 0
    ).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function formatarData(data) {

    if (!data) {
        return "";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


function formatarMes(mes) {

    if (!mes) {
        return "";
    }


    const partes =
        mes.split("-");


    if (partes.length !== 2) {
        return mes;
    }


    const meses = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];


    const numero =
        Number(
            partes[1]
        );


    if (
        numero >= 1 &&
        numero <= 12
    ) {

        return (
            meses[numero - 1] +
            " de " +
            partes[0]
        );

    }


    return mes;

}


// ==========================================
// CLIENTES PARA PAGAMENTO
// ==========================================

async function carregarClientesPagamento() {

    const campo =
        document.getElementById(
            "clientePagamento"
        );


    if (!campo) {
        return;
    }


    const clientes =
        await carregarClientesDoBanco();


    campo.innerHTML = "";


    const inicial =
        document.createElement(
            "option"
        );


    inicial.value = "";


    inicial.textContent =
        "Selecione o cliente";


    campo.appendChild(
        inicial
    );


    clientes.forEach(
        function(cliente) {

            const opcao =
                document.createElement(
                    "option"
                );


            opcao.value =
                cliente.id;


            opcao.textContent =
                cliente.empresa;


            campo.appendChild(
                opcao
            );

        }
    );

}


// ==========================================
// NOVO PAGAMENTO DO CLIENTE
// ==========================================

function novoPagamentoCliente(
    clienteId
) {

    localStorage.removeItem(
        "pagamentoEditando"
    );


    localStorage.setItem(
        "clienteParaPagamento",
        clienteId
    );


    window.location.href =
        "novo-pagamento.html";

}


// ==========================================
// SALVAR PAGAMENTO
// ==========================================

async function salvarPagamento() {

    const campoCliente =
        document.getElementById(
            "clientePagamento"
        );


    const campoValor =
        document.getElementById(
            "valorPagamento"
        );


    const campoVencimento =
        document.getElementById(
            "vencimentoPagamento"
        );


    const campoMes =
        document.getElementById(
            "mesPagamento"
        );


    const campoStatus =
        document.getElementById(
            "statusPagamento"
        );


    const campoObservacoes =
        document.getElementById(
            "observacoesPagamento"
        );


    if (
        !campoCliente ||
        !campoValor ||
        !campoVencimento ||
        !campoMes ||
        !campoStatus
    ) {
        return;
    }


    const clienteId =
        campoCliente.value;


    const valor =
        campoValor.value;


    const vencimento =
        campoVencimento.value;


    const mes =
        campoMes.value;


    const status =
        campoStatus.value;


    const observacoes =
        campoObservacoes
            ? campoObservacoes.value.trim()
            : "";


    if (
        !clienteId ||
        !valor ||
        !vencimento ||
        !mes ||
        !status
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;
    }


    const clientes =
        await carregarClientesDoBanco();


    const cliente =
        clientes.find(
            function(item) {

                return String(
                    item.id
                ) === String(
                    clienteId
                );

            }
        );


    if (!cliente) {

        alert(
            "Cliente não encontrado."
        );

        return;
    }


    let pagamentos =
        JSON.parse(
            localStorage.getItem(
                "financeiro"
            )
        ) || [];


    const index =
        localStorage.getItem(
            "pagamentoEditando"
        );


    const pagamento = {

        clienteId:
            cliente.id,

        cliente:
            cliente.empresa,

        valor:
            Number(valor),

        vencimento:
            vencimento,

        mes:
            mes,

        status:
            status,

        observacoes:
            observacoes,

        dataCadastro:
            new Date()
                .toLocaleDateString(
                    "pt-BR"
                )

    };


    if (index !== null) {

        pagamentos[
            Number(index)
        ] = pagamento;


        localStorage.removeItem(
            "pagamentoEditando"
        );


        alert(
            "Pagamento atualizado com sucesso!"
        );

    } else {

        pagamentos.push(
            pagamento
        );


        alert(
            "Pagamento cadastrado com sucesso!"
        );

    }


    localStorage.removeItem(
        "clienteParaPagamento"
    );


    localStorage.setItem(
        "financeiro",
        JSON.stringify(
            pagamentos
        )
    );


    window.location.href =
        "financeiro.html";

}


// ==========================================
// MOSTRAR FINANCEIRO
// ==========================================

function mostrarFinanceiro() {

    const lista =
        document.getElementById(
            "listaFinanceiro"
        );


    if (!lista) {
        return;
    }


    const pagamentos =
        JSON.parse(
            localStorage.getItem(
                "financeiro"
            )
        ) || [];


    let totalReceber = 0;
    let totalRecebido = 0;
    let totalPendente = 0;
    let totalAtrasado = 0;


    pagamentos.forEach(
        function(pagamento) {

            const valor =
                Number(
                    pagamento.valor
                ) || 0;


            totalReceber +=
                valor;


            if (
                pagamento.status === "Pago"
            ) {

                totalRecebido +=
                    valor;

            }


            if (
                pagamento.status === "Pendente"
            ) {

                totalPendente +=
                    valor;

            }


            if (
                pagamento.status === "Atrasado"
            ) {

                totalAtrasado +=
                    valor;

            }

        }
    );


    const totalReceberCampo =
        document.getElementById(
            "totalReceber"
        );


    const totalRecebidoCampo =
        document.getElementById(
            "totalRecebido"
        );


    const totalPendenteCampo =
        document.getElementById(
            "totalPendente"
        );


    const totalAtrasadoCampo =
        document.getElementById(
            "totalAtrasado"
        );


    if (totalReceberCampo) {

        totalReceberCampo.innerText =
            formatarDinheiro(
                totalReceber
            );

    }


    if (totalRecebidoCampo) {

        totalRecebidoCampo.innerText =
            formatarDinheiro(
                totalRecebido
            );

    }


    if (totalPendenteCampo) {

        totalPendenteCampo.innerText =
            formatarDinheiro(
                totalPendente
            );

    }


    if (totalAtrasadoCampo) {

        totalAtrasadoCampo.innerText =
            formatarDinheiro(
                totalAtrasado
            );

    }


    lista.innerHTML = "";


    if (!pagamentos.length) {

        lista.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum pagamento cadastrado
                </h2>

                <p>
                    Clique em "+ NOVO PAGAMENTO"
                    para cadastrar.
                </p>

            </div>

        `;

        return;
    }


    pagamentos.forEach(
        function(pagamento, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "site";


            let simbolo =
                "🟡";


            if (
                pagamento.status === "Pago"
            ) {

                simbolo =
                    "🟢";

            }


            if (
                pagamento.status === "Atrasado"
            ) {

                simbolo =
                    "🔴";

            }


            card.innerHTML = `

                <h2>
                    ${pagamento.cliente || ""}
                </h2>

                <p>
                    <strong>Valor:</strong>
                    ${
                        formatarDinheiro(
                            pagamento.valor
                        )
                    }
                </p>

                <p>
                    <strong>Vencimento:</strong>
                    ${
                        formatarData(
                            pagamento.vencimento
                        )
                    }
                </p>

                <p>
                    <strong>Mês:</strong>
                    ${
                        formatarMes(
                            pagamento.mes
                        )
                    }
                </p>

                <p>
                    <strong>Status:</strong>
                    ${simbolo}
                    ${pagamento.status || ""}
                </p>

                <div class="acoes">

                    <button
                        onclick="editarPagamento(${index})"
                    >
                        EDITAR
                    </button>

                    <button
                        onclick="excluirPagamento(${index})"
                    >
                        EXCLUIR
                    </button>

                </div>

            `;


            lista.appendChild(
                card
            );

        }
    );

}


// ==========================================
// FINANCEIRO DO CLIENTE
// ==========================================

function mostrarFinanceiroDoCliente(
    cliente
) {

    const lista =
        document.getElementById(
            "financeiroDoCliente"
        );


    if (
        !lista ||
        !cliente
    ) {
        return;
    }


    const pagamentos =
        JSON.parse(
            localStorage.getItem(
                "financeiro"
            )
        ) || [];


    const pagamentosCliente =
        pagamentos.filter(
            function(pagamento) {

                return String(
                    pagamento.clienteId
                ) === String(
                    cliente.id
                );

            }
        );


    let total = 0;
    let pago = 0;
    let pendente = 0;
    let atrasado = 0;


    pagamentosCliente.forEach(
        function(pagamento) {

            const valor =
                Number(
                    pagamento.valor
                ) || 0;


            total +=
                valor;


            if (
                pagamento.status === "Pago"
            ) {

                pago +=
                    valor;

            }


            if (
                pagamento.status === "Pendente"
            ) {

                pendente +=
                    valor;

            }


            if (
                pagamento.status === "Atrasado"
            ) {

                atrasado +=
                    valor;

            }

        }
    );


    // CORREÇÃO:
    // replaceChildren não recebe texto.
    // Usamos innerText.

    const campoTotal =
        document.getElementById(
            "clienteTotalFinanceiro"
        );


    const campoPago =
        document.getElementById(
            "clienteTotalPago"
        );


    const campoPendente =
        document.getElementById(
            "clienteTotalPendente"
        );


    const campoAtrasado =
        document.getElementById(
            "clienteTotalAtrasado"
        );


    if (campoTotal) {

        campoTotal.innerText =
            formatarDinheiro(
                total
            );

    }


    if (campoPago) {

        campoPago.innerText =
            formatarDinheiro(
                pago
            );

    }


    if (campoPendente) {

        campoPendente.innerText =
            formatarDinheiro(
                pendente
            );

    }


    if (campoAtrasado) {

        campoAtrasado.innerText =
            formatarDinheiro(
                atrasado
            );

    }


    lista.innerHTML = "";


    if (!pagamentosCliente.length) {

        lista.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum pagamento cadastrado
                </h2>

                <p>
                    Este cliente ainda não possui pagamentos.
                </p>

                <div class="acoes">

                    <button
                        onclick="novoPagamentoCliente('${cliente.id}')"
                    >
                        + NOVO PAGAMENTO
                    </button>

                </div>

            </div>

        `;

        return;
    }


    pagamentosCliente.forEach(
        function(pagamento) {

            const indiceReal =
                pagamentos.indexOf(
                    pagamento
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "site";


            card.innerHTML = `

                <h2>
                    ${
                        formatarDinheiro(
                            pagamento.valor
                        )
                    }
                </h2>

                <p>
                    <strong>Vencimento:</strong>
                    ${
                        formatarData(
                            pagamento.vencimento
                        )
                    }
                </p>

                <p>
                    <strong>Mês:</strong>
                    ${
                        formatarMes(
                            pagamento.mes
                        )
                    }
                </p>

                <p>
                    <strong>Status:</strong>
                    ${pagamento.status || ""}
                </p>

                <div class="acoes">

                    <button
                        onclick="editarPagamento(${indiceReal})"
                    >
                        EDITAR
                    </button>

                    <button
                        onclick="excluirPagamentoCliente(${indiceReal})"
                    >
                        EXCLUIR
                    </button>

                </div>

            `;


            lista.appendChild(
                card
            );

        }
    );


    const novo =
        document.createElement(
            "div"
        );


    novo.className =
        "site";


    novo.innerHTML = `

        <h2>
            💰 Novo pagamento
        </h2>

        <div class="acoes">

            <button
                onclick="novoPagamentoCliente('${cliente.id}')"
            >
                + NOVO PAGAMENTO
            </button>

        </div>

    `;


    lista.appendChild(
        novo
    );

}


// ==========================================
// EDITAR PAGAMENTO
// ==========================================

function editarPagamento(index) {

    localStorage.setItem(
        "pagamentoEditando",
        index
    );


    window.location.href =
        "novo-pagamento.html";

}


// ==========================================
// EXCLUIR PAGAMENTO
// ==========================================

function excluirPagamento(index) {

    let pagamentos =
        JSON.parse(
            localStorage.getItem(
                "financeiro"
            )
        ) || [];


    if (
        !confirm(
            "Tem certeza que deseja excluir este pagamento?"
        )
    ) {
        return;
    }


    pagamentos.splice(
        index,
        1
    );


    localStorage.setItem(
        "financeiro",
        JSON.stringify(
            pagamentos
        )
    );


    mostrarFinanceiro();

}


// ==========================================
// EXCLUIR PAGAMENTO DO CLIENTE
// ==========================================

function excluirPagamentoCliente(index) {

    let pagamentos =
        JSON.parse(
            localStorage.getItem(
                "financeiro"
            )
        ) || [];


    if (
        !confirm(
            "Tem certeza que deseja excluir este pagamento?"
        )
    ) {
        return;
    }


    pagamentos.splice(
        index,
        1
    );


    localStorage.setItem(
        "financeiro",
        JSON.stringify(
            pagamentos
        )
    );


    mostrarDetalhesCliente();

}


// ==========================================
// EDITAR PAGAMENTO - PREENCHER
// ==========================================

function verificarEdicaoPagamento() {

    const campoCliente =
        document.getElementById(
            "clientePagamento"
        );


    if (!campoCliente) {
        return;
    }


    const index =
        localStorage.getItem(
            "pagamentoEditando"
        );


    if (index !== null) {

        const pagamentos =
            JSON.parse(
                localStorage.getItem(
                    "financeiro"
                )
            ) || [];


        const pagamento =
            pagamentos[
                Number(index)
            ];


        if (!pagamento) {
            return;
        }


        campoCliente.value =
            pagamento.clienteId || "";


        document.getElementById(
            "valorPagamento"
        ).value =
            pagamento.valor || "";


        document.getElementById(
            "vencimentoPagamento"
        ).value =
            pagamento.vencimento || "";


        document.getElementById(
            "mesPagamento"
        ).value =
            pagamento.mes || "";


        document.getElementById(
            "statusPagamento"
        ).value =
            pagamento.status ||
            "Pendente";


        const campoObservacoes =
            document.getElementById(
                "observacoesPagamento"
            );


        if (campoObservacoes) {

            campoObservacoes.value =
                pagamento.observacoes || "";

        }


        return;
    }


    const clienteParaPagamento =
        localStorage.getItem(
            "clienteParaPagamento"
        );


    if (clienteParaPagamento) {

        campoCliente.value =
            clienteParaPagamento;

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "=========================================="
        );

        console.log(
            "MEU PAINEL INICIADO"
        );

        console.log(
            "Supabase disponível:",
            bancoDisponivel()
        );

        console.log(
            "=========================================="
        );


        // ======================================
        // PÁGINA DE LOGIN
        // ======================================

        const campoUsuario =
            document.getElementById(
                "usuario"
            );


        const campoSenha =
            document.getElementById(
                "senha"
            );


        if (
            campoUsuario &&
            campoSenha
        ) {

            console.log(
                "Página de login carregada."
            );

            return;
        }


        // ======================================
        // OUTRAS PÁGINAS
        // ======================================

        const logado =
            await verificarLogin();


        if (!logado) {
            return;
        }


        // ======================================
        // CARREGAR SISTEMA
        // ======================================

        await carregarClientesNoSite();

        await carregarClientesPagamento();

        await mostrarClientes();

        await mostrarDetalhesCliente();

        mostrarSites();

        mostrarFinanceiro();

        atualizarContadores();

        verificarEdicao();

        await verificarEdicaoCliente();

        verificarEdicaoPagamento();


        console.log(
            "PAINEL CARREGADO COM USUÁRIO AUTENTICADO."
        );

    }
);