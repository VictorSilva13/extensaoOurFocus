const bloqueador = document.getElementById("bloquear");
const messagemInicial = document.getElementById("opcaoAtivada");


const botaoMostrarBlockList = document.getElementById("blocklist");
const abaBlockList = document.getElementById("aba-blockList");
const textInputBlockList = document.getElementById("entradaBlockList");
const sendBlockList = document.getElementById("enviar");

//Tabela do popup na aba blocklist
const tabelaBlockList = document.getElementById("tabela-blockList");

//Carrega a lista de sites da variavel UrlsBlockList
const carregarLista = () => {
    urlsBlockList.forEach(site => {
        listarNovoSite(site);
    });

}

//Mostra novo site dentro da tabela do popup na aba BlockList
const listarNovoSite = (site) => {
    const linha = document.createElement("tr");
    const coluna = document.createElement("th");

    //var botao = document.createElement("button");
    //botao.style.background='url(img/lixo.png)';

    const text = document.createTextNode(site);
    coluna.appendChild(text);
    coluna.appendChild(imgLixo);
    linha.appendChild(coluna);
    tabelaBlockList.appendChild(linha);

}

var urlsBlockList = [];
var temosUrls = false;


sendBlockList.addEventListener("click", addUrl);
bloqueador.addEventListener("click", fnBlockTabs);

//Se o usuario digitar enter, a URL sera adicionada
textInputBlockList.addEventListener("keypress", 
function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        addUrl()
    }
})

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




async function addUrl() {
    if (textInputBlockList.value.length > 2) {
        if (urlsBlockList.length === 0) { //SIGNIFICA QUE AINDA NÃO ATIVOU A FUNCIONALIDADE OU QUE HOUVE UM FECHAMENTO 

            if (temosUrls === true) {
                console.log("Eles tem urls guardados");
            } else {
                console.log("Primeira visita!");
                urlsBlockList.push(textInputBlockList.value);
                listarNovoSite(textInputBlockList.value); //edicao

            }


        } else {
            urlsBlockList.push(textInputBlockList.value);
            listarNovoSite(textInputBlockList.value); //edicao

        }

        chrome.runtime.sendMessage({ modo: "blockListAtivado", urls: urlsBlockList });
    } else {
        console.log("Url digitado não é aceito!");
    }

    textInputBlockList.value = "";

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
                    listarNovoSite(element)
                });
            }

        } else {
            temosUrls = false;
        }
    });
    //EXIBIR OU OCULTAR O CAMPO DE ENTRADA
    if (abaBlockList.style.display === "none") {
        abaBlockList.style.display = "block";

    } else {
        abaBlockList.style.display = "none";
    }
});

