var contador = 0
var url = ""
var id = 0
var isBloqueadorDeGuiaAtivo = false //true para ativado e false para desativado
var isBlockListAtivo = false
var listaUrls = [];

chrome.action.setPopup({ popup: 'popup.html' });


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.modo === "bloqueadorAtivado") {
      isBloqueadorDeGuiaAtivo = true
      isBlockListAtivo = false
      console.log("Bloqueador ativado!")

    } else if (request.modo === "bloqueadorDesativado") {
      isBloqueadorDeGuiaAtivo = false;
      isBlockListAtivo = false
      contador = 0;
      console.log("Bloqueador Desativado!");

    } else if (request.pergunta === "estadoBloqueadorFechado") {

      if (isBloqueadorDeGuiaAtivo === true) {
        sendResponse({ estadoAfterClosed: "EstavaAtivado" });
      } else {
        sendResponse({ estadoAfterClosed: "EstavaDesativado" });
      }

    } else if (request.modo === "blockListAtivado") {

      for (let index = 0; index < request.urls.length; index++) {
        if (listaUrls.includes(request.urls[index])) {//SE A LISTA NO BACKGROUND JÁ TIVER O URL, NÃO FAZ NADA
          console.log("Já temos esse url salvo aqui");
        } else {//SE A LISTA NO BACKGROUND NÃO O TIVER, ADICIONA
          listaUrls.push(request.urls[index]);
        }
      }

      console.log(listaUrls);
      isBlockListAtivo = true; //FALTA ADICIONAR O BOTAO DE ENCERRAR O BLOCKLIST
      isBloqueadorDeGuiaAtivo = false;

    } else if (request.modo === "blockListDesativado") { //FALTA ADICIONAR ESSE MODO NO SCRIPT.JS
      isBloqueadorDeGuiaAtivo = false;
      isBlockListAtivo = false;
    
    } else if (request.pergunta === "listaBlockList") {

      if (listaUrls.length === 0) { //NÃO TEMOS URLS ARMAZENADOS NO BACKGROUND
        sendResponse({ devolverUrls: "vazio" });
      } else {//TEMOS URLS ARMAZENADOS NO BACKGROUND
        sendResponse({ devolverUrls: listaUrls });
      }

    }
  }
);

//DISPARA QUANDO UM NOVO URL SURGE OU AO RECARREGAR PÁGINA
chrome.tabs.onUpdated.addListener((tabId, window, tab) => {
  if (isBloqueadorDeGuiaAtivo === true) {//SE O BLOQUEADOR ESTIVER ATIVADO
    bloqueadorDeGuias(tab, tabId);
  } else {
    if (isBlockListAtivo === true) {
      executarBlockList(listaUrls, tab);
    } else {

    }
  }

});


//RETORNA O URL DA ABA ATUAL
async function getCurrentTabUrl() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.url;
}

//RETORNA O ID DA ABA ATUAL
async function getCurrentTabId() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab.id;
}

//FUNÇÃO BLOQUEADORA DE GUIA
async function bloqueadorDeGuias(tab, tabId) {

  if (contador == 0) {
    url = await getCurrentTabUrl()
    id = await getCurrentTabId()
    contador++
  }

  console.log(contador)
  console.log(url)
  console.log(id)

  if (tab.url.includes("extension")) {

    console.log("Você está na aba de extensões");

  } else if (tab.url.includes("newtab")) {

    console.log("Você está na aba de nova guia");

  } else if (tab.url != url) {
    console.log("Está tentando acessar um URL diferente do armazenado em url")
    chrome.tabs.remove(tabId)
  } else {
    console.log("Você está na aba que selecionou para nunca fecharmos")
  }
}

//FUNÇÃO PARA BLOCK LIST
function executarBlockList(lista, tab) {
  if(listaUrls.length != 0){
    for (let index = 0; index < lista.length; index++) {
      if(tab.url.includes(lista[index])){
        chrome.tabs.remove(tab.id)
      }
    }
  }
}