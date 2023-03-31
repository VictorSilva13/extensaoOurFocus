//Pomodoro Padrão (25t, 5pc, 15pl)
//Pomodoro 2.0 (35t, 7pc, 21pl)

let tempo = 25 * 60; //25 minutos de tempo padrão
let trabalhoTempo = 25 * 60; //25 minutos em segundos
let pausaCurtaTempo = 5 * 60; //5 minutos em segundos
let pausaLongaTempo = 15 * 60; //15 minutos em segundos 

let intervalo; //Variável para armazenar o intervalo do temporizador
let ciclos = 1; //Variável para contabilizar o ciclo atual

let iniciado = false; //Variável para verificar se o temporizador foi iniciado
let momentoPausa = false; //Variável para verificar se está no momento de pausa
let isPausaLonga = false;
let isPomodoroPadrao = true;

let tempoPausado; //Assume o valor de tempo quando o cronômetro é pausado

const temporizador = document.getElementById("cronometro");
const iniciarBotao = document.getElementById("start");
const pausarBotao = document.getElementById("pause");
const desistirBotao = document.getElementById("giveup");
const pomodoro2 = document.getElementById("p2.0");



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
                isPausaLonga = true;
            } else {
                console.log("A pausa será a mínima");
                tempo = pausaCurtaTempo;
                isPausaLonga = false;
            }

            alert("Hora da pausa!");

        } else { //Acabou a pausa
            momentoPausa = false;
            isPausaLonga = false;

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
    
    pomodoro2.style.display = "none";

    if (!iniciado) {
        if (tempoPausado == tempo) {
            tempo = tempoPausado;
        }
        intervalo = setInterval(atualizarTemporizador, 1000);
        iniciado = true;
    } else {
        if (tempoPausado == tempo) {
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

desistirBotao.addEventListener("click", async function desistir() {

    clearInterval(intervalo);

    // Chama o alerta e espera pela escolha do usuário
    const escolha = await exibirAlertaDesistencia();
    tempoPausado = tempo;

    // Realiza ação com base na escolha do usuário
    if (escolha === 'opcao1') {
        clearInterval(intervalo);
        pomodoro2.style.display = "block";
        console.log("DESISTIU");
        if (momentoPausa === true) {
            console.log("O tempo de pausa é de grande importância para que você tenha sucesso");
            if (isPausaLonga == true) {
                tempo = pausaLongaTempo;
            } else {
                tempo = pausaCurtaTempo;
            }
            atualizarTemporizador();
        }
        else {
            console.log("Não pause o seu trabalho!!!");
            momentoPausa = false;
            tempo = trabalhoTempo;
            atualizarTemporizador();
        }

        iniciado = false;
    }

});


function exibirAlertaDesistencia() {
    return new Promise((resolve, reject) => {
        Swal.fire({
            title: 'Desistir Agora ???',
            showCancelButton: true,
            position: 'top-end',
            confirmButtonText: 'Desistir',
            cancelButtonText: 'Ficar aqui'
        }).then((result) => {
            if (result.value) {
                resolve('opcao1');
            } else {
                resolve('opcao2');
            }
        });
    });
}

pomodoro2.addEventListener("click", function () {

    if (isPomodoroPadrao === true) {
        isPomodoroPadrao = false;
        
        if (!momentoPausa) {
            tempo = 35 * 60;

        } else {
            if(!isPausaLonga){
                tempo = 7 * 60;
            }else{
                tempo = 21 * 60;
            }
        }

        trabalhoTempo = 35 * 60;
        pausaCurtaTempo = 7 * 60;
        pausaLongaTempo = 21 * 60;

        atualizarTemporizador();
        pomodoro2.innerHTML = `Experimentar Pomodoro Padrão`;
    } else {
        isPomodoroPadrao = true;

        if (!momentoPausa) {
            tempo = 25 * 60;

        } else {
            if(!isPausaLonga){
                tempo = 5 * 60;
            }else{
                tempo = 15 * 60;
            }
        }
        trabalhoTempo = 25 * 60;
        pausaCurtaTempo = 5 * 60;
        pausaLongaTempo = 15 * 60;
        atualizarTemporizador();
        pomodoro2.innerHTML = `Experimentar Pomodoro 2.0`;

    }

});