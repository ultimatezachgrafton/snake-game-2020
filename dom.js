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
let bombX;
let bombY;
let appleCounter = 0;
let difficultyEasy = { name: 'easy', status: 'inactive' };
let difficultyMedium = { name: 'medium', status: 'active' };
let difficultyHard = { name: 'hard', status: 'inactive' };
let currentDirection = 'right';
let isNewFruitNeeded = true;
let isNewBombNeeded = false;
let isNewGame = true;

window.onload = function () {
    const fps = 30;
    setInterval(function () {
        moveAll();
        checkCollision();
        drawAll();
    }, 1500 / fps);
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

function drawAll() {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = 'green';
    if (isNewGame) {
        canvasContext.fillRect(0, 0, 20, 20);
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
    if (isNewBombNeeded) {
        createNewBombLocation();
    } else {
        canvasContext.fillStyle = 'yellow';
        canvasContext.fillRect(bombX, bombY, 20, 20);
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

    if (snakeX === bombX && snakeY === bombY) {
        gameOver();
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
    location.reload();
    alert("Game Over");
    return false;
}

function createNewFruitLocation() {
    // check snake location for fruit generation
    fruitX = createLocationX();
    fruitY = createLocationY();
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

function createLocationX() {
    return Math.round((Math.random() * canvas.width) / 20) * 20;
}

function createLocationY() {
    return Math.round((Math.random() * canvas.height) / 20) * 20;
}

function createNewBombLocation() {
    // check snake location for fruit generation
    bombX = createLocationX();
    bombY = createLocationY();
    for (let i = 0; i <= snakeBodyLength; i++) {
        if (bombX === prevCoordinatesX[i]) {
            if (bombY === prevCoordinatesY[i]) {
                createNewBombLocation();
            }
        } else {
            canvasContext.fillStyle = 'yellow';
            canvasContext.fillRect(bombX, bombY, 20, 20);
            isNewBombNeeded = false;
        }
    }
}

function checkBorders() {
    if (difficultyEasy.status === 'active') {
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
    } else {
        if (snakeX === -20 || snakeX === 900 || snakeY === -20 || snakeY === 800) {
            gameOver();
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

document.getElementById('difficulty-easy').addEventListener('click', function () {
    if (difficultyEasy.status = 'inactive') {
        difficultyEasy.status = 'active';
        document.getElementById('difficulty-easy').innerHTML = '<u>Easy</u>';
        if (difficultyMedium.status === 'active') {
            difficultyMedium.status = 'inactive';
            document.getElementById('difficulty-medium').innerHTML = 'Medium';
            return;
        }
        if (difficultyHard.status === 'active') {
            difficultyHard.status = 'inactive';
            document.getElementById('difficulty-hard').innerHTML = 'Hard';
            return;
        }
    }
});

document.getElementById('difficulty-medium').addEventListener('click', function () {
    if (difficultyMedium.status = 'inactive') {
        difficultyMedium.status = 'active';
        document.getElementById('difficulty-medium').innerHTML = '<u>Medium</u>';
        if (difficultyEasy.status === 'active') {
            difficultyEasy.status = 'inactive';
            document.getElementById('difficulty-easy').innerHTML = 'Easy';
            return;
        }
        if (difficultyHard.status === 'active') {
            difficultyHard.status = 'inactive';
            document.getElementById('difficulty-hard').innerHTML = 'Hard';
            return;
        }
    }
});

document.getElementById('difficulty-hard').addEventListener('click', function () {
    if (difficultyHard.status = 'inactive') {
        difficultyHard.status = 'active';
        document.getElementById('difficulty-hard').innerHTML = '<u>Hard</u>';
        isNewBombNeeded = true;
        if (difficultyEasy.status === 'active') {
            difficultyEasy.status = 'inactive';
            document.getElementById('difficulty-easy').innerHTML = 'Easy';
            return;
        }
        if (difficultyMedium.status === 'active') {
            difficultyMedium.status = 'inactive';
            document.getElementById('difficulty-medium').innerHTML = 'Medium';
            return;
        }
    }
});

document.addEventListener('keydown', (event => {
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
        if (snakeY === 0 || currentDirection === 'down' || currentDirection === 'up') {
            return;
        } else {
            currentDirection = 'up';
        }
    }

    // down
    if (keyPressed === 40) {
        if (snakeY === 780 || currentDirection === 'up' || currentDirection === 'down') {
            return;
        } else {
            currentDirection = 'down';
        }
    }
}