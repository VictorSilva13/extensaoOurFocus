var contador = 0
var url = ""
var id = 0
var isBloqueadorDeGuiaAtivo = false //true para ativado e false para desativado


chrome.action.setPopup({ popup: 'popup.html' });


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    if (request.modo === "bloqueadorAtivado") {
      isBloqueadorDeGuiaAtivo = true
      console.log("Bloqueador ativado!")

    } else if (request.modo === "bloqueadorDesativado") {
      isBloqueadorDeGuiaAtivo = false
      contador = 0
      console.log("Bloqueador Desativado!");

    } else if (request.pergunta === "estadoBloqueadorFechado") {

      if (isBloqueadorDeGuiaAtivo === true) {
        sendResponse({ estadoAfterClosed: "EstavaAtivado" })
      } else {
        sendResponse({ estadoAfterClosed: "EstavaDesativado" })
      }

    } else {
      console.log("Nem tá ativado nem tá desativado");

    }
  }
);

//DISPARA QUANDO UM NOVO URL SURGE OU AO RECARREGAR PÁGINA
chrome.tabs.onUpdated.addListener((tabId, window, tab) => {
  if (isBloqueadorDeGuiaAtivo === false) {//SE O BLOQUEADOR ESTIVER DESATIVADO

  } else {//SE O BLOQUEADOR ESTIVER ATIVADO
    bloqueadorDeGuias(tab, tabId)
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