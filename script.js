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

const listeners = {}


function gamePiece() {
    mainBoard.addEventListener('click', function(evt) {
        const colIndex = evt.target.id.charAt(1)
        const rowIndex = evt.target.id.charAt(3)
        const colIdx = parseInt(colIndex)
        const rowIdx = parseInt(rowIndex)

        const pieceId = document.getElementById(`c${colIdx}r${rowIdx}`)
        const pieceVal = board[colIdx][rowIdx]
        

        function removeListeners() {
            for(let key in listeners) {
                listeners[key].el.removeEventListener('click', listeners[key].fn)
                delete listeners[key]
            }
        }
        
        // Create WHITE PAWN functionality for SECONDARY MOVE
       if(pieceVal === 1 && turn === 1 && board[colIdx][rowIdx + 1] === 0 && rowIdx !== 1) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            const wPawnSingleMoveEl = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
            wPawnSingleMoveEl.classList.add('highlightedSecondary')

            function whitePawnSingleMove(e) {
                e.stopPropagation()
                if(rowIdx + 1 === 7) {
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx + 1] = 3
                } else {
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx + 1] = 1
                }
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }
            listeners[`c${colIdx}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx}r${rowIdx + 1}`].fn = whitePawnSingleMove 
            listeners[`c${colIdx}r${rowIdx + 1}`].el = wPawnSingleMoveEl 
            wPawnSingleMoveEl.addEventListener('click', whitePawnSingleMove, {once:true}) 
            
        // Create WHITE PAWN functionality for INITIAL MOVE
        } else if(pieceVal === 1 && turn === 1 && board[colIdx][rowIdx + 1] === 0 && rowIdx === 1) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            let playerMoved = false;

            for (let i = 1; i <= 2; i++) {
                const wPawnInitialMoveEl = document.getElementById(`c${colIdx}r${rowIdx + i}`)
                wPawnInitialMoveEl.classList.add('highlightedSecondary')
            
                function whitePawnInitialMove(e) {
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
                        wPawnInitialMoveEl.classList.remove('highlightedSecondary')
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }
                }

                listeners[`c${colIdx}r${rowIdx + i}`] = {}
                listeners[`c${colIdx}r${rowIdx + i}`].fn = whitePawnInitialMove 
                listeners[`c${colIdx}r${rowIdx + i}`].el = wPawnInitialMoveEl 
                wPawnInitialMoveEl.addEventListener('click', whitePawnInitialMove, { once: true })
                
                if (playerMoved) {
                    break;
                }
            }
            
        }

        // Create WHITE PAWN targeting for LEFT TARGET
        if(pieceVal === 1 && turn === 1 && board[colIdx - 1][rowIdx + 1] < 0) {
            const whiteLeftTargetEl = document.getElementById(`c${colIdx -1}r${rowIdx + 1}`)
            whiteLeftTargetEl.classList.add('highlightedEnemy')

            function whiteLeftTarget(e) {
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
            }

            listeners[`c${colIdx - 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].fn = whiteLeftTarget 
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].el = whiteLeftTargetEl 

            whiteLeftTargetEl.addEventListener('click', whiteLeftTarget, {once:true}) 
        }

        // Create WHITE PAWN targeting for RIGHT TARGET
        if(pieceVal === 1 && turn === 1 && board[colIdx + 1][rowIdx + 1] < 0) {
            const whiteRightTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
            whiteRightTargetEl.classList.add('highlightedEnemy')

            function whiteRightTarget(e) {
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
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].fn = whiteRightTarget 
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].el = whiteRightTargetEl 

            whiteRightTargetEl.addEventListener('click', whiteRightTarget, {once:true}) 
        }
        

        // Create BLACK PAWN functionality for SECONDARY MOVE
       if(pieceVal === -1 && turn === -1 && board[colIdx][rowIdx - 1] === 0 && rowIdx !== 6) {
        clearHighlights();
        pieceId.classList.add('highlightedPrimary')
        
        const bPawnSingleMoveEl = document.getElementById(`c${colIdx}r${rowIdx - 1}`)
        bPawnSingleMoveEl.classList.add('highlightedSecondary')

        function blackPawnSingleMove(e) {
            e.stopPropagation()
            if(rowIdx - 1 === 0) {
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx - 1] = -3
            } else {
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx - 1] = -1
            }
            turn *= -1
            this.classList.remove('highlightedSecondary')
            pieceId.classList.remove('highlightedPrimary')
            squares.forEach(square => {
                square.classList.remove('highlightedEnemy')
            })
            render()
            removeListeners()
            return
        }
        listeners[`c${colIdx}r${rowIdx - 1}`] = {}
        listeners[`c${colIdx}r${rowIdx - 1}`].fn = blackPawnSingleMove 
        listeners[`c${colIdx}r${rowIdx - 1}`].el = bPawnSingleMoveEl 
        bPawnSingleMoveEl.addEventListener('click', blackPawnSingleMove, {once:true})
            
        // Create BLACK PAWN functionality for INITIAL MOVE
        } else if(pieceVal === -1 && turn === -1 && board[colIdx][rowIdx - 1] === 0 && rowIdx === 6) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')
            
            let playerMoved = false;

            for (let i = 1; i <= 2; i++) {
                const bPawnInitialMoveEl = document.getElementById(`c${colIdx}r${rowIdx - i}`)
                bPawnInitialMoveEl.classList.add('highlightedSecondary')
            
                function blackPawnInitialMove(e) {
                    e.stopPropagation()
                    if (!playerMoved) { 
                        playerMoved = true;
                        board[colIdx][rowIdx] = 0
                        board[colIdx][rowIdx - i] = -1
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        bPawnInitialMoveEl.classList.remove('highlightedSecondary')
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }
                }

                listeners[`c${colIdx}r${rowIdx - i}`] = {}
                listeners[`c${colIdx}r${rowIdx - i}`].fn = blackPawnInitialMove 
                listeners[`c${colIdx}r${rowIdx - i}`].el = bPawnInitialMoveEl 
                bPawnInitialMoveEl.addEventListener('click', blackPawnInitialMove, { once: true })
                
                if (playerMoved) {
                    break;
                }
            }
            
        }

        // Create BLACK PAWN targeting for LEFT TARGET
        if(pieceVal === -1 && turn === -1 && board[colIdx - 1][rowIdx - 1] > 0) {
            const blackLeftTargetEl = document.getElementById(`c${colIdx -1}r${rowIdx - 1}`)
            blackLeftTargetEl.classList.add('highlightedEnemy')

            function blackLeftTarget(e) {
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
                removeListeners()
                render()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].fn = blackLeftTarget 
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].el = blackLeftTargetEl 

            blackLeftTargetEl.addEventListener('click', blackLeftTarget, {once:true}) 
        }

        // Create WHITE PAWN targeting for RIGHT TARGET
        if(pieceVal === -1 && turn === -1 && board[colIdx + 1][rowIdx - 1] > 0) {
            const blackRightTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
            blackRightTargetEl.classList.add('highlightedEnemy')

            function blackRightTarget(e) {
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
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].fn = blackRightTarget 
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].el = blackRightTargetEl 

            blackRightTargetEl.addEventListener('click', blackRightTarget, {once:true}) 
        }

        // Create WHITE QUEEN functionality for NORTH movement && NORTH TARGETING
        if (pieceVal === 3 && turn === 1 && board[colIdx][rowIdx + 1] === 0) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')

            let playerMoved = false;

            for (let i = 1; i <= board.length; i++) {
                const nextRowIdx = rowIdx + i;
                const targetRowIdx = nextRowIdx + 1
                if (nextRowIdx >= board.length || board[colIdx][nextRowIdx] !== 0) {
                    break
                }

                const wQueenNorthMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                const wQueenNorthMoveTargetEl = document.getElementById(`c${colIdx}r${targetRowIdx}`)
                wQueenNorthMoveEl.classList.add('highlightedSecondary')

                if(board[colIdx][targetRowIdx] < 0) {
                    wQueenNorthMoveTargetEl.classList.add('highlightedEnemy')
                }

                function wQueenNorthMoveTarget(e) {
                    e.stopPropagation()
                    board[colIdx][rowIdx] = 0
                    board[colIdx][targetRowIdx] = 3
                    turn *= -1
                    squares.forEach(square => {
                        square.classList.remove('highlightedSecondary')
                        square.classList.remove('highlightedEnemy')
                    })
                    wQueenNorthMoveTargetEl.classList.remove('highlightedSecondary')
                    wQueenNorthMoveTargetEl.classList.remove('highlightedEnemy')
                    pieceId.classList.remove('highlightedPrimary')
                    removeListeners()
                    render()
                }

                listeners[`c${colIdx}r${rowIdx + 1}`] = {}
                listeners[`c${colIdx}r${rowIdx + 1}`].fn = wQueenNorthMoveTarget 
                listeners[`c${colIdx}r${rowIdx + 1}`].el = wQueenNorthMoveTargetEl 

                wQueenNorthMoveTargetEl.addEventListener('click', wQueenNorthMoveTarget, { once: true })

                function whiteQueenNorthMove(e) {
                    e.stopPropagation()
                    if (!playerMoved) {
                        playerMoved = true;
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        wQueenNorthMoveEl.classList.remove('highlightedSecondary')
                        wQueenNorthMoveEl.classList.remove('highlightedEnemy')
                        pieceId.classList.remove('highlightedPrimary')
                        removeListeners()
                        render()
                    }
                }

                listeners[`c${colIdx}r${nextRowIdx}`] = {}
                listeners[`c${colIdx}r${nextRowIdx}`].fn = whiteQueenNorthMove 
                listeners[`c${colIdx}r${nextRowIdx}`].el = wQueenNorthMoveEl 

                wQueenNorthMoveEl.addEventListener('click', whiteQueenNorthMove, { once: true })

                if (playerMoved) {
                    break;
                }
            }
        }
        
        if (pieceVal === 3 && turn === 1 && board[colIdx][rowIdx + 1] < 0) {
            clearHighlights();
            pieceId.classList.add('highlightedPrimary')

                const wQueenNorthTargetEl = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
                wQueenNorthTargetEl.classList.add('highlightedEnemy')

                function whiteQueenNorthTarget(e) {
                    e.stopPropagation()
                    board[colIdx][rowIdx] = 0
                    board[colIdx][rowIdx + 1] = 3
                    turn *= -1
                    squares.forEach(square => {
                        square.classList.remove('highlightedSecondary')
                        square.classList.remove('highlightedEnemy')
                    })
                    wQueenNorthTargetEl.classList.remove('highlightedSecondary')
                    wQueenNorthTargetEl.classList.remove('highlightedEnemy')
                    pieceId.classList.remove('highlightedPrimary')
                    removeListeners()
                    render()
                }

                listeners[`c${colIdx}r${rowIdx + 1}`] = {}
                listeners[`c${colIdx}r${rowIdx + 1}`].fn = whiteQueenNorthTarget 
                listeners[`c${colIdx}r${rowIdx + 1}`].el = wQueenNorthTargetEl 

                wQueenNorthTargetEl.addEventListener('click', whiteQueenNorthTarget, { once: true })
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