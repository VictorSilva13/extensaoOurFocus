const bloqueador = document.getElementById("bloquear");
const messagemInicial = document.getElementById("opcaoAtivada");


const botaoMostrarBlockList = document.getElementById("blocklist");
const campoInputBlockList = document.getElementById("campo-input-blocklist");
const textInputBlockList = document.getElementById("entradaBlockList");
const sendBlockList = document.getElementById("enviar");

var urlsBlockList = [];
var temosUrls = false; 

sendBlockList.addEventListener("click", addUrl);
bloqueador.addEventListener("click", fnBlockTabs);

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
            chrome.runtime.sendMessage({ pergunta: "listaBlockList" }, function (response) {
                if (response.devolverUrls != "vazio") {
                   temosUrls = true;
                   urlsBlockList = response.devolverUrls;
                }else{
                    temosUrls = false;
                }
            });

            if(temosUrls === true){
                console.log("Eles tem urls guardados");
                console.log(urlsBlockList);
            }else{
                console.log("Primeira visita!");
                urlsBlockList.push(textInputBlockList.value);

            }


        } else {
            urlsBlockList.push(textInputBlockList.value);
        }

        chrome.runtime.sendMessage({ modo: "blockListAtivado", urls: urlsBlockList });
    } else {
        console.log("Url digitado não é aceito!");
    }

    textInputBlockList.value = "";
    
}


//ADICIONAR UM OUVINTE DE EVENTO DE CLIQUE AO BOTÃO
botaoMostrarBlockList.addEventListener("click", function () {
    //EXIBIR OU OCULTAR O CAMPO DE ENTRADA
    if (campoInputBlockList.style.display === "none") {
        campoInputBlockList.style.display = "block";
    } else {
        campoInputBlockList.style.display = "none";
    }
});

