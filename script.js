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
const IMAGES = {
    '1': {img: 'https://i.imgur.com/hAOAJM9.png'}, // White Pawn
    '2': {img: 'https://i.imgur.com/dRJVxWQ.png'}, // White King
    '3': {img: 'https://i.imgur.com/eEf9ra1.png'}, // White Queen
    '4': {img: 'https://i.imgur.com/gHlGvlG.png'}, // White Bishop
    '5': {img: 'https://i.imgur.com/gNdQZ3v.png'}, // White Knight
    '6': {img: 'https://i.imgur.com/APXYS0C.png'}, // White Rook
    '-1': {img: 'https://i.imgur.com/67vxdVo.png'}, // Black Pawn
    '-2': {img: 'https://i.imgur.com/W6wYXyH.png'}, // Black King
    '-3': {img: 'https://i.imgur.com/met06db.png'}, // Black Queen
    '-4': {img: 'https://i.imgur.com/vwztxFW.png'}, // Black Bishop
    '-5': {img: 'https://i.imgur.com/FaZ3WKc.png'}, // Black Knight
    '-6': {img: 'https://i.imgur.com/nQX2bU8.png'} // Black Rook
}

// State Variables
let turn // This will determine which players turn it is when the turn variable is either 1 or -1
let board // This will be a 2d rendering of the game board when creating a board within an array
let winner // This will be set to null. Player will be determined by either 1, -1, or 'stalemate'
let highlightedPrimarySquare = null
let secondaryHighlightedSquares = []
let enemyHighlightedSquares = []
let playerOneCheck = false
let playerTwoCheck = false
let playerOneCheckmate = false
let playerTwoCheckmate = false

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
        ]

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
    })
}

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
                const piece = IMAGES[rowVal.toString()]
                const imgEl = document.createElement('img')
                imgEl.src = piece.img
                imgEl.style.width = '7rem'
                imgEl.setAttribute('id', cellId)
                cellEl.appendChild(imgEl)
            }
        })
    })
}

function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.highlightedPrimary, .highlightedSecondary, .highlightedEnemy')
    highlightedElements.forEach(element => {
        element.classList.remove('highlightedPrimary', 'highlightedSecondary', 'highlightedEnemy')
    })
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

        function pawnPlayerTwoCheckingFn() {
            if(pieceVal === 1 && rowIdx !== 1 && board[colIdx - 1][rowIdx + 2] === -3) {
                console.log('King is in range - Secondary Left')
                playerTwoCheck = true
            } else if(pieceVal === 1 && rowIdx !== 1 && board[colIdx + 1][rowIdx + 2] === -3) {
                console.log('King is in check - Secondary Right')
                playerTwoCheck = true
            }

            if(pieceVal === 1 && rowIdx === 1 && board[colIdx - 1][rowIdx + 3] === -3) {
                console.log('King is in range - Initial Left')
                playerTwoCheck = true
            } else if(pieceVal === 1 && rowIdx === 1 && board[colIdx + 1][rowIdx + 3] === -3) {
                console.log('King is in check - Initial Right')
                playerTwoCheck = true
            }

            if(pieceVal === 1 && rowIdx !== 1 && board[colIdx - 2][rowIdx + 2] === -3) {
                console.log('King is in range - Secondary Target Left')
                playerTwoCheck = true
            } else if(pieceVal === 1 && rowIdx !== 1 && board[colIdx + 2][rowIdx + 2] === -3) {
                console.log('King is in check - Secondary Target Right')
                playerTwoCheck = true
            }
            render()
        }

        function exitPawnPlayerTwoCheckingFn() {
            if(pieceVal === -3) {
                console.log('left the check')
                playerTwoCheck = false
            } else if(pieceVal === -3) {
                console.log('left the check')
                playerTwoCheck = false
            }
        }
        
        // Create WHITE PAWN functionality for SECONDARY MOVE
       if(pieceVal === 1 && turn === 1 && board[colIdx][rowIdx + 1] === 0 && rowIdx !== 1) {
            clearHighlights()
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
                    pawnPlayerTwoCheckingFn()
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
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            
            let playerMoved = false

            for (let i = 1; i <= 2; i++) {
                const wPawnInitialMoveEl = document.getElementById(`c${colIdx}r${rowIdx + i}`)
                if(board[colIdx][rowIdx + i] === 0) {
                    wPawnInitialMoveEl.classList.add('highlightedSecondary')
            
                    function whitePawnInitialMove(e) {
                        e.stopPropagation()
                        if (!playerMoved) { 
                            playerMoved = true
                            board[colIdx][rowIdx] = 0
                            board[colIdx][rowIdx + i] = 1
                            pawnPlayerTwoCheckingFn()
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
                }

                listeners[`c${colIdx}r${rowIdx + i}`] = {}
                listeners[`c${colIdx}r${rowIdx + i}`].fn = whitePawnInitialMove 
                listeners[`c${colIdx}r${rowIdx + i}`].el = wPawnInitialMoveEl

                wPawnInitialMoveEl.addEventListener('click', whitePawnInitialMove, { once: true })

                if (playerMoved) {
                    break
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
                    pawnPlayerTwoCheckingFn()
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

        // Create WHITE KING functionality for NORTHWEST TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx - 1][rowIdx + 1] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingNorthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 1}`)
            wKingNorthWestTargetEl.classList.add('highlightedEnemy')

            function whiteKingNorthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 1] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].fn = whiteKingNorthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].el = wKingNorthWestTargetEl
            wKingNorthWestTargetEl.addEventListener('click', whiteKingNorthWestTarget, { once: true })
        }
        // Create WHITE KING functionality for NORTHWEST MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx - 1][rowIdx + 1] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingNorthWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 1}`)
            wKingNorthWestMoveEl.classList.add('highlightedSecondary')

            function whiteKingNorthWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 1] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].fn = whiteKingNorthWestMove
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].el = wKingNorthWestMoveEl
            wKingNorthWestMoveEl.addEventListener('click', whiteKingNorthWestMove, { once: true })
        }


        // Create WHITE KING functionality for NORTH TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx][rowIdx + 1] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingNorthTargetEl = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
            wKingNorthTargetEl.classList.add('highlightedEnemy')

            function whiteKingNorthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx + 1] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx}r${rowIdx + 1}`].fn = whiteKingNorthTarget
            listeners[`c${colIdx}r${rowIdx + 1}`].el = wKingNorthTargetEl
            wKingNorthTargetEl.addEventListener('click', whiteKingNorthTarget, { once: true })
        }

        // Create WHITE KING functionality for NORTH MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx][rowIdx + 1] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingNorthMoveEl = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
            wKingNorthMoveEl.classList.add('highlightedSecondary')

            function whiteKingNorthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx + 1] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx}r${rowIdx + 1}`].fn = whiteKingNorthMove
            listeners[`c${colIdx}r${rowIdx + 1}`].el = wKingNorthMoveEl
            wKingNorthMoveEl.addEventListener('click', whiteKingNorthMove, { once: true })
        }

        // Create WHITE KING functionality for NORTHEAST TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx + 1][rowIdx + 1] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingNorthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
            wKingNorthEastTargetEl.classList.add('highlightedEnemy')

            function whiteKingNorthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 1] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].fn = whiteKingNorthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].el = wKingNorthEastTargetEl
            wKingNorthEastTargetEl.addEventListener('click', whiteKingNorthEastTarget, { once: true })
        }

        // Create WHITE KING functionality for NORTHEAST MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx + 1][rowIdx + 1] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingNorthEastMoveEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
            wKingNorthEastMoveEl.classList.add('highlightedSecondary')

            function whiteKingNorthEastMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 1] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].fn = whiteKingNorthEastMove
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].el = wKingNorthEastMoveEl
            wKingNorthEastMoveEl.addEventListener('click', whiteKingNorthEastMove, { once: true })
        }

        // Create WHITE KING functionality for EAST TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx + 1][rowIdx] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx}`)
            wKingEastTargetEl.classList.add('highlightedEnemy')

            function whiteKingEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx}`].fn = whiteKingEastTarget
            listeners[`c${colIdx + 1}r${rowIdx}`].el = wKingEastTargetEl
            wKingEastTargetEl.addEventListener('click', whiteKingEastTarget, { once: true })
        }

        // Create WHITE KING functionality for EAST MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx + 1][rowIdx] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingEastMoveEl = document.getElementById(`c${colIdx + 1}r${rowIdx}`)
            wKingEastMoveEl.classList.add('highlightedSecondary')

            function whiteKingEastMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx}`].fn = whiteKingEastMove
            listeners[`c${colIdx + 1}r${rowIdx}`].el = wKingEastMoveEl
            wKingEastMoveEl.addEventListener('click', whiteKingEastMove, { once: true })
        }

        // Create WHITE KING functionality for SOUTHEAST TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx + 1][rowIdx - 1] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingSouthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
            wKingSouthEastTargetEl.classList.add('highlightedEnemy')

            function whiteKingSouthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 1] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].fn = whiteKingSouthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].el = wKingSouthEastTargetEl
            wKingSouthEastTargetEl.addEventListener('click', whiteKingSouthEastTarget, { once: true })
        }

        // Create WHITE KING functionality for SOUTHEAST MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx + 1][rowIdx - 1] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingSouthEastMoveEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
            wKingSouthEastMoveEl.classList.add('highlightedSecondary')

            function whiteKingSouthEastMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 1] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].fn = whiteKingSouthEastMove
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].el = wKingSouthEastMoveEl
            wKingSouthEastMoveEl.addEventListener('click', whiteKingSouthEastMove, { once: true })
        }

        // Create WHITE KING functionality for SOUTH TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx][rowIdx - 1] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingSouthTargetEl = document.getElementById(`c${colIdx}r${rowIdx - 1}`)
            wKingSouthTargetEl.classList.add('highlightedEnemy')

            function whiteKingSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx - 1] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx}r${rowIdx - 1}`].fn = whiteKingSouthTarget
            listeners[`c${colIdx}r${rowIdx - 1}`].el = wKingSouthTargetEl
            wKingSouthTargetEl.addEventListener('click', whiteKingSouthTarget, { once: true })
        }

        // Create WHITE KING functionality for SOUTH MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx][rowIdx - 1] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingSouthMoveEl = document.getElementById(`c${colIdx}r${rowIdx - 1}`)
            wKingSouthMoveEl.classList.add('highlightedSecondary')

            function whiteKingSouthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx - 1] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx}r${rowIdx - 1}`].fn = whiteKingSouthMove
            listeners[`c${colIdx}r${rowIdx - 1}`].el = wKingSouthMoveEl
            wKingSouthMoveEl.addEventListener('click', whiteKingSouthMove, { once: true })
        }

        // Create WHITE KING functionality for SOUTHWEST TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx - 1][rowIdx - 1] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingSouthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 1}`)
            wKingSouthWestTargetEl.classList.add('highlightedEnemy')

            function whiteKingSouthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 1] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].fn = whiteKingSouthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].el = wKingSouthWestTargetEl
            wKingSouthWestTargetEl.addEventListener('click', whiteKingSouthWestTarget, { once: true })
        }

        // Create WHITE KING functionality for SOUTHWEST MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx - 1][rowIdx - 1] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingSouthWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 1}`)
            wKingSouthWestMoveEl.classList.add('highlightedSecondary')

            function whiteKingSouthWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 1] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].fn = whiteKingSouthWestMove
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].el = wKingSouthWestMoveEl
            wKingSouthWestMoveEl.addEventListener('click', whiteKingSouthWestMove, { once: true })
        }

        // Create WHITE KING functionality for WEST TARGET
        if (pieceVal === 2 && turn === 1 && board[colIdx - 1][rowIdx] < 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx}`)
            wKingWestTargetEl.classList.add('highlightedEnemy')

            function whiteKingWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx] = 2
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx}`].fn = whiteKingWestTarget
            listeners[`c${colIdx - 1}r${rowIdx}`].el = wKingWestTargetEl
            wKingWestTargetEl.addEventListener('click', whiteKingWestTarget, { once: true })
        }

        // Create WHITE KING functionality for WEST MOVE
        else if (pieceVal === 2 && turn === 1 && board[colIdx - 1][rowIdx] === 0) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const wKingWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx}`)
            wKingWestMoveEl.classList.add('highlightedSecondary')

            function whiteKingWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx] = 2
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx}`].fn = whiteKingWestMove
            listeners[`c${colIdx - 1}r${rowIdx}`].el = wKingWestMoveEl
            wKingWestMoveEl.addEventListener('click', whiteKingWestMove, { once: true })
        }

        // Create WHITE QUEEN movement and targeting NORTH
        if (pieceVal === 3 && turn === 1) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i

                if (nextRowIdx >= 8) break

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE QUEEN movement and targeting NORTHEAST
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE QUEEN movement and targeting EAST
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx + i

                if (rowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE QUEEN movement and targeting SOUTHEAST
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE QUEEN movement and targeting SOUTH
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (colIdx < 0 || colIdx >= 8) break                

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE QUEEN movement and targeting SOUTHWEST
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break                

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }
        
        // Create WHITE QUEEN movement and targeting WEST
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx - i

                if (rowIdx >= 8 || rowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break
                

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE QUEEN movement and targeting NORTHWEST
        if (pieceVal === 3 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create WHITE BISHOP movement and targeting NORTHEAST
        if (pieceVal === 4 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create WHITE BISHOP movement and targeting SOUTHEAST
        if (pieceVal === 4 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create WHITE BISHOP movement and targeting SOUTHWEST
        if (pieceVal === 4 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break                

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create WHITE BISHOP movement and targeting NORTHWEST
        if (pieceVal === 4 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = 4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = 4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create WHITE KNIGHT functionality for WESTNORTH TARGET
        if ((
            pieceVal === 5 &&
            turn === 1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length && // Check if the column index is within the board range
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length && // Check if the row index is within the board range
            board[colIdx - 2][rowIdx + 1] < 0
        )) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestNorthTargetEl = document.getElementById(`c${colIdx - 2}r${rowIdx + 1}`)
            knightWestNorthTargetEl.classList.add('highlightedEnemy')

            function knightWestNorthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx + 1] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].fn = knightWestNorthTarget
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].el = knightWestNorthTargetEl

            knightWestNorthTargetEl.addEventListener('click', knightWestNorthTarget, { once: true })
        }
        // Create WHITE KNIGHT functionality for WESTNORTH MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length &&
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length &&
            board[colIdx - 2][rowIdx + 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestNorthMoveEl = document.getElementById(`c${colIdx - 2}r${rowIdx + 1}`)
            knightWestNorthMoveEl.classList.add('highlightedSecondary')

            function knightWestNorthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx + 1] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].fn = knightWestNorthMove
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].el = knightWestNorthMoveEl

            knightWestNorthMoveEl.addEventListener('click', knightWestNorthMove, { once: true })
        }

        // Create WHITE KNIGHT functionality for NORTHWEST TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx - 1][rowIdx + 2] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 2}`)
            knightNorthWestTargetEl.classList.add('highlightedEnemy')

            function knightNorthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 2] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].fn = knightNorthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].el = knightNorthWestTargetEl

            knightNorthWestTargetEl.addEventListener('click', knightNorthWestTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for NORTHWEST MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx - 1][rowIdx + 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 2}`)
            knightNorthWestMoveEl.classList.add('highlightedSecondary')

            function knightNorthWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 2] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].fn = knightNorthWestMove
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].el = knightNorthWestMoveEl

            knightNorthWestMoveEl.addEventListener('click', knightNorthWestMove, { once: true })
        }

        // Create WHITE KNIGHT functionality for NORTHEAST TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx + 1][rowIdx + 2] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 2}`)
            knightNorthEastTargetEl.classList.add('highlightedEnemy')

            function knightNorthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 2] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].fn = knightNorthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].el = knightNorthEastTargetEl

            knightNorthEastTargetEl.addEventListener('click', knightNorthEastTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for NORTHEAST MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx + 1][rowIdx + 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 2}`)
            knightNorthEastTargetEl.classList.add('highlightedSecondary')

            function knightNorthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 2] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].fn = knightNorthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].el = knightNorthEastTargetEl

            knightNorthEastTargetEl.addEventListener('click', knightNorthEastTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for EASTNORTH TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length &&
            board[colIdx + 2][rowIdx + 1] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastNorthTargetEl = document.getElementById(`c${colIdx + 2}r${rowIdx + 1}`)
            knightEastNorthTargetEl.classList.add('highlightedEnemy')

            function knightEastNorthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx + 1] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].fn = knightEastNorthTarget
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].el = knightEastNorthTargetEl

            knightEastNorthTargetEl.addEventListener('click', knightEastNorthTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for EASTNORTH MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length &&
            board[colIdx + 2][rowIdx + 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastNorthMoveEl = document.getElementById(`c${colIdx + 2}r${rowIdx + 1}`)
            knightEastNorthMoveEl.classList.add('highlightedSecondary')

            function knightEastNorthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx + 1] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].fn = knightEastNorthMove
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].el = knightEastNorthMoveEl

            knightEastNorthMoveEl.addEventListener('click', knightEastNorthMove, { once: true })
        }

        // Create WHITE KNIGHT functionality for EASTSOUTH TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx + 2][rowIdx - 1] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastSouthTargetEl = document.getElementById(`c${colIdx + 2}r${rowIdx - 1}`)
            knightEastSouthTargetEl.classList.add('highlightedEnemy')

            function knightEastSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx - 1] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].fn = knightEastSouthTarget
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].el = knightEastSouthTargetEl

            knightEastSouthTargetEl.addEventListener('click', knightEastSouthTarget, { once: true })
        }
        // Create WHITE KNIGHT functionality for EASTSOUTH MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx + 2][rowIdx - 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastSouthTargetEl = document.getElementById(`c${colIdx + 2}r${rowIdx - 1}`)
            knightEastSouthTargetEl.classList.add('highlightedSecondary')

            function knightEastSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx - 1] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].fn = knightEastSouthTarget
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].el = knightEastSouthTargetEl

            knightEastSouthTargetEl.addEventListener('click', knightEastSouthTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for SOUTHEAST TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx + 1][rowIdx - 2] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 2}`)
            knightSouthEastTargetEl.classList.add('highlightedEnemy')

            function knightSouthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 2] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].fn = knightSouthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].el = knightSouthEastTargetEl

            knightSouthEastTargetEl.addEventListener('click', knightSouthEastTarget, { once: true })
        }
        // Create WHITE KNIGHT functionality for SOUTHEAST MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx + 1][rowIdx - 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 2}`)
            knightSouthEastTargetEl.classList.add('highlightedSecondary')

            function knightSouthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 2] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].fn = knightSouthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].el = knightSouthEastTargetEl

            knightSouthEastTargetEl.addEventListener('click', knightSouthEastTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for SOUTHWEST TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx - 1][rowIdx - 2] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 2}`)
            knightSouthWestTargetEl.classList.add('highlightedEnemy')

            function knightSouthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 2] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].fn = knightSouthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].el = knightSouthWestTargetEl

            knightSouthWestTargetEl.addEventListener('click', knightSouthWestTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for SOUTHWEST MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx - 1][rowIdx - 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 2}`)
            knightSouthWestTargetEl.classList.add('highlightedSecondary')

            function knightSouthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 2] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].fn = knightSouthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].el = knightSouthWestTargetEl

            knightSouthWestTargetEl.addEventListener('click', knightSouthWestTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for WESTSOUTH TARGET
        if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx - 2][rowIdx - 1] < 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestSouthTargetEl = document.getElementById(`c${colIdx - 2}r${rowIdx - 1}`)
            knightWestSouthTargetEl.classList.add('highlightedEnemy')

            function knightWestSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx - 1] = 5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].fn = knightWestSouthTarget
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].el = knightWestSouthTargetEl

            knightWestSouthTargetEl.addEventListener('click', knightWestSouthTarget, { once: true })
        }

        // Create WHITE KNIGHT functionality for WESTSOUTH MOVE
        else if (pieceVal === 5 &&
            turn === 1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx - 2][rowIdx - 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestSouthTargetEl = document.getElementById(`c${colIdx - 2}r${rowIdx - 1}`)
            knightWestSouthTargetEl.classList.add('highlightedSecondary')

            function knightWestSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx - 1] = 5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].fn = knightWestSouthTarget
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].el = knightWestSouthTargetEl

            knightWestSouthTargetEl.addEventListener('click', knightWestSouthTarget, { once: true })
        }

        // Create WHITE ROOK movement and targeting NORTH
        if (pieceVal === 6 && turn === 1) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i

                if (nextRowIdx >= 8) break

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = 6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }

        // Create WHITE ROOK movement and targeting EAST
        if (pieceVal === 6 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx + i

                if (rowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = 6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = 6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }

        // Create WHITE ROOK movement and targeting SOUTH
        if (pieceVal === 6 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (colIdx < 0 || colIdx >= 8) break                

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = 6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }
        
        // Create WHITE ROOK movement and targeting WEST
        if (pieceVal === 6 && turn === 1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx - i

                if (rowIdx >= 8 || rowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break
                

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare < 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = 6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = 6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }

        // Create BLACK PAWN functionality for SECONDARY MOVE
       if(pieceVal === -1 && turn === -1 && board[colIdx][rowIdx - 1] === 0 && rowIdx !== 6) {
        clearHighlights()
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
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            
            let playerMoved = false

            for (let i = 1; i <= 2; i++) {
                const bPawnInitialMoveEl = document.getElementById(`c${colIdx}r${rowIdx - i}`)
                if(board[colIdx][rowIdx - i] === 0) {
                    bPawnInitialMoveEl.classList.add('highlightedSecondary')
            
                    function blackPawnInitialMove(e) {
                        e.stopPropagation()
                        if (!playerMoved) { 
                            playerMoved = true
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
                }

                listeners[`c${colIdx}r${rowIdx - i}`] = {}
                listeners[`c${colIdx}r${rowIdx - i}`].fn = blackPawnInitialMove 
                listeners[`c${colIdx}r${rowIdx - i}`].el = bPawnInitialMoveEl 
                bPawnInitialMoveEl.addEventListener('click', blackPawnInitialMove, { once: true })
                
                if (playerMoved) {
                    break
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

        // Create BLACK PAWN targeting for RIGHT TARGET
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

        // Create BLACK KING functionality for NORTHWEST TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx - 1][rowIdx + 1] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingNorthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 1}`)
            bKingNorthWestTargetEl.classList.add('highlightedEnemy')

            function blackKingNorthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].fn = blackKingNorthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].el = bKingNorthWestTargetEl
            bKingNorthWestTargetEl.addEventListener('click', blackKingNorthWestTarget, { once: true })
        }
        // Create BLACK KING functionality for NORTHWEST MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx - 1][rowIdx + 1] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingNorthWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 1}`)
            bKingNorthWestMoveEl.classList.add('highlightedSecondary')

            function blackKingNorthWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].fn = blackKingNorthWestMove
            listeners[`c${colIdx - 1}r${rowIdx + 1}`].el = bKingNorthWestMoveEl
            bKingNorthWestMoveEl.addEventListener('click', blackKingNorthWestMove, { once: true })
        }


        // Create BLACK KING functionality for NORTH TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx][rowIdx + 1] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingNorthTargetEl = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
            bKingNorthTargetEl.classList.add('highlightedEnemy')

            function blackKingNorthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx + 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx}r${rowIdx + 1}`].fn = blackKingNorthTarget
            listeners[`c${colIdx}r${rowIdx + 1}`].el = bKingNorthTargetEl
            bKingNorthTargetEl.addEventListener('click', blackKingNorthTarget, { once: true })
        }

        // Create BLACK KING functionality for NORTH MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx][rowIdx + 1] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingNorthMoveEl = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
            bKingNorthMoveEl.classList.add('highlightedSecondary')

            function blackKingNorthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx + 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx}r${rowIdx + 1}`].fn = blackKingNorthMove
            listeners[`c${colIdx}r${rowIdx + 1}`].el = bKingNorthMoveEl
            bKingNorthMoveEl.addEventListener('click', blackKingNorthMove, { once: true })
        }

        // Create BLACK KING functionality for NORTHEAST TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx + 1][rowIdx + 1] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingNorthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
            bKingNorthEastTargetEl.classList.add('highlightedEnemy')

            function blackKingNorthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].fn = blackKingNorthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].el = bKingNorthEastTargetEl
            bKingNorthEastTargetEl.addEventListener('click', blackKingNorthEastTarget, { once: true })
        }

        // Create BLACK KING functionality for NORTHEAST MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx + 1][rowIdx + 1] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingNorthEastMoveEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 1}`)
            bKingNorthEastMoveEl.classList.add('highlightedSecondary')

            function blackKingNorthEastMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].fn = blackKingNorthEastMove
            listeners[`c${colIdx + 1}r${rowIdx + 1}`].el = bKingNorthEastMoveEl
            bKingNorthEastMoveEl.addEventListener('click', blackKingNorthEastMove, { once: true })
        }

        // Create BLACK KING functionality for EAST TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx + 1][rowIdx] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx}`)
            bKingEastTargetEl.classList.add('highlightedEnemy')

            function blackKingEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx}`].fn = blackKingEastTarget
            listeners[`c${colIdx + 1}r${rowIdx}`].el = bKingEastTargetEl
            bKingEastTargetEl.addEventListener('click', blackKingEastTarget, { once: true })
        }

        // Create BLACK KING functionality for EAST MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx + 1][rowIdx] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingEastMoveEl = document.getElementById(`c${colIdx + 1}r${rowIdx}`)
            bKingEastMoveEl.classList.add('highlightedSecondary')

            function blackKingEastMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx}`].fn = blackKingEastMove
            listeners[`c${colIdx + 1}r${rowIdx}`].el = bKingEastMoveEl
            bKingEastMoveEl.addEventListener('click', blackKingEastMove, { once: true })
        }

        // Create BLACK KING functionality for SOUTHEAST TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx + 1][rowIdx - 1] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingSouthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
            bKingSouthEastTargetEl.classList.add('highlightedEnemy')

            function blackKingSouthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].fn = blackKingSouthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].el = bKingSouthEastTargetEl
            bKingSouthEastTargetEl.addEventListener('click', blackKingSouthEastTarget, { once: true })
        }

        // Create BLACK KING functionality for SOUTHEAST MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx + 1][rowIdx - 1] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingSouthEastMoveEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 1}`)
            bKingSouthEastMoveEl.classList.add('highlightedSecondary')

            function blackKingSouthEastMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].fn = blackKingSouthEastMove
            listeners[`c${colIdx + 1}r${rowIdx - 1}`].el = bKingSouthEastMoveEl
            bKingSouthEastMoveEl.addEventListener('click', blackKingSouthEastMove, { once: true })
        }

        // Create BLACK KING functionality for SOUTH TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx][rowIdx - 1] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingSouthTargetEl = document.getElementById(`c${colIdx}r${rowIdx - 1}`)
            bKingSouthTargetEl.classList.add('highlightedEnemy')

            function blackKingSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx - 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx}r${rowIdx - 1}`].fn = blackKingSouthTarget
            listeners[`c${colIdx}r${rowIdx - 1}`].el = bKingSouthTargetEl
            bKingSouthTargetEl.addEventListener('click', blackKingSouthTarget, { once: true })
        }

        // Create BLACK KING functionality for SOUTH MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx][rowIdx - 1] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingSouthMoveEl = document.getElementById(`c${colIdx}r${rowIdx - 1}`)
            bKingSouthMoveEl.classList.add('highlightedSecondary')

            function blackKingSouthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx][rowIdx - 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx}r${rowIdx - 1}`].fn = blackKingSouthMove
            listeners[`c${colIdx}r${rowIdx - 1}`].el = bKingSouthMoveEl
            bKingSouthMoveEl.addEventListener('click', blackKingSouthMove, { once: true })
        }

        // Create BLACK KING functionality for SOUTHWEST TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx - 1][rowIdx - 1] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingSouthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 1}`)
            bKingSouthWestTargetEl.classList.add('highlightedEnemy')

            function blackKingSouthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].fn = blackKingSouthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].el = bKingSouthWestTargetEl
            bKingSouthWestTargetEl.addEventListener('click', blackKingSouthWestTarget, { once: true })
        }

        // Create BLACK KING functionality for SOUTHWEST MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx - 1][rowIdx - 1] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingSouthWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 1}`)
            bKingSouthWestMoveEl.classList.add('highlightedSecondary')

            function blackKingSouthWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 1] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].fn = blackKingSouthWestMove
            listeners[`c${colIdx - 1}r${rowIdx - 1}`].el = bKingSouthWestMoveEl
            bKingSouthWestMoveEl.addEventListener('click', blackKingSouthWestMove, { once: true })
        }

        // Create BLACK KING functionality for WEST TARGET
        if (pieceVal === -2 && turn === -1 && board[colIdx - 1][rowIdx] > 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx}`)
            bKingWestTargetEl.classList.add('highlightedEnemy')

            function blackKingWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx}`].fn = blackKingWestTarget
            listeners[`c${colIdx - 1}r${rowIdx}`].el = bKingWestTargetEl
            bKingWestTargetEl.addEventListener('click', blackKingWestTarget, { once: true })
        }

        // Create BLACK KING functionality for WEST MOVE
        else if (pieceVal === -2 && turn === -1 && board[colIdx - 1][rowIdx] === 0) {
            pieceId.classList.add('highlightedPrimary')
            const bKingWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx}`)
            bKingWestMoveEl.classList.add('highlightedSecondary')

            function blackKingWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx] = -2
                exitPawnPlayerTwoCheckingFn()
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx}`].fn = blackKingWestMove
            listeners[`c${colIdx - 1}r${rowIdx}`].el = bKingWestMoveEl
            bKingWestMoveEl.addEventListener('click', blackKingWestMove, { once: true })
        }

        // Create BLACK QUEEN movement and targeting NORTH
        if (pieceVal === -3 && turn === -1) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i

                if (nextRowIdx >= 8) break

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK QUEEN movement and targeting NORTHEAST
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK QUEEN movement and targeting EAST
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx + i

                if (rowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK QUEEN movement and targeting SOUTHEAST
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK QUEEN movement and targeting SOUTH
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (colIdx < 0 || colIdx >= 8) break                

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK QUEEN movement and targeting SOUTHWEST
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break                

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }
        
        // Create BLACK QUEEN movement and targeting WEST
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx - i

                if (rowIdx >= 8 || rowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break
                

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK QUEEN movement and targeting NORTHWEST
        if (pieceVal === -3 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function queenMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -3
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: queenMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', queenMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const queenMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    queenMoveEl.classList.add('highlightedSecondary')

                    function queenMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -3
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: queenMove,
                        el: queenMoveEl
                    }

                    queenMoveEl.addEventListener('click', queenMove, { once: true })
                }
            }
        }

        // Create BLACK BISHOP movement and targeting NORTHEAST
        if (pieceVal === -4 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create BLACK BISHOP movement and targeting SOUTHEAST
        if (pieceVal === -4 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx + i

                if (nextRowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create BLACK BISHOP movement and targeting SOUTHWEST
        if (pieceVal === -4 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break                

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create BLACK BISHOP movement and targeting NORTHWEST
        if (pieceVal === -4 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i
                const nextColIdx = colIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function bishopMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][nextRowIdx] = -4
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                            fn: bishopMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', bishopMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const bishopMoveEl = document.getElementById(`c${nextColIdx}r${nextRowIdx}`)
                    bishopMoveEl.classList.add('highlightedSecondary')

                    function bishopMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][nextRowIdx] = -4
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${nextRowIdx}`] = {
                        fn: bishopMove,
                        el: bishopMoveEl
                    }

                    bishopMoveEl.addEventListener('click', bishopMove, { once: true })
                }
            }
        }

        // Create BLACK KNIGHT functionality for WESTNORTH TARGET
        if ((
            pieceVal === -5 &&
            turn === -1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length && // Check if the column index is within the board range
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length && // Check if the row index is within the board range
            board[colIdx - 2][rowIdx + 1] > 0
        )) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestNorthTargetEl = document.getElementById(`c${colIdx - 2}r${rowIdx + 1}`)
            knightWestNorthTargetEl.classList.add('highlightedEnemy')

            function knightWestNorthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx + 1] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].fn = knightWestNorthTarget
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].el = knightWestNorthTargetEl

            knightWestNorthTargetEl.addEventListener('click', knightWestNorthTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for WESTNORTH MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length &&
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length &&
            board[colIdx - 2][rowIdx + 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestNorthMoveEl = document.getElementById(`c${colIdx - 2}r${rowIdx + 1}`)
            knightWestNorthMoveEl.classList.add('highlightedSecondary')

            function knightWestNorthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx + 1] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].fn = knightWestNorthMove
            listeners[`c${colIdx - 2}r${rowIdx + 1}`].el = knightWestNorthMoveEl

            knightWestNorthMoveEl.addEventListener('click', knightWestNorthMove, { once: true })
        }

        // Create BLACK KNIGHT functionality for NORTHWEST TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx - 1][rowIdx + 2] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 2}`)
            knightNorthWestTargetEl.classList.add('highlightedEnemy')

            function knightNorthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 2] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].fn = knightNorthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].el = knightNorthWestTargetEl

            knightNorthWestTargetEl.addEventListener('click', knightNorthWestTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for NORTHWEST MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx - 1][rowIdx + 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthWestMoveEl = document.getElementById(`c${colIdx - 1}r${rowIdx + 2}`)
            knightNorthWestMoveEl.classList.add('highlightedSecondary')

            function knightNorthWestMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx + 2] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].fn = knightNorthWestMove
            listeners[`c${colIdx - 1}r${rowIdx + 2}`].el = knightNorthWestMoveEl

            knightNorthWestMoveEl.addEventListener('click', knightNorthWestMove, { once: true })
        }

        // Create BLACK KNIGHT functionality for NORTHEAST TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx + 1][rowIdx + 2] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 2}`)
            knightNorthEastTargetEl.classList.add('highlightedEnemy')

            function knightNorthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 2] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].fn = knightNorthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].el = knightNorthEastTargetEl

            knightNorthEastTargetEl.addEventListener('click', knightNorthEastTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for NORTHEAST MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx + 2 >= 0 && rowIdx + 2 < board[0].length &&
            board[colIdx + 1][rowIdx + 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightNorthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx + 2}`)
            knightNorthEastTargetEl.classList.add('highlightedSecondary')

            function knightNorthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx + 2] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx + 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].fn = knightNorthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx + 2}`].el = knightNorthEastTargetEl

            knightNorthEastTargetEl.addEventListener('click', knightNorthEastTarget, { once: true })
        }

        // Create BLACK KNIGHT functionality for EASTNORTH TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length &&
            board[colIdx + 2][rowIdx + 1] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastNorthTargetEl = document.getElementById(`c${colIdx + 2}r${rowIdx + 1}`)
            knightEastNorthTargetEl.classList.add('highlightedEnemy')

            function knightEastNorthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx + 1] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].fn = knightEastNorthTarget
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].el = knightEastNorthTargetEl

            knightEastNorthTargetEl.addEventListener('click', knightEastNorthTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for EASTNORTH MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx + 1 >= 0 && rowIdx + 1 < board[0].length &&
            board[colIdx + 2][rowIdx + 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastNorthMoveEl = document.getElementById(`c${colIdx + 2}r${rowIdx + 1}`)
            knightEastNorthMoveEl.classList.add('highlightedSecondary')

            function knightEastNorthMove(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx + 1] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx + 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].fn = knightEastNorthMove
            listeners[`c${colIdx + 2}r${rowIdx + 1}`].el = knightEastNorthMoveEl

            knightEastNorthMoveEl.addEventListener('click', knightEastNorthMove, { once: true })
        }

        // Create BLACK KNIGHT functionality for EASTSOUTH TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx + 2][rowIdx - 1] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastSouthTargetEl = document.getElementById(`c${colIdx + 2}r${rowIdx - 1}`)
            knightEastSouthTargetEl.classList.add('highlightedEnemy')

            function knightEastSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx - 1] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].fn = knightEastSouthTarget
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].el = knightEastSouthTargetEl

            knightEastSouthTargetEl.addEventListener('click', knightEastSouthTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for EASTSOUTH MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 2 >= 0 && colIdx + 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx + 2][rowIdx - 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightEastSouthTargetEl = document.getElementById(`c${colIdx + 2}r${rowIdx - 1}`)
            knightEastSouthTargetEl.classList.add('highlightedSecondary')

            function knightEastSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 2][rowIdx - 1] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].fn = knightEastSouthTarget
            listeners[`c${colIdx + 2}r${rowIdx - 1}`].el = knightEastSouthTargetEl

            knightEastSouthTargetEl.addEventListener('click', knightEastSouthTarget, { once: true })
        }

        // Create BLACK KNIGHT functionality for SOUTHEAST TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx + 1][rowIdx - 2] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 2}`)
            knightSouthEastTargetEl.classList.add('highlightedEnemy')

            function knightSouthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 2] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].fn = knightSouthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].el = knightSouthEastTargetEl

            knightSouthEastTargetEl.addEventListener('click', knightSouthEastTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for SOUTHEAST MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx + 1 >= 0 && colIdx + 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx + 1][rowIdx - 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthEastTargetEl = document.getElementById(`c${colIdx + 1}r${rowIdx - 2}`)
            knightSouthEastTargetEl.classList.add('highlightedSecondary')

            function knightSouthEastTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx + 1][rowIdx - 2] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx + 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].fn = knightSouthEastTarget
            listeners[`c${colIdx + 1}r${rowIdx - 2}`].el = knightSouthEastTargetEl

            knightSouthEastTargetEl.addEventListener('click', knightSouthEastTarget, { once: true })
        }

        // Create BLACK KNIGHT functionality for SOUTHWEST TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx - 1][rowIdx - 2] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 2}`)
            knightSouthWestTargetEl.classList.add('highlightedEnemy')

            function knightSouthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 2] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].fn = knightSouthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].el = knightSouthWestTargetEl

            knightSouthWestTargetEl.addEventListener('click', knightSouthWestTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for SOUTHWEST MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 1 >= 0 && colIdx - 1 < board.length &&
            rowIdx - 2 >= 0 && rowIdx - 2 < board[0].length &&
            board[colIdx - 1][rowIdx - 2] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightSouthWestTargetEl = document.getElementById(`c${colIdx - 1}r${rowIdx - 2}`)
            knightSouthWestTargetEl.classList.add('highlightedSecondary')

            function knightSouthWestTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 1][rowIdx - 2] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 1}r${rowIdx - 2}`] = {}
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].fn = knightSouthWestTarget
            listeners[`c${colIdx - 1}r${rowIdx - 2}`].el = knightSouthWestTargetEl

            knightSouthWestTargetEl.addEventListener('click', knightSouthWestTarget, { once: true })
        }

        // Create BLACK KNIGHT functionality for WESTSOUTH TARGET
        if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx - 2][rowIdx - 1] > 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestSouthTargetEl = document.getElementById(`c${colIdx - 2}r${rowIdx - 1}`)
            knightWestSouthTargetEl.classList.add('highlightedEnemy')

            function knightWestSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx - 1] = -5
                turn *= -1
                this.classList.remove('highlightedEnemy')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].fn = knightWestSouthTarget
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].el = knightWestSouthTargetEl

            knightWestSouthTargetEl.addEventListener('click', knightWestSouthTarget, { once: true })
        }
        // Create BLACK KNIGHT functionality for WESTSOUTH MOVE
        else if (pieceVal === -5 &&
            turn === -1 &&
            colIdx - 2 >= 0 && colIdx - 2 < board.length &&
            rowIdx - 1 >= 0 && rowIdx - 1 < board[0].length &&
            board[colIdx - 2][rowIdx - 1] === 0) {
            // clearHighlights()
            pieceId.classList.add('highlightedPrimary')
            const knightWestSouthTargetEl = document.getElementById(`c${colIdx - 2}r${rowIdx - 1}`)
            knightWestSouthTargetEl.classList.add('highlightedSecondary')

            function knightWestSouthTarget(e) {
                e.stopPropagation()
                board[colIdx][rowIdx] = 0
                board[colIdx - 2][rowIdx - 1] = -5
                turn *= -1
                this.classList.remove('highlightedSecondary')
                pieceId.classList.remove('highlightedPrimary')
                squares.forEach(square => {
                    square.classList.remove('highlightedSecondary')
                    square.classList.remove('highlightedEnemy')
                })
                render()
                removeListeners()
                return
            }

            listeners[`c${colIdx - 2}r${rowIdx - 1}`] = {}
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].fn = knightWestSouthTarget
            listeners[`c${colIdx - 2}r${rowIdx - 1}`].el = knightWestSouthTargetEl

            knightWestSouthTargetEl.addEventListener('click', knightWestSouthTarget, { once: true })
        }

        // Create BLACK ROOK movement and targeting NORTH
        if (pieceVal === -6 && turn === -1) {
            clearHighlights()
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx + i

                if (nextRowIdx >= 8) break

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = -6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = -6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }

        // Create BLACK ROOK movement and targeting EAST
        if (pieceVal === -6 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx + i

                if (rowIdx >= 8) break
                if (nextColIdx >= 8) break

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = -6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = -6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }

        // Create BLACK ROOK movement and targeting SOUTH
        if (pieceVal === -6 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextRowIdx = rowIdx - i

                if (nextRowIdx >= 8 || nextRowIdx < 0) break
                if (colIdx < 0 || colIdx >= 8) break                

                const nextSquare = board[colIdx][nextRowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[colIdx][nextRowIdx] = -6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${colIdx}r${nextRowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${colIdx}r${nextRowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = -6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${colIdx}r${nextRowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }
        
        // Create BLACK ROOK movement and targeting WEST
        if (pieceVal === -6 && turn === -1) {
            pieceId.classList.add('highlightedPrimary')

            for (let i = 1; i <= 7; i++) {
                const nextColIdx = colIdx - i

                if (rowIdx >= 8 || rowIdx < 0) break
                if (nextColIdx < 0 || nextColIdx >= 8) break
                

                const nextSquare = board[nextColIdx][rowIdx]

                if (nextSquare !== 0) {
                    if (nextSquare > 0) {
                        const enemyEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                        enemyEl.classList.add('highlightedEnemy')

                        function rookMoveToEnemy(e) {
                            e.stopPropagation()
                            board[colIdx][rowIdx] = 0
                            board[nextColIdx][rowIdx] = -6
                            turn *= -1
                            squares.forEach(square => {
                                square.classList.remove('highlightedSecondary')
                                square.classList.remove('highlightedEnemy')
                            })
                            pieceId.classList.remove('highlightedPrimary')
                            render()
                            removeListeners()
                            return
                        }

                        listeners[`c${nextColIdx}r${rowIdx}`] = {
                            fn: rookMoveToEnemy,
                            el: enemyEl
                        }

                        enemyEl.addEventListener('click', rookMoveToEnemy, { once: true })
                    }
                    break
                } else {
                    const rookMoveEl = document.getElementById(`c${nextColIdx}r${rowIdx}`)
                    rookMoveEl.classList.add('highlightedSecondary')

                    function rookMove(e) {
                        e.stopPropagation()
                        board[colIdx][rowIdx] = 0
                        board[nextColIdx][rowIdx] = -6
                        turn *= -1
                        squares.forEach(square => {
                            square.classList.remove('highlightedSecondary')
                            square.classList.remove('highlightedEnemy')
                        })
                        pieceId.classList.remove('highlightedPrimary')
                        render()
                        removeListeners()
                        return
                    }

                    listeners[`c${nextColIdx}r${rowIdx}`] = {
                        fn: rookMove,
                        el: rookMoveEl
                    }

                    rookMoveEl.addEventListener('click', rookMove, { once: true })
                }
            }
        }
    })
}

gamePiece()

function checkmate() {
    if(playerOneCheckmate === true) {
        winner = PLAYERS['-1']
    } else if (playerTwoCheckmate === true) {
        winner = PLAYERS['1']
    }
}

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