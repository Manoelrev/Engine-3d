const canvas = document.getElementById('engine');
const ctx = canvas.getContext('2d');

// Define as dimensões do canvas
canvas.width = 600;
canvas.height = 600;


// Variavéís
scale = 100
angle = 0
circle_pos = [canvas.width/2, canvas.height/2]

function mdotmatrix(matrix1, matrix2) {
    result = []
    n = 0
    matrix1.forEach(mat => {
        result[n] = mat[0] * matrix2[0] + mat[1] * matrix2[1] + mat[2] * matrix2[2]
        n++
    });
    return result
}

cube = [[-1, -1,  1],
        [ 1, -1,  1],
        [ 1,  1,  1],
        [-1,  1,  1],
        [-1, -1, -1],
        [ 1, -1, -1],
        [ 1,  1, -1],
        [-1,  1, -1]]

projection_matrix = [[1, 0, 0],
                     [0, 1, 0]]

projected_points = []

function render3d() {
    rotation_z = [
        [Math.cos(angle), -Math.sin(angle), 0],
        [Math.sin(angle), Math.cos(angle), 0],
        [0, 0, 1]]

    rotation_y = [
        [Math.cos(angle), 0, Math.sin(angle)],
        [0, 1, 0],
        [-Math.sin(angle), 0, Math.cos(angle)]]

    rotation_x = [
        [1, 0, 0],
        [0, Math.cos(angle), -Math.sin(angle)],
        [0, Math.sin(angle), Math.cos(angle)]]

    angle += 0.01

    i = 0
    cube.forEach(point => {
        rotated2d = mdotmatrix(rotation_z, point)
        
        rotated2d = mdotmatrix(rotation_y, rotated2d)
        rotated2d = mdotmatrix(rotation_x, rotated2d)

        projected2d = mdotmatrix(projection_matrix, rotated2d)
        
        x = projected2d[0] * scale + circle_pos[0]
        y = projected2d[1] * scale + circle_pos[1]

        projected_points[i] = [x, y]
        i += 1
    });
    projected_points.forEach(x => {
    projected_points.forEach(point => {
        ctx.beginPath();
        ctx.moveTo(x[0], x[1]);
        ctx.lineTo(point[0], point[1]);
        // Draw the Path
        ctx.stroke();
    })});
}
                     
// Variáveis da engine
let lastTime = 0;
let accumulatedTime = 0;
let timeStep = 1000/60; // 60 FPS (em milissegundos)


function update(deltaTime) {

}

function render() {

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    render3d()
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