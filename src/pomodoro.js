const iniciar = document.getElementById("start")
const desistir = document.getElementById("giveup")
const cronometro = document.getElementById("cronometro")

iniciar.addEventListener("click", fnStart)
desistir.addEventListener("click", fnStop)

var sec = 60
var min = 24
var interval

function fnStart() {
    interval = setInterval(clock, 1000)
}

function fnStop() {
    cronometro.innerText = "25:00"
    clearInterval(interval)
    sec = 60
    min = 24
}

function clock() {
    sec--

    if (sec < 10) {
        sec = "0" + sec
    }

    if (sec === "0" + 0) {
        min--
        sec = 59

        if (min < 10) {
            min = "0" + min
        }
    }

    cronometro.innerText = min + ":" + sec

    if (min === "0" + -1) {
        cronometro.innerText = "Tempo de pausa" //FALTA ADICIONAR CRONOMETRO PARA PAUSAS
        clearInterval(interval)
    }
}