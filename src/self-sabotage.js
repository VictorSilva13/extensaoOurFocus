const tabela = document.getElementById("selfSabotage");
const mostrarTabelaBtn = document.getElementById("mostrarTabela");

chrome.runtime.sendMessage({ action: "getSelfSabotage" }, function (response) {

    //NOVO ARRAY COM OS DADOS DA RESPOSTA
    var dadosTabela = response.retorno.map(function(item) {
        return {
            url: resumirLink(item.url),
            nAcessos: item.nAcessos
        };
    });

    //ORDENA OS DADOS COM BASE NO NUMERO DE ACESSOS
    dadosTabela.sort(function(a, b) {
        return b.nAcessos - a.nAcessos;
    });

    if (dadosTabela.length > 6) {
        dadosTabela = dadosTabela.slice(0, 6); 
    } else if(dadosTabela.length == 0){
        tabela.innerHTML = ` `;
    }

    //PREENCHE A TABELA COM OS DADOS ORDENADOS
    dadosTabela.forEach(function (item) {
        const linha = tabela.insertRow();
        const urlColuna = linha.insertCell();
        const acessosColuna = linha.insertCell();

        urlColuna.innerHTML = item.url;
        acessosColuna.innerHTML = item.nAcessos;

        urlColuna.style.border = '1px solid #ddd';
        acessosColuna.style.border = '1px solid #ddd';
        urlColuna.style.padding = '8px';
        acessosColuna.style.padding = '8px';

        urlColuna.style.textAlign = "center";
        acessosColuna.style.textAlign = "center";

        urlColuna.style.color = "white";
        acessosColuna.style.color = "white";

        tabela.appendChild(linha);
    });
});


function resumirLink(url) {
    const linkSemProtocolo = url.replace(/^(https?:\/\/)?(www\.)?/i, "");

    if (linkSemProtocolo.length > 25) {
        return `${linkSemProtocolo.slice(0, 25)}...`;
    }

    return linkSemProtocolo;
}

mostrarTabelaBtn.addEventListener("click", function() {
    
    if(tabela.style.display == "block"){
        tabela.style.display = "none";
    }else{
        tabela.style.display = "block";
    }

});