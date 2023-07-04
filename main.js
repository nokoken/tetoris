// テトリスのブロックを表す配列
const tetrominos = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]],
    [[1, 1, 1], [0, 1, 0]]
];

// テトリスのブロックの色
const colors = [
    '#000000',  // 黒
    '#FF0000',  // 赤
    '#00FF00',  // 緑
    '#0000FF',  // 青
    '#FFFF00'   // 黄
];

// ゲームボードのサイズ
const boardWidth = 12;
const boardHeight = 20;

// テトリスのブロックのサイズ
const blockSize = 20;

// ゲームボードのデータ
let board = [];

// 現在のテトリスのブロック
let currentTetromino = null;

// テトリスのブロックの位置
let currentX = 0;
let currentY = 0;

// ゲームループのインターバルID
let gameLoopId = null;

// ゲームの初期化
function initialize() {
    // ゲームボードのデータを初期化する
    console.log("動いたぜ");
    board = [];
    for (let row = 0; row < boardHeight; row++) {
        board[row] = [];
        for (let col = 0; col < boardWidth; col++) {
            board[row][col] = 0;
        }
    }

    // ゲームループを開始する
    gameLoopId = setInterval(gameLoop, 500);

    // 最初のテトリスのブロックを生成する
    spawnTetromino();
}

// テトリスのブロックを生成する
function spawnTetromino() {
    let tetrominoIndex = Math.floor(Math.random() * tetrominos.length);
    currentTetromino = tetrominos[tetrominoIndex];
    currentX = Math.floor((boardWidth - currentTetromino[0].length) / 2);
    currentY = 0;
}

// ゲームループ
function gameLoop() {
    if (isCollision(currentTetromino, currentX, currentY + 1)) {
        // テトリスのブロックが衝突した場合
        mergeTetromino();
        checkLines();
        spawnTetromino();
        if (isCollision(currentTetromino, currentX, currentY)) {
            // 新しいテトリスのブロックが生成されても衝突する場合はゲームオーバー
            gameOver();
        }
    } else {
        // テトリスのブロックを下に移動する
        currentY++;
    }
    draw();
}

// テトリスのブロックを統合する
function mergeTetromino() {
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col]) {
                board[currentY + row][currentX + col] = 1;
            }
        }
    }
}

// 行が揃っているかチェックする
function checkLines() {
    for (let row = boardHeight - 1; row >= 0; row--) {
        let lineFilled = true;
        for (let col = 0; col < boardWidth; col++) {
            if (board[row][col] === 0) {
                lineFilled = false;
                break;
            }
        }
        if (lineFilled) {
            // 揃っている行を削除する
            board.splice(row, 1);
            // 新しい行を追加する
            const newRow = [];
            for (let col = 0; col < boardWidth; col++) {
                newRow[col] = 0;
            }
            board.unshift(newRow);
        }
    }
}

// テトリスのブロックが衝突しているかチェックする
function isCollision(tetromino, x, y) {
    for (let row = 0; row < tetromino.length; row++) {
        for (let col = 0; col < tetromino[row].length; col++) {
            if (tetromino[row][col]) {
                const nextX = x + col;
                const nextY = y + row;
                if (nextY >= boardHeight || nextX < 0 || nextX >= boardWidth || board[nextY][nextX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// ゲームオーバー
function gameOver() {
    clearInterval(gameLoopId);
    alert('Game Over');
}

// 描画する
function draw() {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');

    // ゲームボードをクリアする
    context.clearRect(0, 0, canvas.width, canvas.height);

    // ゲームボードを描画する
    for (let row = 0; row < boardHeight; row++) {
        for (let col = 0; col < boardWidth; col++) {
            if (board[row][col]) {
                context.fillStyle = colors[board[row][col]];
                context.fillRect(col * blockSize, row * blockSize, blockSize, blockSize);
            }
        }
    }

    // テトリスのブロックを描画する
    if (currentTetromino) {
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (currentTetromino[row][col]) {
                    const x = (currentX + col) * blockSize;
                    const y = (currentY + row) * blockSize;
                    context.fillStyle = colors[currentTetromino[row][col]];
                    context.fillRect(x, y, blockSize, blockSize);
                }
            }
        }
    }
}

// ↓ボタンを押したときに下へ行く処理
function mino_down() {
    if (!isCollision(currentTetromino, currentX, currentY + 1)) {
        currentY++;
    }
}
// →ボタンを押したときに右へ行く処理
function mino_right() {
    if (!isCollision(currentTetromino, currentX + 1, currentY)) {
        currentX++;
    }
}
// ←ボタンを押したときに左へ行く処理
function mino_left() {
    if (!isCollision(currentTetromino, currentX - 1, currentY)) {
        currentX--;
    }
}
// 🔄ボタンを押したときにミノを回す処理
function mino_rotasion() {
    const rotatedTetromino = rotateTetromino(currentTetromino);
    if (!isCollision(rotatedTetromino, currentX, currentY)) {
        currentTetromino = rotatedTetromino;
    }
}

// キーボードの入力を処理する
document.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 37: // 左矢印キー
            if (!isCollision(currentTetromino, currentX - 1, currentY)) {
                currentX--;
            }
            break;
        case 39: // 右矢印キー
            if (!isCollision(currentTetromino, currentX + 1, currentY)) {
                currentX++;
            }
            break;
        case 40: // 下矢印キー
            if (!isCollision(currentTetromino, currentX, currentY + 1)) {
                currentY++;
            }
            break;
        case 38: // 上矢印キー
            // テトリスのブロックを回転する
            const rotatedTetromino = rotateTetromino(currentTetromino);
            if (!isCollision(rotatedTetromino, currentX, currentY)) {
                currentTetromino = rotatedTetromino;
            }
            break;
    }
    draw();
});

// テトリスのブロックを回転する
function rotateTetromino(tetromino) {
    const rotated = [];
    for (let col = 0; col < tetromino[0].length; col++) {
        const newRow = [];
        for (let row = tetromino.length - 1; row >= 0; row--) {
            newRow.push(tetromino[row][col]);
        }
        rotated.push(newRow);
    }
    return rotated;
}