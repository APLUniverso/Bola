const cdInfo = document.getElementById("cordenadasInfo")

const ball = document.getElementById("bola")
const player = document.getElementById("player")

const winPanel = document.getElementById("victoria")


// Estado de la bola
let velX = 0;
let velY = 0;

// Configuración de "personalidad"
const velocidadMaxima = 8;
const friccion = 0.95; // 1 = no frena, 0.9 = frena rápido
const sensibilidad = 0.5; // Qué tan fuerte escapa

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

function moverBall(playPstn,ballPstn) {
    let ballX = ballPstn.x
    let dtcX = playPstn.x - ballPstn.x
    let dtcY = playPstn.y - ballPstn.y
    let dtcFinla = Math.hypot(dtcX,dtcY)

    if (dtcFinla < 200){
        let angulo = Math.atan2(dtcY,dtcX)

        let error = (Math.random() - 0.5) * 0.6;
        let anguloFinal = angulo + error

        velX += Math.cos(anguloFinal) * sensibilidad
        velY += Math.sin(anguloFinal) * sensibilidad
    }

    velX *= friccion
    velY *= friccion

    let speed = Math.hypot(velX,velY)
    if (speed>velocidadMaxima){
        velX = (velX / speed) * velocidadMaxima;
        velY = (velY / speed) * velocidadMaxima;
    }

    ballX += velX;
    ballY += velY;

    // Límites de pantalla (Para que no se escape del mapa)
    if (ballX < 0) ballX = 0;
    if (ballX > window.innerWidth) ballX = window.innerWidth;
    if (ballY < 0) ballY = 0;
    if (ballY > window.innerHeight) ballY = window.innerHeight;

    // DIBUJAR (Usamos el centro de la bola como referencia)
    ball.style.transform = `translate(${ballX - 25}px, ${ballY - 25}px)`;
}

function getPosicionEscape(mausPosition){
    const scapeOptions = {
        sd : Math.hypot(mausPosition.x - 0, mausPosition.y - 0),
        si : Math.hypot(mausPosition.x - window.innerWidth, mausPosition.y - 0),
        id : Math.hypot(mausPosition.x - 0, mausPosition.y - window.innerHeight),
        ii : Math.hypot(mausPosition.x - window.innerWidth, mausPosition.y - window.innerHeight)
    }
    return Object.fromEntries(Object.entries(scapeOptions).sort(([,va],[,vb]) => vb - va));
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
    const ballPstn = getObjectPosition(ball)

    cdInfo.textContent = Math.hypot(playPstn.x-ballPstn.x, playPstn.y-ballPstn.y)
    moverBall(playPstn,ballPstn)

    if (chocan(ball,player))winPanel.classList.remove("invisible");

    requestAnimationFrame(moverPlayer)
}

moverPlayer();