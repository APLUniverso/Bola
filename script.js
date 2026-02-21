const cdInfo = document.getElementById("cordenadasInfo")
const ball = document.getElementById("bola")
const areaPeligro = document.getElementById("jugadorArea")
const linea = document.getElementById("trayectoria");

function dibujarLinea(A, B) {
    const dx = B.x - A.x;
    const dy = B.y - A.y;

    const largo = Math.hypot(dx, dy);
    const angulo = Math.atan2(dy, dx) * 180 / Math.PI;

    linea.style.position = "fixed";
    linea.style.left = A.x + "px";
    linea.style.top = A.y + "px";
    linea.style.width = largo + "px";
    linea.style.height = "2px";
    //linea.style.background = "blue";
    linea.style.transformOrigin = "0 50%";
    linea.style.transform = `rotate(${angulo}deg)`;
}

function moverBall(scapeOption, o = 0) {
    const keys = Object.keys(scapeOption);
    if (o >= keys.length) return;

    const rect = ball.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const maxX = window.innerWidth - w;
    const maxY = window.innerHeight - h;

    const opcion = keys[o];

    let destino;
    switch (opcion) {
        case "ii": destino = { x: maxX, y: maxY }; break;
        case "sd": destino = { x: 0, y: 0 }; break;
        case "si": destino = { x: maxX, y: 0 }; break;
        case "id": destino = { x: 0, y: maxY }; break;
        default: return;
    }

    dibujarLinea(getBallPosition(), destino);

    if (chocan(areaPeligro, linea)) {
        return moverBall(scapeOption, o + 1);
    }

    ball.style.transform = `translate(${destino.x}px, ${destino.y}px)`;
}

function getBallPosition(){
    const rect = ball.getBoundingClientRect();

    const ballX = rect.left + rect.width / 2;
    const ballY = rect.top  + rect.height / 2;

    return {x:ballX,y:ballY}
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

window.addEventListener("mousemove",(e) => {
    const mausPstn = {x:e.clientX,y:e.clientY}
    const ballPstn = getBallPosition()

    areaPeligro.style.transform = `translate(${mausPstn.x-50}px, ${mausPstn.y-50}px)`;

    moverBall(getPosicionEscape(mausPstn))

    cdInfo.textContent = getPosicionEscape(mausPstn);
})

ball.addEventListener("click",()=>{
    console.log("win")
})