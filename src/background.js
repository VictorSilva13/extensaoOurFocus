chrome.action.setBadgeText({ text: 'ON' });
chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
chrome.action.setPopup({ popup: 'index.html' });

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

var abaAtual

var pegandoUrl = getCurrentTab().then((tabs)=>{
  abaAtual = tabs.url
})


//DISPARA QUANDO UM NOVO URL SURGE
chrome.tabs.onUpdated.addListener((tabId, window, tab) => {
  
  if (tab.url.includes("newtab")||tab.url.includes(abaAtual)||tab.url.includes("extensions")) {

    console.log("ESTA PÁGINA NUNCA SERÁ FECHADA POR NÓS");

  } else {
    
    chrome.tabs.remove(tabId);
  }

});


/*DISPARA QUANDO SE ABRE UMA NOVA GUIA
chrome.tabs.onCreated.addListener(function (tab) {
  console.log(tab);
  if (tab.url == "") {
    console.log("GUIA VAZIA");
  }
});
*/