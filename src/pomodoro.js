let tempo = 25 * 60; //25 minutos de tempo padrão
let trabalhoTempo = 25 * 60; //25 minutos em segundos
let pausaCurtaTempo = 5 * 60; //5 minutos em segundos
let pausaLongaTempo = 15 * 60; //15 minutos em segundos 

let intervalo; //Variável para armazenar o intervalo do temporizador
let ciclos = 1; //Variável para contabilizar o ciclo atual

let iniciado = false; //Variável para verificar se o temporizador foi iniciado
let emPausa = false; //Variável para verificar se está no momento de pausa

const temporizador = document.getElementById("cronometro");
const iniciarBotao = document.getElementById("start");
const pararBotao = document.getElementById("giveup");

// Início - Pomodoro personalizado
const inputTrabalho = document.getElementById("trabalhoTempoPersonalizado");
const inputPausaCurta = document.getElementById("pausaCurtaTempoPersonalizado");
const inputPausaLonga = document.getElementById("pausaLongaTempoPersonalizado");
const enviarBotao = document.getElementById("sendPomodoro");

enviarBotao.addEventListener("click", pomodoroPersonalizado);

function pomodoroPersonalizado() {

    const minutosTrabalho = parseInt(inputTrabalho.value);
    const minutosPausaCurta = parseInt(inputPausaCurta.value);
    const minutosPausaLonga = parseInt(inputPausaLonga.value);

    if (!isNaN(minutosTrabalho) && minutosTrabalho <= 50) {
        tempo = minutosTrabalho * 60;
        trabalhoTempo = minutosTrabalho * 60;
        temporizador.innerHTML = `${minutosTrabalho}:00`;
    }else{
        if(minutosTrabalho > 50){
            alert("Pomodoro não faz sentido dessa maneira!");
        }
    }

    if (!isNaN(minutosPausaCurta)) {
        pausaCurtaTempo = minutosPausaCurta * 60;
    }

    if (!isNaN(minutosPausaLonga)) {
        pausaLongaTempo = minutosPausaLonga * 60;
    }

}
//Fim - Pomodoro personalizado

function atualizarTemporizador() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    //Adiciona um zero à esquerda dos segundos (quando menores que 10)
    const segundosFormatados = segundos < 10 ? "0" + segundos : segundos;

    temporizador.innerHTML = `${minutos}:${segundosFormatados}`;

    if (tempo === 0) {
        clearInterval(intervalo);
        if (!emPausa) { //Acabou o trabalho
            emPausa = true;

            if (ciclos % 4 === 0) {
                console.log("Devo adicionar uma pausa maior agora!");
                tempo = pausaLongaTempo;
            } else {
                console.log("A pausa será a mínima");
                tempo = pausaCurtaTempo;
            }

            alert("Hora da pausa!");
        } else { //Acabou a pausa
            emPausa = false;
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
        intervalo = setInterval(atualizarTemporizador, 1000);
        iniciado = true;
    }
});

pararBotao.addEventListener("click", function () {
    clearInterval(intervalo);
    alert("Desistir não irá salvar seu progresso e o cronômetro irá reiniciar!");
    if (emPausa === true) {
        console.log("O tempo de pausa é de grande importância para que você tenha sucesso");
        tempo = pausaCurtaTempo;

    } else {
        console.log("Não pause o seu trabalho!!!");
        emPausa = false;
        tempo = trabalhoTempo;
    }
    iniciado = false;

    atualizarTemporizador();
});