// Constants
// Set color constants to change with whatever player's turn it is / When a player wins
const COLORS = {
    '1': 'red',
    '-1': 'blue'
}

// Set a constant to give each player a set number of 1 or -1
const PLAYERS = {
    '1': 'player 1',
    '-1': 'player 2'
}

// Create a PIECES object to store each type of game piece along with their color and image src
const PIECES = {
    '1': {
        name: 'pawn',
        value: 1,
        color: 'white',
        img: 'https://i.imgur.com/hAOAJM9.png'
    },
    '2': {
        name: 'king',
        value: 2,
        color: 'white',
        img: 'https://i.imgur.com/dRJVxWQ.png'
    },
    '3': {
        name: 'queen',
        value: 3,
        color: 'white',
        img: 'https://i.imgur.com/eEf9ra1.png'
    },
    '4': {
        name: 'bishop',
        value: 4,
        color: 'white',
        img: 'https://i.imgur.com/gHlGvlG.png'
    },
    '5': {
        name: 'knight',
        value: 5,
        color: 'white',
        img: 'https://i.imgur.com/gNdQZ3v.png'
    },
    '6': {
        name: 'rook',
        value: 6,
        color: 'white',
        img: 'https://i.imgur.com/APXYS0C.png'
    },
    '-1': {
        name: 'pawn',
        value: -1,
        color: 'black',
        img: 'https://i.imgur.com/67vxdVo.png'
    },
    '-2': {
        name: 'king',
        value: -2,
        color: 'black',
        img: 'https://i.imgur.com/W6wYXyH.png'
    },
    '-3': {
        name: 'queen',
        value: -3,
        color: 'black',
        img: 'https://i.imgur.com/met06db.png'
    },
    '-4': {
        name: 'bishop',
        value: -4,
        color: 'black',
        img: 'https://i.imgur.com/vwztxFW.png'
    },
    '-5': {
        name: 'knight',
        value: -5,
        color: 'black',
        img: 'https://i.imgur.com/FaZ3WKc.png'
    },
    '-6': {
        name: 'rook',
        value: -6,
        color: 'black',
        img: 'https://i.imgur.com/nQX2bU8.png'
    }
}

// State Variables
let turn // This will determine which players turn it is when the turn variable is either 1 or -1
let board // This will be a 2d rendering of the game board when creating a board within an array
let winner // This will be set to null. Player will be determined by either 1, -1, or 'stalemate'
let highlightedPrimarySquare = null
let secondaryHighlightedSquares = []
let enemyHighlightedSquares = []

// Declaration of variables to manipulate within the DOM
const playAgainBtn = document.querySelector('button')
const squares = document.querySelectorAll('.square')
const messageEl = document.querySelector('.player-turn')
const mainBoard = document.querySelector('.board')


playAgainBtn.addEventListener('click', init)
// Functions
// When this init function is ran, it will render the board with all game pieces in their initial positions
init()

function init() {
    // The turn variable is set to 1 when the init function is ran so the game starts with player 1 having
    // the first turn
    turn = 1

    // When the init function is ran, the board is rendered using this 2d array with all game pieces in
    // their initial positions
    board = [
        //   0  1  2  3  4  5   6   7
            [6, 1, 0, 0, 0, 0, -1, -6], // 0
            [5, 1, 0, 0, 0, 0, -1, -5], // 1
            [4, 1, 0, 0, 0, 0, -1, -4], // 2
            [3, 1, 0, 0, 0, 0, -1, -3], // 3
            [2, 1, 0, 0, 0, 0, -1, -2], // 4
            [4, 1, 0, 0, 0, 0, -1, -4], // 5
            [5, 1, 0, 0, 0, 0, -1, -5], // 6
            [6, 1, 0, 0, 0, 0, -1, -6]  // 7
        ];

    // The game is initiated with the winner set to 'null' until the game ends
    winner = null
    // The render function is ran to initiate all the functions that create the game (i.e renderBoard(), 
    // renderMessage(), and renderControls)
    render()
}

// Write a function that will update the state of our application and render it to the DOM
function render() {
    // Run all rendering functions
    renderBoard()
    renderMessage()
    renderButton()
}

function clearHighlights() {
    squares.forEach(square => {
        square.classList.remove('highlightedPrimary')
        square.classList.remove('highlightedSecondary')
        square.classList.remove('highlightedEnemy')
    });
};

// Create a renderBoard function
function renderBoard() {
    // Run a forEach function that will take parameters of the colArr(column array that displays each
    // individual column) and the colIdx (column index which displays each column as an indexed number)
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(rowVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`
            const cellEl = document.getElementById(cellId)

            // Clear the cell content
            cellEl.innerHTML = ``

            if (rowVal !== 0) {
                const piece = PIECES[rowVal.toString()]
                const imgEl = document.createElement('img')
                imgEl.src = piece.img
                imgEl.style.width = '7rem'
                imgEl.setAttribute('id', cellId)
                cellEl.appendChild(imgEl)
            }
        });
    });
}

function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlightedPrimary, .highlightedSecondary');
    highlightedElements.forEach(element => {
        element.classList.remove('highlightedPrimary', 'highlightedSecondary');
    });
}

function gamePiece() {
    mainBoard.addEventListener('click', function(evt) {
        const colIndex = evt.target.id.charAt(1)
        const rowIndex = evt.target.id.charAt(3)
        const colIdx = parseInt(colIndex)
        const rowIdx = parseInt(rowIndex)

        const pieceId = document.getElementById(`c${colIdx}r${rowIdx}`)
        const pieceVal = board[colIdx][rowIdx]

        // Create WHITE PAWN functionality for SECONDARY MOVE
       if(pieceVal === 1 && turn === 1 && board[colIdx][rowIdx + 1] === 0 && rowIdx !== 1) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            const wPawnSingleMove = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
            wPawnSingleMove.classList.add('highlightedSecondary')

            wPawnSingleMove.addEventListener('click', function(e) {
                e.stopPropagation()
                if(rowIdx + 1 === 7) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx + 1] = 3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx + 1] = 1
                }
                turn *= -1
                wPawnSingleMove.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedEnemy')
                })
                render()
                return
            }, {once:true}) 
            
        // Create WHITE PAWN functionality for INITIAL MOVE
        } else if(pieceVal === 1 && turn === 1 && board[colIdx][rowIdx + 1] === 0 && rowIdx === 1) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            let playerMoved = false;

            for (let i = 1; i <= 2; i++) {
                const wPawnInitialMove = document.getElementById(`c${colIdx}r${rowIdx + i}`)
                wPawnInitialMove.classList.add('highlightedSecondary')
            
                wPawnInitialMove.addEventListener('click', function(e) {
                    e.stopPropagation()
                    if (!playerMoved) { 
                        playerMoved = true;
                        board[colIdx][rowIdx] = 0
                        board[colIdx][rowIdx + i] = 1
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        wPawnInitialMove.classList.remove('highlightedSecondary')
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                    }
                }, { once: true })
                
                if (playerMoved) {
                    break;
                }
            }
            
        }

        // Create WHITE PAWN targeting for LEFT TARGET
        if(pieceVal === 1 && turn === 1 && board[colIdx - 1][rowIdx + 1] < 0) {
            const enemyTargetMoveLeft = document.getElementById(`c${colIdx -1}r${rowIdx + 1}`)
            enemyTargetMoveLeft.classList.add('highlightedEnemy')
            enemyTargetMoveLeft.addEventListener('click', function(e) {
                e.stopPropagation()
                if(rowIdx + 1 === 7) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx - 1][rowIdx + 1] = 3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx - 1][rowIdx + 1] = 1
                }
                turn *= -1
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedEnemy')
                    square.classList.remove('highlightedSecondary')
                })
                render()
                return
            }, {once:true}) 
        }

        // Create WHITE PAWN targeting for RIGHT TARGET
        if(pieceVal === 1 && turn === 1 && board[colIdx + 1][rowIdx + 1] < 0) {
            const enemyTargetMoveRight = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
            enemyTargetMoveRight.classList.add('highlightedEnemy')
            enemyTargetMoveRight.addEventListener('click', function(e) {
                e.stopPropagation()
                if(rowIdx + 1 === 7) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx + 1][rowIdx + 1] = 3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx + 1][rowIdx + 1] = 1
                }
                turn *= -1
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedEnemy')
                    square.classList.remove('highlightedSecondary')
                })
                render()
                return
            }, {once:true}) 
        }
        

        // Create BLACK PAWN functionality for SECONDARY MOVE
        if(pieceVal === -1 && turn === -1 && board[colIdx][rowIdx - 1] === 0 && rowIdx !== 6) {
            console.log('testing else')
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            const bPawnSingleMove = document.getElementById(`c${colIdx}r${rowIdx - 1}`)
            bPawnSingleMove.classList.add('highlightedSecondary')

            bPawnSingleMove.addEventListener('click', function(e) {
                e.stopPropagation()
                if(rowIdx - 1 === 0) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx - 1] = -3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx - 1] = -1
                }
                turn *= -1
                bPawnSingleMove.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                console.log(turn)
                render()
                return
            }, {once:true}) 
            
        // Create BLACK PAWN functionality for INITIAL MOVE
        } else if(pieceVal === -1 && turn === -1 && board[colIdx][rowIdx - 1] === 0 && rowIdx === 6) {
            console.log('testing else if')
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            let playerMoved = false;

            for (let i = 1; i <= 2; i++) {
                const bPawnInitialMove = document.getElementById(`c${colIdx}r${rowIdx - i}`)
                bPawnInitialMove.classList.add('highlightedSecondary')
            
                bPawnInitialMove.addEventListener('click', function(e) {
                    e.stopPropagation()
                    if (!playerMoved) { 
                        playerMoved = true;
                        board[colIdx][rowIdx] = 0
                        board[colIdx][rowIdx - i] = -1
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                        })
                        bPawnInitialMove.classList.remove('highlightedSecondary')
                        pieceId.classList.remove('highlightedPrimary')
                        console.log(turn)
                        render()
                    }
                }, { once: true })
                
                if (playerMoved) {
                    break;
                }
            } 
        }

        // Create BLACK PAWN targeting for LEFT TARGET
        if(pieceVal === -1 && turn === -1 && board[colIdx - 1][rowIdx - 1] > 0) {
            const enemyTargetMoveLeft = document.getElementById(`c${colIdx -1}r${rowIdx - 1}`)
            enemyTargetMoveLeft.classList.add('highlightedEnemy')
            enemyTargetMoveLeft.addEventListener('click', function(e) {
                e.stopPropagation()
                if(rowIdx - 1 === 0) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx - 1][rowIdx - 1] = -3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx - 1][rowIdx - 1] = -1
                }
                turn *= -1
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedEnemy')
                    square.classList.remove('highlightedSecondary')
                })
                render()
                return
            }, {once:true}) 
        }

        // Create BLACK PAWN targeting for RIGHT TARGET
        if(pieceVal === -1 && turn === -1 && board[colIdx + 1][rowIdx - 1] > 0) {
            const enemyTargetMoveRight = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
            enemyTargetMoveRight.classList.add('highlightedEnemy')
            enemyTargetMoveRight.addEventListener('click', function(e) {
                e.stopPropagation()
                if(rowIdx - 1 === 0) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx + 1][rowIdx - 1] = -3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx + 1][rowIdx - 1] = -1
                }
                turn *= -1
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedEnemy')
                    square.classList.remove('highlightedSecondary')
                })
                render()
                return
            }, {once:true}) 
        }
        
    })
}

gamePiece();

// Create a renderMessage function that will change the messages in the game depending on who's turn it is
// and who has won (or if there is a stalemate)
function renderMessage() {
    // Create an if statement to see if the 'winner' is equal to 'stalemate'
    if(winner === 'stalemate') {
        // The message element should contain a textContent of STALEMATE
        messageEl.textContent = `STALEMATE!`
    // Create an else if statement that checks for 'winner'
    } else if(winner) {
        // The message element should render a message with a span tag to change the color of the player's name
            // To change player's color, use COLORS[winner] to grab the winner player's color from the constant above
            // Then to have the player's name is rendered, do PLAYERS[winner] and set it to uppercase
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${PLAYERS[winner].toUpperCase()}</span> Wins!`
    } else {
        // If there is not a stalemate or a winner, then render a similar message to say who's turn it is
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${PLAYERS[turn].toUpperCase()}</span>'s turn!`
    }
}

function renderButton() {
// Change visibility of btn depending on state of game using a ternary statement
    !winner ? playAgainBtn.style.visibility = 'hidden':playAgainBtn.style.visibility = 'visible' 
}