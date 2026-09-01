// ==========================================
// MEU PAINEL - JAVASCRIPT COMPLETO
// ==========================================


// ==========================================
// LOGIN
// ==========================================

function entrar() {

    const usuario = document.getElementById("usuario");
    const senha = document.getElementById("senha");
    const erro = document.getElementById("erro");

    if (!usuario || !senha) return;

    if (
        usuario.value === "admin" &&
        senha.value === "123456"
    ) {

        localStorage.setItem("logado", "sim");

        window.location.href = "painel.html";

    } else {

        if (erro) {
            erro.innerText = "Usuário ou senha incorretos.";
        }

    }

}


// ==========================================
// SAIR
// ==========================================

function sair() {

    localStorage.removeItem("logado");

    window.location.href = "index.html";

}


// ==========================================
// INÍCIO
// ==========================================

function mostrarInicio() {

    window.location.href = "painel.html";

}


// ==========================================
// MEUS SITES
// ==========================================

function mostrarSitesMenu() {

    window.location.href = "painel.html";

}


// ==========================================
// FINANCEIRO
// ==========================================

function abrirFinanceiro() {

    window.location.href = "financeiro.html";

}


// ==========================================
// NOVO SITE
// ==========================================

function novoSite() {

    localStorage.removeItem("siteEditando");

    window.location.href = "novo-site.html";

}


// ==========================================
// VOLTAR
// ==========================================

function voltar() {

    localStorage.removeItem("siteEditando");

    window.location.href = "painel.html";

}


// ==========================================
// CARREGAR CLIENTES NO CADASTRO DE SITE
// ==========================================

function carregarClientesNoSite() {

    const campoCliente =
        document.getElementById("clienteDoSite");

    if (!campoCliente) return;

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    campoCliente.innerHTML = "";

    const opcaoInicial =
        document.createElement("option");

    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione o cliente";

    campoCliente.appendChild(opcaoInicial);

    clientes.forEach(function(cliente, index) {

        const opcao =
            document.createElement("option");

        opcao.value = index;
        opcao.textContent = cliente.empresa;

        campoCliente.appendChild(opcao);

    });

}


// ==========================================
// SALVAR OU ATUALIZAR SITE
// ==========================================

function salvarOuAtualizar() {

    const campoCliente =
        document.getElementById("clienteDoSite");

    const campoNomeSite =
        document.getElementById("nomeSite");

    const campoUrl =
        document.getElementById("url");

    const campoCategoria =
        document.getElementById("categoria");

    const campoStatus =
        document.getElementById("status");

    const campoObservacoes =
        document.getElementById("observacoes");

    if (!campoCliente || !campoNomeSite || !campoUrl) {
        return;
    }

    const clienteIndex =
        campoCliente.value;

    const nomeSite =
        campoNomeSite.value.trim();

    const url =
        campoUrl.value.trim();

    const categoria =
        campoCategoria
        ? campoCategoria.value
        : "";

    const status =
        campoStatus
        ? campoStatus.value
        : "";

    const observacoes =
        campoObservacoes
        ? campoObservacoes.value.trim()
        : "";

    if (
        clienteIndex === "" ||
        nomeSite === "" ||
        url === ""
    ) {

        alert(
            "Selecione um cliente e preencha os campos obrigatórios."
        );

        return;

    }

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const cliente =
        clientes[Number(clienteIndex)];

    if (!cliente) {

        alert("Cliente não encontrado.");

        return;

    }

    let sites =
        JSON.parse(localStorage.getItem("sites")) || [];

    const index =
        localStorage.getItem("siteEditando");

    const site = {

        clienteIndex: Number(clienteIndex),

        clienteEmpresa: cliente.empresa,

        empresa: cliente.empresa,

        nomeSite: nomeSite,

        url: url,

        categoria: categoria,

        status: status,

        observacoes: observacoes,

        data: new Date().toLocaleDateString("pt-BR")

    };

    if (index !== null) {

        sites[Number(index)] = site;

        localStorage.removeItem("siteEditando");

        alert("Site atualizado com sucesso!");

    } else {

        sites.push(site);

        alert("Site cadastrado com sucesso!");

    }

    localStorage.setItem(
        "sites",
        JSON.stringify(sites)
    );

    window.location.href = "painel.html";

}


// ==========================================
// MOSTRAR SITES
// ==========================================

function mostrarSites() {

    const lista =
        document.getElementById("listaSites");

    if (!lista) return;

    const sites =
        JSON.parse(localStorage.getItem("sites")) || [];

    lista.innerHTML = "";

    if (sites.length === 0) {

        lista.innerHTML = `

            <div class="site">

                <h2>Nenhum site cadastrado</h2>

                <p>
                    Clique em "+ NOVO SITE"
                    para cadastrar seu primeiro site.
                </p>

            </div>

        `;

        return;

    }

    sites.forEach(function(site, index) {

        const card =
            document.createElement("div");

        card.className = "site";

        card.innerHTML = `

            <h2>
                ${site.empresa || site.clienteEmpresa || "Sem cliente"}
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

            <p>
                <strong>Cadastrado:</strong>
                ${site.data || ""}
            </p>

            ${
                site.observacoes
                ?
                `
                <p>
                    <strong>Observações:</strong>
                    <br>
                    ${site.observacoes}
                </p>
                `
                :
                ""
            }

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

        lista.appendChild(card);

    });

}


// ==========================================
// EDITAR SITE
// ==========================================

function editarSite(index) {

    localStorage.setItem(
        "siteEditando",
        index
    );

    window.location.href = "novo-site.html";

}


// ==========================================
// EXCLUIR SITE
// ==========================================

function excluirSite(index) {

    let sites =
        JSON.parse(localStorage.getItem("sites")) || [];

    if (
        !confirm(
            "Tem certeza que deseja excluir este site?"
        )
    ) {
        return;
    }

    sites.splice(index, 1);

    localStorage.setItem(
        "sites",
        JSON.stringify(sites)
    );

    mostrarSites();

    atualizarContadores();

}


// ==========================================
// CARREGAR SITE PARA EDIÇÃO
// ==========================================

function verificarEdicao() {

    const campoCliente =
        document.getElementById("clienteDoSite");

    if (!campoCliente) return;

    const index =
        localStorage.getItem("siteEditando");

    if (index === null) return;

    const sites =
        JSON.parse(localStorage.getItem("sites")) || [];

    const site =
        sites[Number(index)];

    if (!site) return;

    if (site.clienteIndex !== undefined) {

        campoCliente.value =
            site.clienteIndex;

    } else {

        const clientes =
            JSON.parse(localStorage.getItem("clientes")) || [];

        const clienteEncontrado =
            clientes.findIndex(function(cliente) {

                return (
                    cliente.empresa.toLowerCase() ===
                    (site.empresa || "").toLowerCase()
                );

            });

        if (clienteEncontrado !== -1) {

            campoCliente.value =
                clienteEncontrado;

        }

    }

    document.getElementById("nomeSite").value =
        site.nomeSite || "";

    document.getElementById("url").value =
        site.url || "";

    document.getElementById("categoria").value =
        site.categoria || "";

    document.getElementById("status").value =
        site.status || "";

    document.getElementById("observacoes").value =
        site.observacoes || "";

    const botoes =
        document.querySelectorAll("button");

    botoes.forEach(function(botao) {

        if (
            botao.innerText.includes("SALVAR SITE")
        ) {

            botao.innerText =
                "ATUALIZAR SITE";

        }

    });

}


// ==========================================
// CONTADORES DOS SITES
// ==========================================

function atualizarContadores() {

    const sites =
        JSON.parse(localStorage.getItem("sites")) || [];

    const total = sites.length;

    const online =
        sites.filter(function(site) {

            return (
                site.status &&
                site.status.includes("ONLINE")
            );

        }).length;

    const manutencao =
        sites.filter(function(site) {

            return (
                site.status &&
                site.status.includes("MANUTENÇÃO")
            );

        }).length;

    const offline =
        sites.filter(function(site) {

            return (
                site.status &&
                site.status.includes("OFFLINE")
            );

        }).length;

    const contadorSites =
        document.getElementById("contadorSites");

    const contadorOnline =
        document.getElementById("contadorOnline");

    const contadorManutencao =
        document.getElementById("contadorManutencao");

    const contadorOffline =
        document.getElementById("contadorOffline");

    if (contadorSites)
        contadorSites.innerText = total;

    if (contadorOnline)
        contadorOnline.innerText = online;

    if (contadorManutencao)
        contadorManutencao.innerText = manutencao;

    if (contadorOffline)
        contadorOffline.innerText = offline;

}


// ==========================================
// CLIENTES
// ==========================================

function abrirClientes() {

    window.location.href = "clientes.html";

}


// ==========================================
// NOVO CLIENTE
// ==========================================

function novoCliente() {

    localStorage.removeItem("clienteEditando");

    window.location.href = "novo-cliente.html";

}


// ==========================================
// SALVAR CLIENTE
// ==========================================

function salvarCliente() {

    const campoEmpresa =
        document.getElementById("clienteEmpresa");

    const campoResponsavel =
        document.getElementById("clienteResponsavel");

    if (!campoEmpresa || !campoResponsavel) {
        return;
    }

    const empresa =
        campoEmpresa.value.trim();

    const responsavel =
        campoResponsavel.value.trim();

    const campoTelefone =
        document.getElementById("clienteTelefone");

    const campoWhatsapp =
        document.getElementById("clienteWhatsapp");

    const campoEmail =
        document.getElementById("clienteEmail");

    const campoEndereco =
        document.getElementById("clienteEndereco");

    const campoObservacoes =
        document.getElementById("clienteObservacoes");

    const telefone =
        campoTelefone
        ? campoTelefone.value.trim()
        : "";

    const whatsapp =
        campoWhatsapp
        ? campoWhatsapp.value.trim()
        : "";

    const email =
        campoEmail
        ? campoEmail.value.trim()
        : "";

    const endereco =
        campoEndereco
        ? campoEndereco.value.trim()
        : "";

    const observacoes =
        campoObservacoes
        ? campoObservacoes.value.trim()
        : "";

    if (
        empresa === "" ||
        responsavel === ""
    ) {

        alert(
            "Preencha o nome da empresa e o responsável."
        );

        return;

    }

    let clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const index =
        localStorage.getItem("clienteEditando");

    const cliente = {

        empresa: empresa,

        responsavel: responsavel,

        telefone: telefone,

        whatsapp: whatsapp,

        email: email,

        endereco: endereco,

        observacoes: observacoes,

        data: new Date().toLocaleDateString("pt-BR")

    };

    if (index !== null) {

        clientes[Number(index)] = cliente;

        localStorage.removeItem("clienteEditando");

        alert("Cliente atualizado com sucesso!");

    } else {

        clientes.push(cliente);

        alert("Cliente cadastrado com sucesso!");

    }

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    window.location.href = "clientes.html";

}


// ==========================================
// MOSTRAR CLIENTES
// ==========================================

function mostrarClientes(clientesParaMostrar = null) {

    const lista =
        document.getElementById("listaClientes");

    if (!lista) return;

    const todosClientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const clientes =
        clientesParaMostrar !== null
        ? clientesParaMostrar
        : todosClientes;

    lista.innerHTML = "";

    if (clientes.length === 0) {

        lista.innerHTML = `

            <div class="site">

                <h2>Nenhum cliente encontrado</h2>

                <p>
                    Cadastre um cliente ou
                    altere a pesquisa.
                </p>

            </div>

        `;

        return;

    }

    clientes.forEach(function(cliente) {

        const index =
            todosClientes.indexOf(cliente);

        const card =
            document.createElement("div");

        card.className = "site";

        card.innerHTML = `

            <h2>
                ${cliente.empresa}
            </h2>

            <p>
                <strong>Responsável:</strong>
                ${cliente.responsavel}
            </p>

            ${
                cliente.telefone
                ?
                `
                <p>
                    <strong>Telefone:</strong>
                    ${cliente.telefone}
                </p>
                `
                :
                ""
            }

            ${
                cliente.whatsapp
                ?
                `
                <p>
                    <strong>WhatsApp:</strong>
                    ${cliente.whatsapp}
                </p>
                `
                :
                ""
            }

            ${
                cliente.email
                ?
                `
                <p>
                    <strong>E-mail:</strong>
                    ${cliente.email}
                </p>
                `
                :
                ""
            }

            ${
                cliente.endereco
                ?
                `
                <p>
                    <strong>Endereço:</strong>
                    ${cliente.endereco}
                </p>
                `
                :
                ""
            }

            <p>
                <strong>Cliente desde:</strong>
                ${cliente.data || ""}
            </p>

            ${
                cliente.observacoes
                ?
                `
                <p>
                    <strong>Observações:</strong>
                    <br>
                    ${cliente.observacoes}
                </p>
                `
                :
                ""
            }

            <div class="acoes">

                <button
                    onclick="abrirCliente(${index})"
                >
                    VER CLIENTE
                </button>

                ${
                    cliente.whatsapp
                    ?
                    `
                    <a
                        href="https://wa.me/55${cliente.whatsapp.replace(/\D/g, '')}"
                        target="_blank"
                    >
                        WHATSAPP
                    </a>
                    `
                    :
                    ""
                }

                <button
                    onclick="editarCliente(${index})"
                >
                    EDITAR
                </button>

                <button
                    onclick="excluirCliente(${index})"
                >
                    EXCLUIR
                </button>

            </div>

        `;

        lista.appendChild(card);

    });

}


// ==========================================
// PESQUISAR CLIENTES
// ==========================================

function pesquisarClientes() {

    const campo =
        document.getElementById("pesquisaCliente");

    if (!campo) return;

    const pesquisa =
        campo.value.toLowerCase().trim();

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    if (pesquisa === "") {

        mostrarClientes(clientes);

        return;

    }

    const resultados =
        clientes.filter(function(cliente) {

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

        });

    mostrarClientes(resultados);

}


// ==========================================
// ABRIR CLIENTE
// ==========================================

function abrirCliente(index) {

    localStorage.setItem(
        "clienteVisualizando",
        index
    );

    window.location.href = "cliente.html";

}


// ==========================================
// MOSTRAR DETALHES DO CLIENTE
// ==========================================

function mostrarDetalhesCliente() {

    const dados =
        document.getElementById("dadosCliente");

    const listaSites =
        document.getElementById("sitesDoCliente");

    if (!dados || !listaSites) return;

    const index =
        localStorage.getItem("clienteVisualizando");

    if (index === null) {

        dados.innerHTML = `

            <h2>Cliente não encontrado</h2>

            <p>
                Volte para a página de clientes.
            </p>

        `;

        return;

    }

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const cliente =
        clientes[Number(index)];

    if (!cliente) {

        dados.innerHTML = `
            <h2>Cliente não encontrado</h2>
        `;

        return;

    }

    dados.innerHTML = `

        <h1>
            ${cliente.empresa}
        </h1>

        <p>
            <strong>Responsável:</strong>
            ${cliente.responsavel}
        </p>

        ${
            cliente.telefone
            ?
            `
            <p>
                <strong>Telefone:</strong>
                ${cliente.telefone}
            </p>
            `
            :
            ""
        }

        ${
            cliente.whatsapp
            ?
            `
            <p>
                <strong>WhatsApp:</strong>
                ${cliente.whatsapp}
            </p>
            `
            :
            ""
        }

        ${
            cliente.email
            ?
            `
            <p>
                <strong>E-mail:</strong>
                ${cliente.email}
            </p>
            `
            :
            ""
        }

        ${
            cliente.endereco
            ?
            `
            <p>
                <strong>Endereço:</strong>
                ${cliente.endereco}
            </p>
            `
            :
            ""
        }

        <p>
            <strong>Cliente desde:</strong>
            ${cliente.data || ""}
        </p>

        ${
            cliente.observacoes
            ?
            `
            <p>
                <strong>Observações:</strong>
                <br>
                ${cliente.observacoes}
            </p>
            `
            :
            ""
        }

    `;


    // ==========================================
    // SITES DO CLIENTE
    // ==========================================

    const sites =
        JSON.parse(localStorage.getItem("sites")) || [];

    listaSites.innerHTML = "";

    const sitesCliente =
        sites.filter(function(site) {

            if (site.clienteIndex !== undefined) {

                return (
                    Number(site.clienteIndex) ===
                    Number(index)
                );

            }

            return (
                (site.empresa || "")
                    .toLowerCase()
                ===
                (cliente.empresa || "")
                    .toLowerCase()
            );

        });


    if (sitesCliente.length === 0) {

        listaSites.innerHTML = `

            <div class="site">

                <h2>Nenhum site cadastrado</h2>

                <p>
                    Ainda não existe nenhum site
                    cadastrado para este cliente.
                </p>

            </div>

        `;

    } else {

        sitesCliente.forEach(function(site) {

            const card =
                document.createElement("div");

            card.className = "site";

            card.innerHTML = `

                <h2>
                    ${site.nomeSite}
                </h2>

                <p>
                    <strong>Empresa:</strong>
                    ${site.empresa || cliente.empresa}
                </p>

                <p>
                    <strong>Categoria:</strong>
                    ${site.categoria || ""}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${site.status || ""}
                </p>

                <p>
                    <strong>Cadastrado:</strong>
                    ${site.data || ""}
                </p>

                ${
                    site.observacoes
                    ?
                    `
                    <p>
                        <strong>Observações:</strong>
                        <br>
                        ${site.observacoes}
                    </p>
                    `
                    :
                    ""
                }

                <div class="acoes">

                    <a
                        href="${site.url}"
                        target="_blank"
                    >
                        ABRIR SITE
                    </a>

                </div>

            `;

            listaSites.appendChild(card);

        });

    }


    // ==========================================
    // MOSTRAR FINANCEIRO DO CLIENTE
    // ==========================================

    mostrarFinanceiroDoCliente();

}


// ==========================================
// FINANCEIRO DO CLIENTE
// ==========================================

function mostrarFinanceiroDoCliente() {

    const lista =
        document.getElementById("financeiroDoCliente");

    if (!lista) return;

    const index =
        localStorage.getItem("clienteVisualizando");

    if (index === null) return;

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const cliente =
        clientes[Number(index)];

    if (!cliente) return;

    const pagamentos =
        JSON.parse(
            localStorage.getItem("financeiro")
        ) || [];


    // ==========================================
    // FILTRAR PAGAMENTOS
    // ==========================================

    const pagamentosCliente =
        pagamentos.filter(function(pagamento) {

            if (
                pagamento.clienteIndex !== undefined
            ) {

                return (
                    Number(pagamento.clienteIndex) ===
                    Number(index)
                );

            }

            return (
                (pagamento.cliente || "")
                    .toLowerCase()
                ===
                (cliente.empresa || "")
                    .toLowerCase()
            );

        });


    // ==========================================
    // TOTAIS
    // ==========================================

    let total = 0;
    let pago = 0;
    let pendente = 0;
    let atrasado = 0;


    pagamentosCliente.forEach(function(pagamento) {

        const valor =
            Number(pagamento.valor) || 0;

        total += valor;

        if (pagamento.status === "Pago") {
            pago += valor;
        }

        if (pagamento.status === "Pendente") {
            pendente += valor;
        }

        if (pagamento.status === "Atrasado") {
            atrasado += valor;
        }

    });


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
            formatarDinheiro(total);
    }

    if (campoPago) {
        campoPago.innerText =
            formatarDinheiro(pago);
    }

    if (campoPendente) {
        campoPendente.innerText =
            formatarDinheiro(pendente);
    }

    if (campoAtrasado) {
        campoAtrasado.innerText =
            formatarDinheiro(atrasado);
    }


    // ==========================================
    // LIMPAR LISTA
    // ==========================================

    lista.innerHTML = "";


    // ==========================================
    // NENHUM PAGAMENTO
    // ==========================================

    if (pagamentosCliente.length === 0) {

        lista.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum pagamento cadastrado
                </h2>

                <p>
                    Este cliente ainda não possui
                    pagamentos cadastrados.
                </p>

                <div class="acoes">

                    <button
                        onclick="novoPagamentoCliente(${index})"
                    >
                        + NOVO PAGAMENTO
                    </button>

                </div>

            </div>

        `;

        return;

    }


    // ==========================================
    // MOSTRAR PAGAMENTOS
    // ==========================================

    pagamentosCliente.forEach(function(pagamento) {

        const indiceReal =
            pagamentos.indexOf(pagamento);

        const card =
            document.createElement("div");

        card.className = "site";


        let simbolo = "🟡";

        if (pagamento.status === "Pago") {
            simbolo = "🟢";
        }

        if (pagamento.status === "Atrasado") {
            simbolo = "🔴";
        }


        card.innerHTML = `

            <h2>
                ${formatarDinheiro(pagamento.valor)}
            </h2>

            <p>
                <strong>Vencimento:</strong>
                ${formatarData(pagamento.vencimento)}
            </p>

            <p>
                <strong>Mês:</strong>
                ${formatarMes(pagamento.mes)}
            </p>

            <p>
                <strong>Status:</strong>
                ${simbolo} ${pagamento.status}
            </p>

            ${
                pagamento.observacoes
                ?
                `
                <p>
                    <strong>Observações:</strong>
                    <br>
                    ${pagamento.observacoes}
                </p>
                `
                :
                ""
            }

            <p>
                <strong>Cadastrado em:</strong>
                ${pagamento.dataCadastro || ""}
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

        lista.appendChild(card);

    });


    // ==========================================
    // BOTÃO NOVO PAGAMENTO
    // ==========================================

    const botaoNovo =
        document.createElement("div");

    botaoNovo.className = "site";

    botaoNovo.innerHTML = `

        <h2>
            💰 Novo pagamento
        </h2>

        <p>
            Cadastre uma nova cobrança para
            ${cliente.empresa}.
        </p>

        <div class="acoes">

            <button
                onclick="novoPagamentoCliente(${index})"
            >
                + NOVO PAGAMENTO
            </button>

        </div>

    `;

    lista.appendChild(botaoNovo);

}


// ==========================================
// NOVO PAGAMENTO PELO CLIENTE
// ==========================================

function novoPagamentoCliente(index) {

    localStorage.removeItem(
        "pagamentoEditando"
    );

    localStorage.setItem(
        "clienteParaPagamento",
        index
    );

    window.location.href =
        "novo-pagamento.html";

}


// ==========================================
// EDITAR CLIENTE
// ==========================================

function editarCliente(index) {

    localStorage.setItem(
        "clienteEditando",
        index
    );

    window.location.href =
        "novo-cliente.html";

}


// ==========================================
// EXCLUIR CLIENTE
// ==========================================

function excluirCliente(index) {

    let clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    if (
        !confirm(
            "Tem certeza que deseja excluir este cliente?"
        )
    ) {
        return;
    }

    clientes.splice(index, 1);

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    mostrarClientes();

}


// ==========================================
// CARREGAR CLIENTE PARA EDIÇÃO
// ==========================================

function verificarEdicaoCliente() {

    const campoEmpresa =
        document.getElementById("clienteEmpresa");

    if (!campoEmpresa) return;

    const index =
        localStorage.getItem("clienteEditando");

    if (index === null) return;

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const cliente =
        clientes[Number(index)];

    if (!cliente) return;

    document.getElementById("clienteEmpresa").value =
        cliente.empresa || "";

    document.getElementById("clienteResponsavel").value =
        cliente.responsavel || "";

    document.getElementById("clienteTelefone").value =
        cliente.telefone || "";

    document.getElementById("clienteWhatsapp").value =
        cliente.whatsapp || "";

    document.getElementById("clienteEmail").value =
        cliente.email || "";

    document.getElementById("clienteEndereco").value =
        cliente.endereco || "";

    document.getElementById("clienteObservacoes").value =
        cliente.observacoes || "";

    const botoes =
        document.querySelectorAll("button");

    botoes.forEach(function(botao) {

        if (
            botao.innerText.includes("SALVAR CLIENTE")
        ) {

            botao.innerText =
                "ATUALIZAR CLIENTE";

        }

    });

}


// ==========================================
// FINANCEIRO - FORMATAR VALOR
// ==========================================

function formatarDinheiro(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==========================================
// FINANCEIRO - CARREGAR CLIENTES
// ==========================================

function carregarClientesPagamento() {

    const campo =
        document.getElementById("clientePagamento");

    if (!campo) return;

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    campo.innerHTML = "";

    const inicial =
        document.createElement("option");

    inicial.value = "";
    inicial.textContent = "Selecione o cliente";

    campo.appendChild(inicial);

    clientes.forEach(function(cliente, index) {

        const opcao =
            document.createElement("option");

        opcao.value = index;
        opcao.textContent = cliente.empresa;

        campo.appendChild(opcao);

    });

}


// ==========================================
// FINANCEIRO - NOVO PAGAMENTO
// ==========================================

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


// ==========================================
// FINANCEIRO - SALVAR PAGAMENTO
// ==========================================

function salvarPagamento() {

    const campoCliente =
        document.getElementById("clientePagamento");

    const campoValor =
        document.getElementById("valorPagamento");

    const campoVencimento =
        document.getElementById("vencimentoPagamento");

    const campoMes =
        document.getElementById("mesPagamento");

    const campoStatus =
        document.getElementById("statusPagamento");

    const campoObservacoes =
        document.getElementById("observacoesPagamento");

    if (
        !campoCliente ||
        !campoValor ||
        !campoVencimento ||
        !campoMes ||
        !campoStatus
    ) {
        return;
    }

    const clienteIndex =
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
        clienteIndex === "" ||
        valor === "" ||
        vencimento === "" ||
        mes === "" ||
        status === ""
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;

    }

    const clientes =
        JSON.parse(localStorage.getItem("clientes")) || [];

    const cliente =
        clientes[Number(clienteIndex)];

    if (!cliente) {

        alert("Cliente não encontrado.");

        return;

    }

    let pagamentos =
        JSON.parse(
            localStorage.getItem("financeiro")
        ) || [];

    const index =
        localStorage.getItem("pagamentoEditando");

    const pagamento = {

        clienteIndex:
            Number(clienteIndex),

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
            new Date().toLocaleDateString("pt-BR")

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
        JSON.stringify(pagamentos)
    );

    window.location.href =
        "financeiro.html";

}


// ==========================================
// FINANCEIRO - MOSTRAR PAGAMENTOS
// ==========================================

function mostrarFinanceiro() {

    const lista =
        document.getElementById("listaFinanceiro");

    if (!lista) return;

    const pagamentos =
        JSON.parse(
            localStorage.getItem("financeiro")
        ) || [];

    let totalReceber = 0;
    let totalRecebido = 0;
    let totalPendente = 0;
    let totalAtrasado = 0;

    pagamentos.forEach(function(pagamento) {

        const valor =
            Number(pagamento.valor) || 0;

        totalReceber += valor;

        if (pagamento.status === "Pago") {
            totalRecebido += valor;
        }

        if (pagamento.status === "Pendente") {
            totalPendente += valor;
        }

        if (pagamento.status === "Atrasado") {
            totalAtrasado += valor;
        }

    });


    const totalReceberCampo =
        document.getElementById("totalReceber");

    const totalRecebidoCampo =
        document.getElementById("totalRecebido");

    const totalPendenteCampo =
        document.getElementById("totalPendente");

    const totalAtrasadoCampo =
        document.getElementById("totalAtrasado");


    if (totalReceberCampo) {

        totalReceberCampo.innerText =
            formatarDinheiro(totalReceber);

    }

    if (totalRecebidoCampo) {

        totalRecebidoCampo.innerText =
            formatarDinheiro(totalRecebido);

    }

    if (totalPendenteCampo) {

        totalPendenteCampo.innerText =
            formatarDinheiro(totalPendente);

    }

    if (totalAtrasadoCampo) {

        totalAtrasadoCampo.innerText =
            formatarDinheiro(totalAtrasado);

    }


    lista.innerHTML = "";


    if (pagamentos.length === 0) {

        lista.innerHTML = `

            <div class="site">

                <h2>
                    Nenhum pagamento cadastrado
                </h2>

                <p>
                    Clique em "+ NOVO PAGAMENTO"
                    para cadastrar um pagamento.
                </p>

            </div>

        `;

        return;

    }


    pagamentos.forEach(function(pagamento, index) {

        const card =
            document.createElement("div");

        card.className = "site";


        let simbolo = "🟡";

        if (pagamento.status === "Pago") {
            simbolo = "🟢";
        }

        if (pagamento.status === "Atrasado") {
            simbolo = "🔴";
        }


        card.innerHTML = `

            <h2>
                ${pagamento.cliente}
            </h2>

            <p>
                <strong>Valor:</strong>
                ${formatarDinheiro(pagamento.valor)}
            </p>

            <p>
                <strong>Vencimento:</strong>
                ${formatarData(pagamento.vencimento)}
            </p>

            <p>
                <strong>Mês:</strong>
                ${formatarMes(pagamento.mes)}
            </p>

            <p>
                <strong>Status:</strong>
                ${simbolo} ${pagamento.status}
            </p>

            ${
                pagamento.observacoes
                ?
                `
                <p>
                    <strong>Observações:</strong>
                    <br>
                    ${pagamento.observacoes}
                </p>
                `
                :
                ""
            }

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

        lista.appendChild(card);

    });

}


// ==========================================
// FINANCEIRO - FORMATAR DATA
// ==========================================

function formatarData(data) {

    if (!data) return "";

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


// ==========================================
// FINANCEIRO - FORMATAR MÊS
// ==========================================

function formatarMes(mes) {

    if (!mes) return "";

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
        Number(partes[1]);

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
// FINANCEIRO - EDITAR PAGAMENTO
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
// FINANCEIRO - EXCLUIR PAGAMENTO
// ==========================================

function excluirPagamento(index) {

    let pagamentos =
        JSON.parse(
            localStorage.getItem("financeiro")
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
        JSON.stringify(pagamentos)
    );

    mostrarFinanceiro();

}


// ==========================================
// FINANCEIRO - EXCLUIR PAGAMENTO DO CLIENTE
// ==========================================

function excluirPagamentoCliente(index) {

    let pagamentos =
        JSON.parse(
            localStorage.getItem("financeiro")
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
        JSON.stringify(pagamentos)
    );

    mostrarFinanceiroDoCliente();

}


// ==========================================
// FINANCEIRO - CARREGAR PAGAMENTO PARA EDIÇÃO
// ==========================================

function verificarEdicaoPagamento() {

    const campoCliente =
        document.getElementById("clientePagamento");

    if (!campoCliente) return;

    const index =
        localStorage.getItem(
            "pagamentoEditando"
        );

    if (index !== null) {

        const pagamentos =
            JSON.parse(
                localStorage.getItem("financeiro")
            ) || [];

        const pagamento =
            pagamentos[Number(index)];

        if (!pagamento) return;


        campoCliente.value =
            pagamento.clienteIndex;


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
            pagamento.status || "Pendente";


        const campoObservacoes =
            document.getElementById(
                "observacoesPagamento"
            );

        if (campoObservacoes) {

            campoObservacoes.value =
                pagamento.observacoes || "";

        }


        const botoes =
            document.querySelectorAll("button");

        botoes.forEach(function(botao) {

            if (
                botao.innerText.includes(
                    "SALVAR PAGAMENTO"
                )
            ) {

                botao.innerText =
                    "ATUALIZAR PAGAMENTO";

            }

        });

        return;

    }


    // ==========================================
    // SE VEIO DA FICHA DO CLIENTE
    // ==========================================

    const clienteParaPagamento =
        localStorage.getItem(
            "clienteParaPagamento"
        );

    if (
        clienteParaPagamento !== null
    ) {

        campoCliente.value =
            clienteParaPagamento;

    }

}


// ==========================================
// INICIAR SISTEMA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarClientesNoSite();

        carregarClientesPagamento();

        mostrarSites();

        mostrarClientes();

        mostrarDetalhesCliente();

        atualizarContadores();

        verificarEdicao();

        verificarEdicaoCliente();

        verificarEdicaoPagamento();

        mostrarFinanceiro();

    }
);