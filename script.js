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
        color: 'white',
        img: 'https://i.imgur.com/hAOAJM9.png'
    },
    '2': {
        name: 'king',
        color: 'white',
        img: 'https://i.imgur.com/dRJVxWQ.png'
    },
    '3': {
        name: 'queen',
        color: 'white',
        img: 'https://i.imgur.com/eEf9ra1.png'
    },
    '4': {
        name: 'bishop',
        color: 'white',
        img: 'https://i.imgur.com/gHlGvlG.png'
    },
    '5': {
        name: 'knight',
        color: 'white',
        img: 'https://i.imgur.com/gNdQZ3v.png'
    },
    '6': {
        name: 'rook',
        color: 'white',
        img: 'https://i.imgur.com/APXYS0C.png'
    },
    '-1': {
        name: 'pawn',
        color: 'black',
        img: 'https://i.imgur.com/67vxdVo.png'
    },
    '-2': {
        name: 'king',
        color: 'black',
        img: 'https://i.imgur.com/W6wYXyH.png'
    },
    '-3': {
        name: 'queen',
        color: 'black',
        img: 'https://i.imgur.com/met06db.png'
    },
    '-4': {
        name: 'bishop',
        color: 'black',
        img: 'https://i.imgur.com/vwztxFW.png'
    },
    '-5': {
        name: 'knight',
        color: 'black',
        img: 'https://i.imgur.com/FaZ3WKc.png'
    },
    '-6': {
        name: 'rook',
        color: 'black',
        img: 'https://i.imgur.com/nQX2bU8.png'
    }
}

// State Variables
let turn; // This will determine which players turn it is when the turn variable is either 1 or -1
let board; // This will be a 2d rendering of the game board when creating a board within an array
let winner; // This will be set to null. Player will be determined by either 1, -1, or 'stalemate'

// Declaration of variables to manipulate within the DOM
const playAgainBtn = document.querySelector('button')
const squares = document.querySelectorAll('.square')
const messageEl = document.querySelector('.player-turn')


playAgainBtn.addEventListener('click', init)
// Functions
// When this init function is ran, it will render the board with all game pieces in their initial positions
init();

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
    winner = null;
    // The render function is ran to initiate all the functions that create the game (i.e renderBoard(), 
    // renderMessage(), and renderControls)
    render();
}



// Write a function that will update the state of our application and render it to the DOM
function render() {
    // Run all rendering functions
    renderBoard();
    renderMessage();
    renderButton();
}

function newTurn() {
    turn = turn * -1
    renderMessage()
}

// Create a renderBoard function
function renderBoard() {
    // Run a forEach function that will take parameters of the colArr(column array that displays each
    // individual column) and the colIdx (column index which displays each column as an indexed number)
    board.forEach(function(colArr, colIdx) {
        colArr.forEach(function(rowVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);

            // Clear the cell content
            cellEl.innerHTML = '';

            if (rowVal !== 0) {
                const piece = PIECES[rowVal.toString()];
                const imgEl = document.createElement('img');
                imgEl.src = piece.img;
                imgEl.style.width = '6rem';
                cellEl.appendChild(imgEl);
            }

            function clearAllHighlights() {
                clearHighlightedPrimary()
                clearHighlightedCells()
                clearHighlightedTargets()
            }

            function clearHighlightedPrimary() {
                document.querySelectorAll('.highlightedPrimary').forEach(cell => {
                    cell.classList.remove('highlightedPrimary');
                });
            }

            function clearHighlightedCells() {
                document.querySelectorAll('.highlightedCells').forEach(cell => {
                    cell.classList.remove('highlightedCells');
                });
            }

            function clearHighlightedTargets() {
                document.querySelectorAll('.highlightTargets').forEach(cell => {
                    cell.classList.remove('highlightTargets');
                });
            }
            
            function whitePawn() {
                cellEl.addEventListener('click', function() {
                    let newPos = board[colIdx][rowIdx] = 1
                    if(rowVal === 1 && rowIdx === 1){
                        cellEl.classList.add('highlightedPrimary')
                        for (let i = 1; i <= 2; i++){
                            if(board[colIdx][rowIdx + i] === 0){
                                const pawnMovePotential = `c${colIdx}r${rowIdx + i}`
                                const pawnNextMove = document.getElementById(pawnMovePotential)
                                pawnNextMove.classList.add('highlightedCells')
                                pawnNextMove.addEventListener('click', function() {
                                    board[colIdx][rowIdx] = 0
                                    newPos
                                    console.log(newPos)
                                    clearAllHighlights()
                                    newTurn()
                                    render()
                                })
                            }
                        }
                    } else if(rowVal === 1 && rowIdx !== 1 && board[colIdx][rowIdx + 1] === 0){
                        cellEl.classList.add('highlightedPrimary')
                        const pawnMovePotential = `c${colIdx}r${rowIdx + 1}`
                        const pawnNextMove = document.getElementById(pawnMovePotential)
                        pawnNextMove.classList.add('highlightedCells')
                        pawnNextMove.addEventListener('click', function() {
                            if(rowIdx === 7){
                                makeQueen()
                                render()
                            } else {
                                newPos
                            }
                            board[colIdx][rowIdx] = 0
                            clearAllHighlights()
                            newTurn()
                            render()
                        })
                    } else if (rowVal === 1 && rowIdx !== 1) {
                        if(board[colIdx + 1][rowIdx + 1] < 0) {
                            cellEl.classList.add('highlightedPrimary')
                            const pawnKillRight = `c${colIdx + 1}r${rowIdx + 1}`
                            const pawnNextKillRight = document.getElementById(pawnKillRight)
                            pawnNextKillRight.classList.add('highlightTargets')
                            pawnNextKillRight.addEventListener('click', function() {
                                cellEl.classList.remove('highlightedPrimary')
                                board[colIdx][rowIdx] = 0
                                newPos
                                clearHighlightedTargets()
                                newTurn()
                                render()
                            })
                        }
                        if(board[colIdx - 1][rowIdx + 1] < 0) {
                            cellEl.classList.add('highlightedPrimary')
                            const pawnKillLeft = `c${colIdx - 1}r${rowIdx + 1}`
                            const pawnNextKillLeft = document.getElementById(pawnKillLeft)
                            pawnNextKillLeft.classList.add('highlightTargets')
                            pawnNextKillLeft.addEventListener('click', function() {
                                cellEl.classList.remove('highlightedPrimary')
                                board[colIdx][rowIdx] = 0
                                newPos
                                clearHighlightedTargets()
                                newTurn()
                                render()
                            })
                        }
                    }
                })
            }
            whitePawn()

            function makeQueen() {
                if(rowVal === 1 && rowIdx === 7){
                    board[colIdx][rowIdx] = 3
                    render()
                }
            }
            makeQueen()
        });
    });
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