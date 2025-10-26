const canvas = document.getElementById('engine');
const ctx = canvas.getContext('2d');

// Variáveis Canvas

let lastTime = 0;
let accumulatedTime = 0;
let timeStep = 1000/60; // 60 FPS (em milissegundos)

// Variáveis Engine
scale = 100
angle = 0
circle_pos = [canvas.width/2, canvas.height/2]

cube = [
		[ [0.0, 0.0, 0.0],    [0.0, 1.0, 0.0],    [1.0, 1.0, 0.0] ],
		[ [0.0, 0.0, 0.0],    [1.0, 1.0, 0.0],    [1.0, 0.0, 0.0] ],
                                                    
		[ [1.0, 0.0, 0.0],    [1.0, 1.0, 0.0],    [1.0, 1.0, 1.0] ],
        [ [1.0, 0.0, 0.0],    [1.0, 1.0, 1.0],    [1.0, 0.0, 1.0] ],
                                                   
        [ [1.0, 0.0, 1.0],    [1.0, 1.0, 1.0],    [0.0, 1.0, 1.0] ],
        [ [1.0, 0.0, 1.0],    [0.0, 1.0, 1.0],    [0.0, 0.0, 1.0] ],
                                                   
		[ [0.0, 0.0, 1.0],    [0.0, 1.0, 1.0],    [0.0, 1.0, 0.0] ],
		[ [0.0, 0.0, 1.0],    [0.0, 1.0, 0.0],    [0.0, 0.0, 0.0] ],
                                                      
		[ [0.0, 1.0, 0.0],    [0.0, 1.0, 1.0],    [1.0, 1.0, 1.0] ],
		[ [0.0, 1.0, 0.0],    [1.0, 1.0, 1.0],    [1.0, 1.0, 0.0] ],
                                                  
        [ [1.0, 0.0, 1.0],    [0.0, 0.0, 1.0],    [0.0, 0.0, 0.0] ],
        [ [1.0, 0.0, 1.0],    [0.0, 0.0, 0.0],    [1.0, 0.0, 0.0] ],
];

projection_matrix = [[1, 0, 0],[0, 1, 0]]

projected_points = []


function mdotmatrix(matrix1, matrix2) {
    result = []
    n = 0
    matrix1.forEach(mat => {
        result[n] = mat[0] * matrix2[0] + mat[1] * matrix2[1] + mat[2] * matrix2[2]
        n++
    });
    return result
}

function mdotMultiplyMatrix(point, rotation_z, rotation_x, rotation_y) {
    return mdotmatrix(rotation_y, mdotmatrix(rotation_x, mdotmatrix(rotation_z, point)))
}

function clearCanvas(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTriangle(triangleArray) {
    ctx.beginPath();
    ctx.moveTo(triangleArray[0][0], triangleArray[0][1]);
    ctx.lineTo(triangleArray[1][0], triangleArray[1][1]);
    ctx.lineTo(triangleArray[2][0], triangleArray[2][1]);
    ctx.closePath();
    ctx.stroke();
}

function render3d() {
    angle += 0.01

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

    cube.forEach(triangle => {
        projected_vertice = []
        index = 0

    triangle.forEach(point => {
        rotationXYZ = mdotMultiplyMatrix(point, rotation_z, rotation_x, rotation_z)
        projected2d = mdotmatrix(projection_matrix, rotationXYZ)
        
        x_pos = projected2d[0] * scale + circle_pos[0]
        y_pos = projected2d[1] * scale + circle_pos[1]

        projected_vertice[index] = [x_pos, y_pos]
        index++
    })
        projected_points.push(projected_vertice)
        projected_points.forEach(vertice => {drawTriangle(vertice)});
    })
    projected_points.length = 0
}

function update(deltaTime) {
    circle_pos = [canvas.width/2, canvas.height/2]
}

function render() {
    clearCanvas()
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