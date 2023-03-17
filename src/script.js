const bloqueador = document.getElementById("bloquear")

bloqueador.addEventListener("click", fnBlockTabs)

//Contador para analisar estado do botão
var cont = -1

//QUANDO A PÁGINA HOME FOR INICIADA ELE SOLICITA O ESTADO DO BOTÃO ANTES DO ULTIMO FECHAMENTO
chrome.runtime.sendMessage({ pergunta: "estadoBloqueadorFechado" }, function(response){
    if(response.estadoAfterClosed === "EstavaAtivado"){
        cont = 0
    }else{
        cont = -1
    }
});

function fnBlockTabs() {
    cont++

    if (cont % 2 === 0) {
        
        chrome.runtime.sendMessage({ modo: "bloqueadorAtivado" });
    }else{
    
        chrome.runtime.sendMessage({ modo: "bloqueadorDesativado" });
    }
}
