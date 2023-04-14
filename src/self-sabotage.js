const tabela = document.getElementById("selfSabotage");

chrome.runtime.sendMessage({ action: "getSelfSabotage" }, function (response) {
    
    response.retorno.forEach(function (item) {
        const linha = tabela.insertRow();
        const urlColuna = linha.insertCell();
        const acessosColuna = linha.insertCell();

        urlColuna.innerHTML = item.url;
        acessosColuna.innerHTML = item.nAcessos;

        urlColuna.style.border = '1px solid #ddd';
        acessosColuna.style.border = '1px solid #ddd';
        urlColuna.style.padding = '8px';
        acessosColuna.style.padding = '8px';

        tabela.appendChild(linha);
    });


});