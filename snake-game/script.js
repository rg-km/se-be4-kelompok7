const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
//made faster
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
//this
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}
const MOVE_INTERVAL = 200;

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

let snake = {
    color: "purple",
    position: initPosition(),
    direction: initDirection(),
    score: 0,
    life: 3,
}
let apple1 = {
    position: initPosition(),
}
let apple2 = {
    position: initPosition(),
}

let life = {
    color: "green",
    position: initPosition(),
    id: "lifeBoard",
}

function isPrime(number) {
    let divider = 0;

    for (let i = 1; i <= number; i++) {
        if (number % i == 0) {
            divider++
        }
    }

    return (divider == 2) ? true : false
}

function drawApple(ctx, apple) {
    base_image = new Image();
    base_image.src = 'assets/apple.png';
    ctx.drawImage(base_image, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawLife(ctx, obj) {
    ctx.fillStyle = obj.color;

    ctx.fillRect(obj.position.x * CELL_SIZE, obj.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, snake) {
    ctx.fillStyle = snake.color;
    let snake_height
    let snake_width

    if (snake.direction == DIRECTION.UP || snake.direction == DIRECTION.DOWN) {
        snake_width = CELL_SIZE
        snake_height = CELL_SIZE * (snake.score + 1)
    }

    if (snake.direction == DIRECTION.LEFT || snake.direction == DIRECTION.RIGHT) {
        snake_height = CELL_SIZE
        snake_width = CELL_SIZE * (snake.score + 1)
    }

    base_image = new Image();
    base_image.src = 'assets/snake_head.png';
    ctx.fillRect(snake.position.x * CELL_SIZE, snake.position.y * CELL_SIZE, snake_width, snake_height);
    ctx.drawImage(base_image, snake.position.x * CELL_SIZE, snake.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas = document.getElementById("score1Board");

    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "30px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(snake.score, 10, scoreCanvas.scrollHeight / 2);
}

function drawLifeCount(life) {
    let canvas = document.getElementById(life.id);
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.font = "30px Arial";
    ctx.fillStyle = life.color
    ctx.fillText("Life: " + snake.life, 10, canvas.scrollHeight / 2);
}

function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawSnake(ctx, snake)

        drawApple(ctx, apple1)
        drawApple(ctx, apple2)

        if (isPrime(snake.score)) {
            drawLife(ctx, life);
        }

        drawScore(snake);
        drawLifeCount(life);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.position.x < 0) {
        snake.position.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.position.x >= WIDTH) {
        snake.position.x = 0;
    }
    if (snake.position.y < 0) {
        snake.position.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.position.y >= HEIGHT) {
        snake.position.y = 0;
    }
}

function eat(snake, apple1, apple2) {
    if (snake.position.x == apple1.position.x && snake.position.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
    }
    if (snake.position.x == apple2.position.x && snake.position.y == apple2.position.y) {
        apple2.position = initPosition();
        snake.score++;
    }

    if (snake.position.x == life.position.x && snake.position.y == life.position.y && isPrime(snake.score)) {
        life.position = initPosition();
        snake.life++;
    }
}

function moveLeft(snake) {
    snake.position.x--;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveRight(snake) {
    snake.position.x++;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveDown(snake) {
    snake.position.y++;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function moveUp(snake) {
    snake.position.y--;
    teleport(snake);
    eat(snake, apple1, apple2);
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    setTimeout(function () {
        move(snake);
    }, MOVE_INTERVAL);
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        snake.direction = DIRECTION.LEFT;
    } else if (event.key === "ArrowRight") {
        snake.direction = DIRECTION.RIGHT;
    } else if (event.key === "ArrowUp") {
        snake.direction = DIRECTION.UP;
    } else if (event.key === "ArrowDown") {
        snake.direction = DIRECTION.DOWN;
    }
})

move(snake);