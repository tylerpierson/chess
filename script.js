// Constants
const squares = document.querySelectorAll('.square')

const COLORS = {
    '1': 'red',
    '-1': 'blue'
}

const PLAYERS = {
    '1': 'player 1',
    '-1': 'player 2'
}

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
let turn; // This will be 1 or -1
let board; // This will be a 2d rendering of the game board
let winner; // This will be set to null, 1 or -1
// Cached Elements
const playAgainBtn = document.querySelector('button')

// Event Listeners
const messageEl = document.querySelector('.player-turn')

// Functions
init();

function init() {
    turn = 1
    board = [
        //   A  B  C  D  E  F  G  H
            [6, 1, 0, 0, 0, 0, -1, -6], // 8
            [5, 1, 0, 0, 0, 0, -1, -5], // 7
            [4, 1, 0, 0, 0, 0, -1, -4], // 6
            [3, 1, 0, 0, 0, 0, -1, -3], // 5
            [2, 1, 0, 0, 0, 0, -1, -2], // 4
            [4, 1, 0, 0, 0, 0, -1, -4], // 3
            [5, 1, 0, 0, 0, 0, -1, -5], // 2
            [6, 1, 0, 0, 0, 0, -1, -6] // 1
        ];
    winner = null;
    render();
}

function pieceSelection(e) {
    console.log(e.target);
}

// This function will update the state of our application and render it to the DOM
function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(function(colArr, colIdx) {    
        colArr.forEach(function(rowVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);

            if (rowVal !== 0) { // Check if there's a piece on this cell
                const piece = PIECES[rowVal.toString()]; // Get piece info based on board value
                if (piece) {
                    const imgEl = document.createElement('img');
                    imgEl.src = piece.img;
                    imgEl.style.width = '6rem';
                    cellEl.innerHTML = ''; // Clear cell before appending image
                    cellEl.appendChild(imgEl);
                }
            } else {
                cellEl.innerHTML = ''; // Clear cell if there's no piece
            }
        });
    });
}


function renderMessage() {
    if(winner === 'stalemate') {
        messageEl.textContent = `STALEMATE!`
    } else if(winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${PLAYERS[winner].toUpperCase()}</span> Wins!`
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${PLAYERS[turn].toUpperCase()}</span>'s turn!`
    }
}

function renderControls() {
// Change visibility of btn depending on state of game
    !winner ? playAgainBtn.style.visibility = 'hidden':playAgainBtn.style.visibility = 'visible' 
}


let squareClicked = false
// Create move potentials
squares.forEach(square => {
    square.addEventListener('click', () => {
        const img = square.querySelector('img');
        if (img) {
            const clickedImgSrc = img.src;
            for (const key in PIECES) {
                if (PIECES.hasOwnProperty(key) && PIECES[key].img === clickedImgSrc) {
                    console.log(PIECES[key].color, PIECES[key].name);
                    squareClicked = true
                    break; // Stop the loop once the match is found
                }
            }
        }
    });
});