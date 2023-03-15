/*chrome.action.setBadgeText({ text: 'ON' });
chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });*/
chrome.action.setPopup({ popup: 'index.html' });
/*
var contador = 0
var url = ""
var id = 0


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


//DISPARA QUANDO UM NOVO URL SURGE
chrome.tabs.onUpdated.addListener((tabId, window, tab) => {

  bloqueadorDeGuias(tab, tabId)

});


async function bloqueadorDeGuias(tab, tabId){
 
  if(contador == 0){
    url = await getCurrentTabUrl()
    id = await getCurrentTabId()
    contador++
 }
  
  console.log(contador)
  console.log(url)
  console.log(id)

  if (tab.url.includes("extensions")) {

    console.log("Você está na aba de extensões");

  }else if(tab.url.includes("newtab")){

    console.log("Você está na aba de nova guia");

  }else if(tab.url != url){
    console.log("Está tentando acessar um URL diferente do armazenado em url")
    chrome.tabs.remove(tabId)
  }else {
    console.log("Você está na aba que selecionou para nunca fecharmos")
  }
}*/