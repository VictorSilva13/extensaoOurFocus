const bloqueador = document.getElementById("bloquear");
const messagemInicial = document.getElementById("opcaoAtivada");

bloqueador.addEventListener("click", fnBlockTabs);

//Contador para analisar estado do botão do Bloqueador de Guia
var contBloqueadorDeGuia = -1;

//QUANDO A PÁGINA HOME FOR INICIADA ELE SOLICITA O ESTADO DO BOTÃO ANTES DO ULTIMO FECHAMENTO
chrome.runtime.sendMessage({ pergunta: "estadoBloqueadorFechado" }, function(response){
    if(response.estadoAfterClosed === "EstavaAtivado"){
        contBloqueadorDeGuia = 0
        messagemInicial.innerHTML = `Bloqueador de Guia Ativado! <br> <h4>Pressione F5 na página que deseja focar.</h4>`;
    }else{
        messagemInicial.innerHTML = ``;
        contBloqueadorDeGuia = -1
    }
});

function fnBlockTabs() {
    contBloqueadorDeGuia++

    if (contBloqueadorDeGuia % 2 === 0) {
        messagemInicial.innerHTML = `Bloqueador de Guia Ativado! <br> <h4>Pressione F5 na página que deseja focar.</h4>`;
        chrome.runtime.sendMessage({ modo: "bloqueadorAtivado" });
    }else{
        messagemInicial.innerHTML = ``;
        chrome.runtime.sendMessage({ modo: "bloqueadorDesativado" });
    }
}
