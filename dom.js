const canvas = document.getElementById('game-canvas');
let canvasContext = canvas.getContext('2d');

let snake = {
    body: [
        { x: 60, y: 0 },
        { x: 60, y: 0 },
        { x: 60, y: 0 }
    ],
    currentDirection: 'right'
}

let fruit = {
    x: undefined,
    y: undefined
}

let bomb = {
    x: undefined,
    y: undefined
}

let appleCounter = 0;
let difficultyEasy = { name: 'easy', status: 'inactive' };
let difficultyMedium = { name: 'medium', status: 'active' };
let difficultyHard = { name: 'hard', status: 'inactive' };
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
    for (let i = snake.body.length - 1; i > 0; i--) {
        snake.body[i] = Object.assign({}, snake.body[i - 1]);
    }

    if (snake.currentDirection === 'right') {
        if (snake.body[0].x === 880) {
            return;
        } else {
            snake.body[0].x = snake.body[0].x + 20;
            return;
        }
    }
    if (snake.currentDirection === 'left') {
        if (snake.body[0].x === 0) {
            return;
        } else {
            snake.body[0].x = snake.body[0].x - 20;
            return;
        }
    }
    if (snake.currentDirection === 'up') {
        if (snake.body[0].y === 0) {
            return;
        } else {
            snake.body[0].y = snake.body[0].y - 20;
            return;
        }
    }
    if (snake.currentDirection === 'down') {
        if (snake.body[0].y === 780) {
            return;
        } else {
            snake.body[0].y = snake.body[0].y + 20;
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
        canvasContext.fillRect(snake.body[0].x, snake.body[0].y, 20, 20);
        for (let i = 0; i < snake.body.length; i++) {
            canvasContext.fillRect(snake.body[i].x, snake.body[i].y, 20, 20);
        }
    }
    if (isNewFruitNeeded) {
        createNewFruitLocation();
    } else {
        canvasContext.fillStyle = 'red';
        canvasContext.fillRect(fruit.x, fruit.y, 20, 20);
    }
    if (isNewBombNeeded) {
        createNewBombLocation();
    } else {
        canvasContext.fillStyle = 'yellow';
        canvasContext.fillRect(bomb.x, bomb.y, 20, 20);
    }

    document.getElementById('apple-counter').innerHTML = "Apples: " + appleCounter;
}

function checkCollision() {
    checkBorders();

    if (snake.body[0].x === fruit.x && snake.body[0].y === fruit.y) {
        createNewFruitLocation();
        growSnake();
        appleCounter++;
    }

    if (snake.body[0].x === bomb.x && snake.body[0].y === bomb.y) {
        gameOver();
    }

    for (let i = 1; i < snake.body.length; i++) {
        if (snake.body[0].x === snake.body[i].x) {
            if (snake.body[0].y === snake.body[i].y) {
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
    fruit.x = createLocationX();
    fruit.y = createLocationY();
    for (let i = 0; i < snake.body.length; i++) {
        if (fruit.x === snake.body[i].x) {
            if (fruit.y === snake.body[i].y) {
                createNewFruitLocation();
            }
        } else {
            canvasContext.fillStyle = 'red';
            canvasContext.fillRect(fruit.x, fruit.y, 20, 20);
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
    bomb.x = createLocationX();
    bomb.y = createLocationY();
    for (let i = 0; i <= snake.body.length; i++) {
        if (bomb.x === snake.body[i].x) {
            if (bomb.y === snake.body[i].y) {
                createNewBombLocation();
            }
        } else {
            canvasContext.fillStyle = 'yellow';
            canvasContext.fillRect(bomb.x, bomb.y, 20, 20);
            isNewBombNeeded = false;
        }
    }
}

function checkBorders() {
    if (difficultyEasy.status === 'active') {
        if (snake.currentDirection === 'left' || snake.currentDirection === 'right') {
            if (snake.body[0].x === 880 && snake.body[0].y === 0) {
                snake.currentDirection = 'down';
                return;
            }
            if (snake.body[0].x === 880 && snake.body[0].y === 780) {
                snake.currentDirection = 'up';
                return;
            }
            if (snake.body[0].x === 0 && snake.body[0].y === 0) {
                snake.currentDirection = 'down';
                return;
            }
            if (snake.body[0].x === 0 && snake.body[0].y === 780) {
                snake.currentDirection = 'up';
                return;
            }

            if (snake.body[0].x === 0 || snake.body[0].x === 880) {
                if ((Math.floor(Math.random() * (1 + 2 - 1)) + 1) > 1) {
                    snake.currentDirection = 'up';
                } else {
                    snake.currentDirection = 'down';
                }
            }
            return;
        }

        if (snake.currentDirection === 'up' || snake.currentDirection === 'down') {
            if (snake.body[0].x === 0 && snake.body[0].y === 0) {
                snake.currentDirection = 'right';
                return;
            }
            if (snake.body[0].x === 880 && snake.body[0].y === 0) {
                snake.currentDirection = 'left';
                return;
            }
            if (snake.body[0].x === 0 && snake.body[0].y === 780) {
                snake.currentDirection = 'right';
                return;
            }
            if (snake.body[0].x === 880 && snake.body[0].y === 780) {
                snake.currentDirection = 'left';
                return;
            }

            if (snake.body[0].y === 0 || snake.body[0].y === 780) {
                if ((Math.floor(Math.random() * (1 + 2 - 1)) + 1) > 1) {
                    snake.currentDirection = 'left';
                } else {
                    snake.currentDirection = 'right';
                }
                return;
            }
        }
    } else {
        if (snake.body[0].x === -20 || snake.body[0].x === 900 || snake.body[0].y === -20 || snake.body[0].y === 800) {
            gameOver();
        }
    }
}

function growSnake() {
    const snakeTail = snake.body[snake.body.length - 1];
    const tailCopy = Object.assign({}, snakeTail);
    snake.body.push(tailCopy);
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
        if (snake.body[0].x === 880 || snake.currentDirection === 'left' || snake.currentDirection === 'right') {
            return;
        } else {
            snake.currentDirection = 'right';
            return;
        }
    }

    // left
    if (keyPressed === 37) {
        if (snake.body[0].x === 0 || snake.currentDirection === 'right' || snake.currentDirection === 'left') {
            return;
        } else {
            snake.currentDirection = 'left';
            return;
        }
    }

    // up
    if (keyPressed === 38) {
        if (snake.body[0].y === 0 || snake.currentDirection === 'down' || snake.currentDirection === 'up') {
            return;
        } else {
            snake.currentDirection = 'up';
        }
    }

    // down
    if (keyPressed === 40) {
        if (snake.body[0].y === 780 || snake.currentDirection === 'up' || snake.currentDirection === 'down') {
            return;
        } else {
            snake.currentDirection = 'down';
        }
    }
}