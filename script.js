const cdInfo = document.getElementById("cordenadasInfo")

const ball = document.getElementById("bola")
const player = document.getElementById("player")

const winPanel = document.getElementById("victoria")

function getObjectPosition(obj){
    const rect = obj.getBoundingClientRect();

    const ballX = rect.left + rect.width / 2;
    const ballY = rect.top  + rect.height / 2;

    return {x:ballX,y:ballY}
}

function chocan(el1, el2) {
    const a = el1.getBoundingClientRect();
    const b = el2.getBoundingClientRect();

    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
}



// Configuración de "personalidad"
// Estado global de velocidad
let velX = 0;
let velY = 0;

const velocidadMaxima = 8;
const friccion = 0.95;
const sensibilidad = 0.6;
const radio = 25;
const distanciaAlerta = 500;

let ballPstn = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
};

function moverBall(playerPstn, ballPstn) {

    let ballX = ballPstn.x;
    let ballY = ballPstn.y;

    // Vector desde jugador hacia la bola (ESCAPE)
    let dx = ballX - playerPstn.x;
    let dy = ballY - playerPstn.y;

    let distancia = Math.hypot(dx, dy);

    if (distancia < distanciaAlerta && distancia > 0) {

        // Normalizamos el vector
        let dirX = dx / distancia;
        let dirY = dy / distancia;

        // Fuerza proporcional a qué tan cerca está
        let fuerza = (distanciaAlerta - distancia) / distanciaAlerta;

        velX += dirX * sensibilidad * fuerza * 5;
        velY += dirY * sensibilidad * fuerza * 5;
    }

    // Ruido pequeño para hacerlo impredecible
    velX += (Math.random() - 0.5) * 0.2;
    velY += (Math.random() - 0.5) * 0.2;

    // Fricción
    velX *= friccion;
    velY *= friccion;

    // Limitar velocidad máxima
    let speed = Math.hypot(velX, velY);
    if (speed > velocidadMaxima) {
        velX = (velX / speed) * velocidadMaxima;
        velY = (velY / speed) * velocidadMaxima;
    }

    // Aplicar movimiento
    ballX += velX;
    ballY += velY;

    // REBOTE en bordes
    if (ballX - radio < 0) {
        ballX = radio;
        velX *= -0.8;
    }

    if (ballX + radio > window.innerWidth) {
        ballX = window.innerWidth - radio;
        velX *= -0.8;
    }

    if (ballY - radio < 0) {
        ballY = radio;
        velY *= -0.8;
    }

    if (ballY + radio > window.innerHeight) {
        ballY = window.innerHeight - radio;
        velY *= -0.8;
    }

    // Dibujar
    ball.style.transform = `translate(${ballX - radio}px, ${ballY - radio}px)`;

    return { x: ballX, y: ballY };
}


const teclas = {}
let x = 0
let y = 0

document.addEventListener("keydown", (e) => teclas[e.key] = true);
document.addEventListener("keyup", (e) => teclas[e.key] = false);

function moverPlayer(){
    const steps = 5
    if(teclas["ArrowUp"]){y-=steps}
    if(teclas["ArrowDown"]){y+=steps}
    if(teclas["ArrowLeft"]){x-=steps}
    if(teclas["ArrowRight"]){x+=steps}

    player.style.transform = `translate(${x}px, ${y}px)`;

    const playPstn = getObjectPosition(player)
    ballPstn = moverBall(playPstn, ballPstn)

    cdInfo.textContent = Math.hypot(playPstn.x-ballPstn.x, playPstn.y-ballPstn.y)
    moverBall(playPstn,ballPstn)

    if (chocan(ball,player))winPanel.classList.remove("invisible");

    requestAnimationFrame(moverPlayer)
}

moverPlayer();