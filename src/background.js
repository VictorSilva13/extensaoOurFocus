

//DISPARA QUANDO UM NOVO URL SURGE
chrome.tabs.onUpdated.addListener((tabId, window, tab) => {


  if (tab.url.includes("newtab") || tab.url.includes("extensions")) {

    console.log("ESTA PAGINA NUNCA SERÁ FECHADA POR NÓS");

  } else {
    chrome.tabs.remove(tabId);
  }




});


//DISPARA QUANDO SE ABRE UMA NOVA GUIA 
/*
chrome.tabs.onCreated.addListener(function (tab) {
  console.log(tab);
  if (tab.url == "") {
    console.log("GUIA VAZIA");
  }
});
*/

