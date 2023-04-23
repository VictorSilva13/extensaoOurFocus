const bloqueador = document.getElementById("bloquear");
const messagemInicial = document.getElementById("opcaoAtivada");
const sair = document.getElementById("sair");

const botaoMostrarBlockList = document.getElementById("blocklist");
const abaBlockList = document.getElementById("aba-blockList");
const textInputBlockList = document.getElementById("entradaBlockList");
const sendBlockList = document.getElementById("enviarBL");


const botaoMostrarWhiteList = document.getElementById("whitelist");
const abaWhiteList = document.getElementById("aba-whitelist");
const textInputWhiteList = document.getElementById("entradaWhiteList");
const sendWhiteList = document.getElementById("enviarWL");

//Tabela do popup na aba blocklist
const tabelaBlockList = document.getElementById("tabela-blockList");
const tabelaWhiteList = document.getElementById("tabela-whiteList");

sair.addEventListener("click", function(){
    window.close();
})

//Carrega a lista de sites da variavel UrlsBlockList
function carregarLista(tipoLista) {
    if (tipoLista === "BL") {
        urlsBlockList.forEach(site => {
            listarNovoSite(site, "BL");
        });
    }else{
        urlsWhiteList.forEach(site => {
            listarNovoSite(site, "WL");
        });
    }

}

//Mostra novo site dentro da tabela do popup na aba BlockList
function listarNovoSite (site, tipo){
    const linha = document.createElement("tr");
    const coluna = document.createElement("th");

    //var botao = document.createElement("button");
    //botao.style.background='url(img/lixo.png)';

    const text = document.createTextNode(site);
    coluna.appendChild(text);
    //coluna.appendChild(imgLixo);
    linha.appendChild(coluna);

    if (tipo === "BL") {
        tabelaBlockList.appendChild(linha);
    } else {
        tabelaWhiteList.appendChild(linha);
    }

}


var urlsBlockList = [];
var temosUrls = false;

sendBlockList.addEventListener("click", function () {
    addUrl("BL");
});
sendWhiteList.addEventListener("click", function () {
    addUrl("WL");
});

bloqueador.addEventListener("click", fnBlockTabs);

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
        messagemInicial.innerHTML = `Bloqueador de Guia Ativado! <br> <h4>Pressione F5 na página que deseja focar.</h4>`;
    } else {
        messagemInicial.innerHTML = ``;
        contBloqueadorDeGuia = -1
    }
});

function fnBlockTabs() {
    contBloqueadorDeGuia++

    if (contBloqueadorDeGuia % 2 === 0) {
        messagemInicial.innerHTML = `Bloqueador de Guia Ativado! <br> <h4>Pressione F5 na página que deseja focar.</h4>`;
        chrome.runtime.sendMessage({ modo: "bloqueadorAtivado" });
    } else {
        messagemInicial.innerHTML = ``;
        chrome.runtime.sendMessage({ modo: "bloqueadorDesativado" });
    }
}




async function addUrl(tipoLista) {
    if (tipoLista === "BL") {
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

            chrome.runtime.sendMessage({ modo: "blockListAtivado", urls: urlsBlockList });
        } else {
            console.log("Url digitado não é aceito!");
        }

        textInputBlockList.value = "";
    } else { //CASO SE TRATE DA WHITELIST
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

            chrome.runtime.sendMessage({ modo: "whiteListAtivado", urls: urlsWhiteList });
        } else {
            console.log("Url digitado não é aceito!");
        }

        textInputWhiteList.value = "";

    }
}

var contadorBL = -1;

//ADICIONAR UM OUVINTE DE EVENTO DE CLIQUE AO BOTÃO
botaoMostrarBlockList.addEventListener("click", function () {

    contadorBL++;
    chrome.runtime.sendMessage({ pergunta: "listaBlockList" }, function (response) {
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
        abaBlockList.style.display = "block";
        abaWhiteList.style.display = "none";
    } else {
        abaBlockList.style.display = "none";
        abaWhiteList.style.display = "none";
    }
});

var contadorWL = -1;
var urlsWhiteList = [];
var temosWhiteUrls = false;

botaoMostrarWhiteList.addEventListener("click", function () {
    contadorWL++;

    chrome.runtime.sendMessage({ pergunta: "listaWhiteList" }, function (response) {
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
        abaWhiteList.style.display = "block";
        abaBlockList.style.display = "none";

    } else {
        abaWhiteList.style.display = "none";
        abaBlockList.style.display = "none";
    }
});


