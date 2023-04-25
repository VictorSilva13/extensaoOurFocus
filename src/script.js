//Aba Bloqueador
const bloqueador = document.getElementById("bloquear");
const inputBloqueador = document.getElementById("inputBloqueador");
inputBloqueador.addEventListener("click", fnBlockTabs);
const abaBloqueador = document.getElementById("aba-bloqueador");
const messagemInicial = document.getElementById("opcaoAtivada");
const sair = document.getElementById("sair");

//Aba BlockList
const botaoMostrarBlockList = document.getElementById("blocklist");
const abaBlockList = document.getElementById("aba-blockList");
const textInputBlockList = document.getElementById("entradaBlockList");
const sendBlockList = document.getElementById("enviarBL");
const ativaBlockList = document.getElementById("inputBlockList");

//Aba WhiteList
const botaoMostrarWhiteList = document.getElementById("whitelist");
const abaWhiteList = document.getElementById("aba-whitelist");
const textInputWhiteList = document.getElementById("entradaWhiteList");
const sendWhiteList = document.getElementById("enviarWL");
const ativaWhiteList = document.getElementById("inputWhiteList");

//Tabela do popup na aba blocklist
const tabelaBlockList = document.getElementById("tabela-blockList");
const tabelaWhiteList = document.getElementById("tabela-whiteList");

//Pergunta interativa de cada função
const desejoTitle = document.getElementById("desejoTitle");

sair.addEventListener("click", function () {
    window.close();
})

//Carrega a lista de sites da variavel UrlsBlockList
function carregarLista(tipoLista) {
    if (tipoLista === "BL") {
        urlsBlockList.forEach(site => {
            listarNovoSite(site, "BL");
        });
    } else {
        urlsWhiteList.forEach(site => {
            listarNovoSite(site, "WL");
        });
    }

}

//Mostra novo site dentro da tabela do popup na aba BlockList
function listarNovoSite(site, tipo) {
    const linha = document.createElement("tr");
    const coluna = document.createElement("td");

    const coluna2 = document.createElement("td");
    var botao = document.createElement("button");
    botao.id = "botaoExcluirURL";
    botao.title = "Excluir URL";
    botao.innerHTML = '<img src= "img/lixo.png"/>';
    botao.addEventListener("click", function () {
        excluirSite(site, tipo);
    });

    const text = document.createTextNode(site);
    coluna.appendChild(text);
    coluna2.appendChild(botao);

    linha.appendChild(coluna);
    linha.appendChild(coluna2);

    if (tipo === "BL") {
        tabelaBlockList.appendChild(linha);
    } else {
        tabelaWhiteList.appendChild(linha);
    }

}

function excluirSite(site, tipo) {
    var index = -1;


    if(tipo === "BL"){
        var linhas = tabelaBlockList.rows;
    }else{
        var linhas = tabelaWhiteList.rows;
    }


    for (var i = 0; i < linhas.length; i++) {
        if (linhas[i].cells[0].textContent === site) {
            index = i;
            break;
        }
    }

    console.log("Excluir Site: " + site);
    console.log("Index: " + index);
    //console.log("Antes de remover: " + urlsBlockList);

    if (index !== -1) {
        
        if(tipo === "BL"){
            tabelaBlockList.deleteRow(index);
            urlsBlockList.splice(index-1, 1);
            chrome.runtime.sendMessage({ modo: "atualizarBL", urls: urlsBlockList });
        }else{
            tabelaWhiteList.deleteRow(index);
            urlsWhiteList.splice(index-1, 1);
            chrome.runtime.sendMessage({ modo: "atualizarWL", urls: urlsWhiteList });
        }
        
    }

    //console.log("Depois de remover: " + urlsBlockList);

}

var urlsBlockList = [];
var temosUrls = false;

sendBlockList.addEventListener("click", function () {
    addUrl("BL");
});
sendWhiteList.addEventListener("click", function () {
    addUrl("WL");
});


//Se o usuario digitar enter, a URL sera adicionada
textInputBlockList.addEventListener("keypress",
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addUrl("BL");
        }
    });

textInputWhiteList.addEventListener("keypress",
    function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addUrl("WL");
        }
    });


//CONTADOR PARA ANALISAR ESTADO DO BOTÃO DO BLOQUEADOR DE GUIA
var contBloqueadorDeGuia = -1;

//QUANDO O POPUP FOR INICIADO ELE SOLICITA O ESTADO DO BOTÃO ANTES DO ULTIMO FECHAMENTO
chrome.runtime.sendMessage({ pergunta: "estadoBloqueadorFechado" }, function (response) {
    if (response.estadoAfterClosed === "EstavaAtivado") {
        contBloqueadorDeGuia = 0
        inputBloqueador.checked = true;
        ativaBlockList.checked = false;
        ativaWhiteList.checked = false;
        messagemInicial.innerHTML = `Bloqueador de Guia Ativado! <br> <h4>Lembre-se de pressionar F5 na página que deseja focar.</h4>`;
    } else {
        inputBloqueador.checked = false;
        messagemInicial.innerHTML = ``;
        contBloqueadorDeGuia = -1
    }
});

function fnBlockTabs() {
    contBloqueadorDeGuia++;

    if (contBloqueadorDeGuia % 2 === 0) {
        messagemInicial.innerHTML = `Bloqueador de Guia Ativado! <br> <h4>Lembre-se de pressionar F5 na página que deseja focar.</h4>`;
        desejoTitle.innerHTML = `Deseja desativar o bloqueador de guia?`
        chrome.runtime.sendMessage({ modo: "bloqueadorAtivado" });
        document.getElementById("subtituloModo").style.color = "#6425FE";
    } else {
        messagemInicial.innerHTML = ``;
        desejoTitle.innerHTML = `Deseja ativar o bloqueador de guia?`
        chrome.runtime.sendMessage({ modo: "bloqueadorDesativado" });
        document.getElementById("subtituloModo").style.color = "#84828A";
    }
}




async function addUrl(tipoLista) {
    if (tipoLista === "BL") {
        if(ativaBlockList.checked){
            ativaBlockList.checked = false;
        }
        if (textInputBlockList.value.length > 2) {
            if (urlsBlockList.length === 0) { //SIGNIFICA QUE AINDA NÃO ATIVOU A FUNCIONALIDADE OU QUE HOUVE UM FECHAMENTO 

                if (temosUrls === true) {
                    console.log("Eles tem urls guardados");
                } else {
                    console.log("Primeira visita!");
                    urlsBlockList.push(textInputBlockList.value);
                    listarNovoSite(textInputBlockList.value, tipoLista); //edicao

                }


            } else {
                urlsBlockList.push(textInputBlockList.value);
                listarNovoSite(textInputBlockList.value, tipoLista); //edicao

            }
        } else {
            console.log("Url digitado não é aceito!");
        }

        textInputBlockList.value = "";
    } else { //CASO SE TRATE DA WHITELIST
        if(ativaWhiteList.checked){
            ativaWhiteList.checked = false;
        }
        if (textInputWhiteList.value.length > 2) {
            if (urlsWhiteList.length === 0) { //SIGNIFICA QUE AINDA NÃO ATIVOU A FUNCIONALIDADE OU QUE HOUVE UM FECHAMENTO 

                if (temosWhiteUrls === true) {
                    console.log("Eles tem urls guardados");
                } else {
                    console.log("Primeira visita!");
                    urlsWhiteList.push(textInputWhiteList.value);
                    listarNovoSite(textInputWhiteList.value, tipoLista);

                }


            } else {
                urlsWhiteList.push(textInputWhiteList.value);
                listarNovoSite(textInputWhiteList.value, tipoLista);

            }

            //chrome.runtime.sendMessage({ modo: "whiteListAtivado", urls: urlsWhiteList });
        } else {
            console.log("Url digitado não é aceito!");
        }

        textInputWhiteList.value = "";

    }
}


const desejoBL = document.getElementById("desejoTitleBL");

ativaBlockList.addEventListener("click", function () {

    if (ativaBlockList.checked) {
        inputBloqueador.checked = false;
        ativaWhiteList.checked = false;
        if(urlsBlockList.length <= 0){
            messagemInicial.innerHTML = `Adicione um URL antes de ativar a função!`;
        }
        chrome.runtime.sendMessage({ modo: "blockListAtivado", urls: urlsBlockList });
        document.getElementById("subtituloModoBlockList").style.color = "#6425FE";
        desejoBL.innerHTML = `Deseja desativar o Block List?`;
    } else {
        messagemInicial.innerHTML = ` `;
        desejoBL.innerHTML = `Deseja ativar o Block List?`;
        chrome.runtime.sendMessage({ modo: "blockListDesativado" })
        document.getElementById("subtituloModoBlockList").style.color = "#84828A";
    }
});


bloqueador.addEventListener("click", function () {

    //Mostrar/ocultar Bloqueador de guia
    if (abaBloqueador.style.display === "none") {
        abaBloqueador.style.display = "flex"
        abaBlockList.style.display = "none";
        abaWhiteList.style.display = "none";
    } else {
        abaBlockList.style.display = "none";
        abaWhiteList.style.display = "none";
        abaBloqueador.style.display = "none";
    }
})

var contadorBL = -1;

//ADICIONAR UM OUVINTE DE EVENTO DE CLIQUE AO BOTÃO
botaoMostrarBlockList.addEventListener("click", function () {
    messagemInicial.innerHTML = ` `;

    contadorBL++;
    chrome.runtime.sendMessage({ pergunta: "listaBlockList" }, function (response) {
        if (response.isAtivo) {
            ativaBlockList.checked = true;
        }
        if (response.devolverUrls != "vazio") {
            temosUrls = true;
            urlsBlockList = response.devolverUrls;
            if (contadorBL === 0) {
                urlsBlockList.forEach(element => {
                    listarNovoSite(element, "BL")
                });
            }

        } else {
            temosUrls = false;
        }
    });
    //EXIBIR OU OCULTAR O CAMPO DE ENTRADA
    if (abaBlockList.style.display === "none") {
        abaBlockList.style.display = "flex";
        abaWhiteList.style.display = "none";
        //Ocultar Bloqueador de guia
        abaBloqueador.style.display = "none";
    } else {
        abaBlockList.style.display = "none";
        abaWhiteList.style.display = "none";
        abaBloqueador.style.display = "none";
    }
});

var contadorWL = -1;
var urlsWhiteList = [];
var temosWhiteUrls = false;

botaoMostrarWhiteList.addEventListener("click", function () {
    messagemInicial.innerHTML = ` `;
    contadorWL++;

    chrome.runtime.sendMessage({ pergunta: "listaWhiteList" }, function (response) {
        if (response.isAtivo) {
            ativaWhiteList.checked = true;
        }
        if (response.devolverUrlsWL != "vazio") {
            temosWhiteUrls = true;
            urlsWhiteList = response.devolverUrlsWL;
            if (contadorWL === 0) {
                urlsWhiteList.forEach(element => {
                    listarNovoSite(element, "WL")
                });
            }

        } else {
            temosWhiteUrls = false;
        }
    });

    //EXIBIR OU OCULTAR O CAMPO DE ENTRADA
    if (abaWhiteList.style.display === "none") {
        abaWhiteList.style.display = "flex";
        abaBlockList.style.display = "none";
        //Ocultar Bloqueador de guia
        abaBloqueador.style.display = "none";

    } else {
        abaWhiteList.style.display = "none";
        abaBlockList.style.display = "none";
        abaBloqueador.style.display = "none";
    }
});

const desejoWL = document.getElementById("desejoTitleWL");

ativaWhiteList.addEventListener("click", function () {
    if (ativaWhiteList.checked) {
        inputBloqueador.checked = false;
        ativaBlockList.checked = false;
        if(!temosWhiteUrls){
            messagemInicial.innerHTML = `Adicione um URL antes de ativar a função!`;
        }
        chrome.runtime.sendMessage({ modo: "whiteListAtivado", urls: urlsWhiteList });
        document.getElementById("subtituloModoWhiteList").style.color = "#6425FE";
        desejoWL.innerHTML = `Deseja desativar a White List?`;
    } else {
        messagemInicial.innerHTML = ` `;
        desejoWL.innerHTML = `Deseja ativar a White List?`;
        chrome.runtime.sendMessage({ modo: "whiteListDesativado" })
        document.getElementById("subtituloModoWhiteList").style.color = "#84828A";
    }
});


