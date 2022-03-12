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

function initHeadAndBody() {
    let head = initPosition();
    let body = [{
        x: head.x,
        y: head.y,
    }];

    return {
        head: head,
        body: body,
    }
}

function initDirection() {
    return Math.floor(Math.random() * 4);
}

let snake1 = {
    color: "purple",
    ...initHeadAndBody(),
    direction: initDirection(),
    boardId: "score1Board",
    score: 0,
    life: 3,
}

let apple1 = {
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

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawApple(ctx, apple) {
    base_image = new Image();
    base_image.src = 'assets/apple.png';
    ctx.drawImage(base_image, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawLife(ctx, life) {
    ctx.fillStyle = life.color;

    ctx.fillRect(life.position.x * CELL_SIZE, life.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawSnake(ctx, snake) {
    ctx.fillStyle = snake.color;
    base_image = new Image();
    base_image.src = 'assets/snake_head.png';

    // draw head
    drawCell(ctx, snake.head.x, snake.head.y, snake.color);
    ctx.drawImage(base_image, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // draw body
    for (let i = 1; i < snake.body.length; i++) {
        drawCell(ctx, snake.body[i].x, snake.body[i].y, snake.color);
    }
}

function drawScore(snake) {
    let scoreCanvas = document.getElementById(snake.boardId);

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
    ctx.fillText("Life: " + snake1.life, 10, canvas.scrollHeight / 2);
}

function draw() {
    setInterval(function () {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        drawSnake(ctx, snake1)
        drawApple(ctx, apple1)

        if (isPrime(snake1.score)) {
            drawLife(ctx, life);
        }

        drawScore(snake1);
        drawLifeCount(life);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apple1) {
    if (snake.head.x == apple1.position.x && snake.head.y == apple1.position.y) {
        apple1.position = initPosition();
        snake.score++;
        snake.body.push({
            x: snake.head.x,
            y: snake.head.y,
        });
    }

    if (snake.head.x == life.position.x && snake.head.y == life.position.y && isPrime(snake.score)) {
        life.position = initPosition();
        snake.life++;
    }
}

function moveBody(snake) {
    snake.body.unshift({
        x: snake.head.x,
        y: snake.head.y,
    });
    snake.body.pop();
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            snake.head.x--;
            break;
        case DIRECTION.RIGHT:
            snake.head.x++;
            break;
        case DIRECTION.UP:
            snake.head.y--;
            break;
        case DIRECTION.DOWN:
            snake.head.y++;
            break;
    }

    teleport(snake);
    eat(snake, apple1);
    moveBody(snake);

    setTimeout(function () {
        move(snake);
    }, MOVE_INTERVAL);
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowLeft":
            if (snake1.direction != DIRECTION.RIGHT) {
                snake1.direction = DIRECTION.LEFT;
            }

            break;
        case "ArrowRight":
            if (snake1.direction != DIRECTION.LEFT) {
                snake1.direction = DIRECTION.RIGHT;
            }

            break;
        case "ArrowUp":
            if (snake1.direction != DIRECTION.DOWN) {
                snake1.direction = DIRECTION.UP;
            }

            break;
        case "ArrowDown":
            if (snake1.direction != DIRECTION.UP) {
                snake1.direction = DIRECTION.DOWN;
            }

            break;
    }
})

move(snake1);