const canvas = document.getElementById('game-canvas');
let canvasContext = canvas.getContext('2d');
let snakeX = 60;
let snakeY = 0;
let snakeHead = [snakeX, snakeY];
let snakeBody = [];
let snake = [snakeHead];
let snakeBodyLength = 3;
let prevCoordinatesX = [40, 20];
let prevCoordinatesY = [0, 0, 0];
let fruitX;
let fruitY;
let appleCounter = 0;
let currentDirection = 'right';
let isNewFruitNeeded = true;
let isNewGame = true;

window.onload = function() {
    const fps = 30;
    setInterval(function() {
        moveAll();
        checkCollision();
        drawAll();
    }, 1500/fps );
}

function moveAll() {
    trackPrevCoordinates();

    if (currentDirection === 'right') {
        if (snakeX === 880) {
            return;
        } else {
            snakeX = snakeX + 20;
            return;
        }
    }
    if (currentDirection === 'left') {
        if (snakeX === 0) {
            return;
        } else {
            snakeX = snakeX - 20;
            return;
        }
    }
    if (currentDirection === 'up') {
        if (snakeY === 0) {
            return;
        } else {
            snakeY = snakeY - 20;
            return;
        }
    }
    if (currentDirection === 'down') {
        if (snakeY === 780) {
            return;
        } else {
            snakeY = snakeY + 20;
            return;
        }
    }
}

function drawAll () {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0,0,canvas.width, canvas.height);
    canvasContext.fillStyle = 'green';
    if (isNewGame) {
        canvasContext.fillRect(0,0, 20, 20);
        isNewGame = false;
    } else {
        canvasContext.fillRect(snakeX, snakeY, 20, 20);
        for (let i = 0; i < snakeBodyLength; i++) {
            canvasContext.fillRect(prevCoordinatesX[i], prevCoordinatesY[i], 20, 20);
        }
    }
    if (isNewFruitNeeded) {
        createNewFruitLocation();
    } else {
       canvasContext.fillStyle = 'red';
       canvasContext.fillRect(fruitX, fruitY, 20, 20);
    }
    document.getElementById('apple-counter').innerHTML = "Apples: " + appleCounter;
}

function checkCollision() {
    checkBorders();

    if (snakeX === fruitX && snakeY === fruitY) {
        createNewFruitLocation();
        growSnake();
        appleCounter++;
    }

    for (let i = 0; i <= snakeBodyLength; i++) {
        if (snakeX === prevCoordinatesX[i]) {
            if (snakeY === prevCoordinatesY[i]) {
                gameOver();
            }
        }
    }
}

function gameOver() {
    alert("Game Over");
    location.reload();
    return false;
}

function createNewFruitLocation() {
    // check snake location for fruit generation
    fruitX = createFruitLocationX();
    fruitY = createFruitLocationY();
    for (let i = 0; i <= snakeBodyLength; i++) {
        if (fruitX === prevCoordinatesX[i]) {
            if (fruitY === prevCoordinatesY[i]) {
                createNewFruitLocation();
            }
        } else {
            canvasContext.fillStyle = 'red';
            canvasContext.fillRect(fruitX, fruitY, 20, 20);
            isNewFruitNeeded = false;
        }
    }
}

function createFruitLocationX() {
    return Math.round((Math.random() * canvas.width) / 20)*20;
}

function createFruitLocationY() {
    return Math.round((Math.random() * canvas.height) / 20)*20;
}

function checkBorders() {  
    if (currentDirection === 'left' || currentDirection === 'right') {
        if (snakeX === 880 && snakeY === 0) {
            currentDirection = 'down';
            return;
        }
        if (snakeX === 880 && snakeY === 780) {
            currentDirection = 'up';
            return;
        }
        if (snakeX === 0 && snakeY === 0) {
            currentDirection = 'down';
            return;
        }
        if (snakeX === 0 && snakeY === 780) {
            currentDirection = 'up';
            return;
        }

        if (snakeX === 0 || snakeX === 880) {
            if ((Math.floor(Math.random() * (1 + 2 - 1)) + 1) > 1) {
                currentDirection = 'up';
            } else {
                currentDirection = 'down';
            }
        }
        return;
    }

    if (currentDirection === 'up' || currentDirection === 'down') {
        if (snakeX === 0 && snakeY === 0) {
            currentDirection = 'right';
            return;
        }
        if (snakeX === 880 && snakeY === 0) {
            currentDirection = 'left';
            return;
        }
        if (snakeX === 0 && snakeY === 780) {
            currentDirection = 'right';
            return;
        }
        if (snakeX === 880 && snakeY === 780) {
            currentDirection = 'left';
            return;
        }

        if (snakeY === 0 || snakeY === 780) {
            if ((Math.floor(Math.random() * (1 + 2 - 1)) + 1) > 1) {
                currentDirection = 'left';
            } else {
                currentDirection = 'right';
            }
            return;
        }
    } 
}

function growSnake() {
    snakeBodyLength++;
}

function trackPrevCoordinates() {    
    prevCoordinatesX.unshift(snakeX);
    prevCoordinatesY.unshift(snakeY);
}

document.addEventListener('keydown', (event => 
    {
        onKeyDown(event);
    })
)

function onKeyDown(event) {
    let keyPressed = event.keyCode;

    // right
    if (keyPressed === 39) {
        if (snakeX === 880 || currentDirection === 'left' || currentDirection === 'right') {
            return; 
        } else {
            currentDirection = 'right';
            return;
        }
    } 
    
    // left
    if (keyPressed === 37) {
        if (snakeX === 0 || currentDirection === 'right' || currentDirection === 'left') {
            return;
        } else {
            currentDirection = 'left';
            return;
        }
    }

    // up
    if (keyPressed === 38) {
        if (snakeY === 0 ||currentDirection === 'down' || currentDirection === 'up') {
            return;
        } else {
            currentDirection = 'up';
        }
    }

    // down
    if (keyPressed === 40) {
        if (snakeY === 780 || currentDirection === 'up'|| currentDirection === 'down') {
            return;
        } else {
            currentDirection = 'down';
        }
    }
}