// Variáveis globais para dificuldade e recordes
let difficulty = 'medio';
let countdownInterval;
let gameStarted = false;
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Função para atualizar a tabela de recordes
function updateHighScoresTable() {
    const tableBody = document.querySelector('#highScoresTable tbody');
    tableBody.innerHTML = '';
    highScores.sort((a, b) => b.score - a.score); // Ordena os recordes por pontuação
    highScores.forEach((score, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${score.difficulty}</td>
            <td>${score.score}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Função para salvar o recorde
function saveHighScore(difficulty, score) {
    highScores.push({ difficulty, score });
    highScores.sort((a, b) => b.score - a.score); // Ordena os recordes por pontuação
    localStorage.setItem('highScores', JSON.stringify(highScores));
    updateHighScoresTable();
}

// Função para iniciar a contagem regressiva
function startCountdown() {
    const countdownDisplay = document.getElementById('countdown');
    let timeLeft = 3;
    countdownDisplay.textContent = timeLeft;
    countdownDisplay.style.display = 'block';

    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            document.getElementById('startScreen').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'block';
            createBricks();
            gameStarted = true;
            updateGame();
        }
    }, 1000);
}

// Função para iniciar o jogo com a dificuldade selecionada
function startGame(level) {
    difficulty = level;
    document.getElementById('startScreen').style.display = 'none';
    startCountdown();
}

// Função para reiniciar o jogo
function restartGame() {
    window.location.reload();
}

// Inicializa o jogo
const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const bricksContainer = document.getElementById('bricks');
const container = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const messageText = document.getElementById('messageText');
const restartButton = document.getElementById('restartButton');

// Propriedades da bola
let ballSize = ball.offsetWidth;
let ballX, ballY, ballDX, ballDY;

// Propriedades da barra
let paddleWidth = paddle.offsetWidth;
let paddleHeight = paddle.offsetHeight;
let paddleX;
let paddleSpeed = 7;

// Propriedades dos blocos
let brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft;
let brickRowCount = 3;
let brickColumnCount = 5;
const bricks = [];
let score = 0;

// Configurações baseadas na dificuldade
function setDifficulty(level) {
    switch (level) {
        case 'facil':
            ballDX = 2;
            ballDY = -2;
            brickRowCount = 2;
            brickColumnCount = 4;
            break;
        case 'medio':
            ballDX = 3;
            ballDY = -3;
            brickRowCount = 3;
            brickColumnCount = 5;
            break;
        case 'dificil':
            ballDX = 5;
            ballDY = -5;
            brickRowCount = 4;
            brickColumnCount = 6;
            break;
        case 'expert':
            paddleSpeed = 10;
            ballDX = 7;
            ballDY = -7;
            brickRowCount = 4;
            brickColumnCount = 6;
            break;
    }
    brickWidth = container.offsetWidth / brickColumnCount * 0.8; // Ajuste a largura dos blocos
    brickHeight = 20;
    brickPadding = 10;
    brickOffsetTop = 30;
    brickOffsetLeft = 30;
}

// Criar blocos
function createBricks() {
    bricksContainer.innerHTML = ''; // Limpar blocos existentes
    setDifficulty(difficulty);
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const brick = document.createElement('div');
            brick.classList.add('brick');
            brick.style.width = `${brickWidth}px`;
            brick.style.height = `${brickHeight}px`;
            brick.style.top = `${brickOffsetTop + r * (brickHeight + brickPadding)}px`;
            brick.style.left = `${brickOffsetLeft + c * (brickWidth + brickPadding)}px`;
            bricksContainer.appendChild(brick);
            bricks.push(brick);
        }
    }
    ballX = container.offsetWidth / 2 - ballSize / 2;
    ballY = container.offsetHeight - 30 - ballSize;
    paddleX = container.offsetWidth / 2 - paddleWidth / 2;
}

// Controle do teclado
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

// Controles móveis
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

leftButton.addEventListener('touchstart', () => {
    if (gameStarted) leftPressed = true;
});

leftButton.addEventListener('touchend', () => {
    leftPressed = false;
});

rightButton.addEventListener('touchstart', () => {
    if (gameStarted) rightPressed = true;
});

rightButton.addEventListener('touchend', () => {
    rightPressed = false;
});

// Função de atualização do jogo
function updateGame() {
    // Atualiza as dimensões e posições
    ballSize = ball.offsetWidth;
    ballX = parseFloat(ball.style.left || ballX);
    ballY = parseFloat(ball.style.top || ballY);
    paddleWidth = paddle.offsetWidth;
    paddleX = parseFloat(paddle.style.left || paddleX);

    // Movimento da bola
    ballX += ballDX;
    ballY += ballDY;

    if (ballY + ballDY >= container.offsetHeight - ballSize) {
        saveHighScore(difficulty, score);
        messageText.textContent = 'Game Over!';
        messageDisplay.style.display = 'block';
        restartButton.style.display = 'block';
        return;
    }

    // Colisão com as bordas
    if (ballX + ballDX > container.offsetWidth - ballSize || ballX + ballDX < 0)
        ballDX = -ballDX;

    if (ballY + ballDY < 0) {
        ballDY = -ballDY;
    } else if (ballY + ballDY >= container.offsetHeight - ballSize - 20) {
        if (ballX + ballDY + 30 > paddleX - ballSize && ballX < paddleX + paddleWidth - ballSize - 20)
            ballDY = -ballDY;
    }

    // Movimento da barra
    if (rightPressed && paddleX < container.offsetWidth - paddleWidth + 30) {
        paddleX += paddleSpeed;
    } else if (leftPressed && paddleX > 40) {
        paddleX -= paddleSpeed;
    }
    paddle.style.left = `${paddleX}px`;

    // Atualizar a posição da bola
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    // Colisão com os blocos
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];
        const brickX = brick.offsetLeft;
        const brickY = brick.offsetTop;
        const brickWidth = brick.offsetWidth;
        const brickHeight = brick.offsetHeight;

        if (ballX > brickX && ballX < brickX + brickWidth && ballY > brickY && ballY < brickY + brickHeight) {
            ballDY = -ballDY;
            bricks.splice(i, 1);
            bricksContainer.removeChild(brick);
            score++;
            scoreDisplay.textContent = `Pontuação: ${score}`;
            var audio = new Audio('audio/fireball.mp3');
            audio.play();
            if (bricks.length === 0) {
                var audio = new Audio('audio/vitoria.mp3');
                audio.play();
                saveHighScore(difficulty, score);
                messageText.textContent = 'Você Ganhou!';
                messageDisplay.style.display = 'block';
                restartButton.style.display = 'block';
                return;
            }
            break;
        }
    }

    requestAnimationFrame(updateGame);
}

// Inicializa a tela de recordes
updateHighScoresTable();
