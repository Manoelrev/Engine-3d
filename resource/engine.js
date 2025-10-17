const canvas = document.getElementById('engine');
const ctx = canvas.getContext('2d');

// Define as dimensões do canvas
canvas.width = 600;
canvas.height = 600;

// Variáveis do jogo
let lastTime = 0;
let accumulatedTime = 0;
let timeStep = 1000/60; // 60 FPS (em milissegundos)


function update(deltaTime) {

}

function render() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;


    accumulatedTime += deltaTime;
    while (accumulatedTime >= timeStep) {
        update(timeStep);
        accumulatedTime -= timeStep;
    }
    
    render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

