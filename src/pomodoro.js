let tempo = 25 * 60; //25 minutos de tempo padrão
let trabalhoTempo = 25 * 60; //25 minutos em segundos
let pausaCurtaTempo = 5 * 60; //5 minutos em segundos
let pausaLongaTempo = 15 * 60; //15 minutos em segundos 

let intervalo; //Variável para armazenar o intervalo do temporizador
let ciclos = 1; //Variável para contabilizar o ciclo atual

let iniciado = false; //Variável para verificar se o temporizador foi iniciado
let momentoPausa = false; //Variável para verificar se está no momento de pausa

let tempoPausado; //Assume o valor de tempo quando o cronômetro é pausado

const temporizador = document.getElementById("cronometro");
const iniciarBotao = document.getElementById("start");
const pausarBotao = document.getElementById("pause");
const pararBotao = document.getElementById("giveup");

function atualizarTemporizador() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    //Adiciona um zero à esquerda dos segundos (quando menores que 10)
    const segundosFormatados = segundos < 10 ? "0" + segundos : segundos;

    temporizador.innerHTML = `${minutos}:${segundosFormatados}`;

    if (tempo === 0) {
        clearInterval(intervalo);
        if (!momentoPausa) { //Acabou o trabalho
            momentoPausa = true;

            if (ciclos % 4 === 0) {
                console.log("Devo adicionar uma pausa maior agora!");
                tempo = pausaLongaTempo;
            } else {
                console.log("A pausa será a mínima");
                tempo = pausaCurtaTempo;
            }

            alert("Hora da pausa!");
        } else { //Acabou a pausa
            momentoPausa = false;
            tempo = trabalhoTempo;
            ciclos++;
            alert("Hora de trabalhar!");
        }
        intervalo = setInterval(atualizarTemporizador, 1000);
    } else {
        tempo--;
    }
}

iniciarBotao.addEventListener("click", function () {
    if (!iniciado) {
        if(tempoPausado == tempo){
            tempo = tempoPausado;
        }
        intervalo = setInterval(atualizarTemporizador, 1000);
        iniciado = true;
    }else{
        if(tempoPausado == tempo){
            tempo = tempoPausado;
            intervalo = setInterval(atualizarTemporizador, 1000);
            iniciado = true;
        }
    }
});

pausarBotao.addEventListener("click", function () {
    tempoPausado = tempo;
    clearInterval(intervalo);
});

pararBotao.addEventListener("click", function () {
    clearInterval(intervalo);
    alert("Desistir não irá salvar seu progresso e o cronômetro irá reiniciar!");
    if (momentoPausa === true) {
        console.log("O tempo de pausa é de grande importância para que você tenha sucesso");
        tempo = pausaCurtaTempo;

    } else {
        console.log("Não pause o seu trabalho!!!");
        momentoPausa = false;
        tempo = trabalhoTempo;
    }
    iniciado = false;

    atualizarTemporizador();
});