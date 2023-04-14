var contador = 0
var url = ""
var id = 0
var isBloqueadorDeGuiaAtivo = false //true para ativado e false para desativado
var isBlockListAtivo = false
var listaUrls = [];
var listaSabotage = [];
let updated = false;
obterDadosArmazenados();

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
    if (request.action == "getSelfSabotage") { //O SOLICITANTE QUER RECEBER A LISTA DO SABOTAGE
      sendResponse({ retorno: listaSabotage });
    }


  }
);



//EVENTO QUE DISPARA SE HOUVER ALGUMA ALTERAÇÃO NO STORAGE LOCAL
chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (areaName === "local") {
    obterDadosArmazenados();
  }
});




chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (!updated && changeInfo.status === 'complete') {
    if (isBloqueadorDeGuiaAtivo === true) {//SE O BLOQUEADOR ESTIVER ATIVADO
      bloqueadorDeGuias(tab, tabId);
  
    } else {
      if (isBlockListAtivo === true) {
        executarBlockList(listaUrls, tab);
      } else {
  
      }
    }
    updated = true;
    setTimeout(function() {
      updated = false;
    }, 2500);
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

  if (tab.url.includes("extension")) {

    console.log("Você está na aba de extensões");

  } else if (tab.url.includes("newtab")) {

    console.log("Você está na aba de nova guia");

  } else if (tab.url != url) {
    console.log("Está tentando acessar um URL diferente do armazenado em url")
    //AQUI ELE DEVE SALVAR O URL DA SABOTAGEM!
    armazenarURL(tab.url);

    setTimeout(function () {
      chrome.tabs.remove(tabId);
    }, 1000);

  } else {
    console.log("Você está na aba que selecionou para nunca fecharmos")
  }


}

//FUNÇÃO PARA BLOCK LIST
function executarBlockList(lista, tab) {
  if (listaUrls.length != 0) {
    for (let index = 0; index < lista.length; index++) {
      if (tab.url.includes(lista[index])) {
        setTimeout(function () {
          chrome.tabs.remove(tab.id);
        }, 1000);
      }
    }
  }
}


//FUNÇÃO PARA ARMAZENAR URLs DO SELF-SABOTAGE
function armazenarURL(url) {
  chrome.storage.local.get(url, function (resultado) {

    let dadosSabotagem = {};
    let nAcessos;
    console.log("RESULTADO:");
    console.log(resultado[url] > 0);
    //SE O URL JÁ EXISTIR, APENAS ADICIONA MAIS UM ACESSO
    if (resultado[url] > 0) {
      nAcessos = resultado[url] + 1;
    } else { //SE O URL NÃO EXISTIR NO STORAGE, ELE CRIA E DÁ O PRIMEIRO ACESSO
      nAcessos = 1;
    }

    dadosSabotagem[url] = nAcessos;

    chrome.storage.local.set(dadosSabotagem);
  });
}



function obterDadosArmazenados() { //FUNÇÃO QUE ATUALIZA O VALOR DE listaSabotage PARA O QUE TEM NO STORAGE
  listaSabotage = [];
  chrome.storage.local.get(null, function (resultado) {
    for (let url in resultado) {
      let nAcessos = resultado[url];
      listaSabotage.push({ url: url, nAcessos: nAcessos });
    }
    console.log(listaSabotage);
  });
}
