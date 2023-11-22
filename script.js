// Constants
const PLAYERS = {
    '1': 'player 1',
    '-1': 'player 2'
}

const COLORS = {
    '0': 'white',
    '1': 'purple',
    '-1': 'orange'
}

// State Variables
let turn; // This will be 1 or -1
let board; // This will be a 2d rendering of the game board
let winner; // This will be set to null, 1 or -1
// Cached Elements

// Event Listeners
const messageEl = document.querySelector('.player-turn')

// Functions
init();

function init() {
    turn = 1
    board = [
        //   A  B  C  D  E  F  G  H
            [0, 0, 0, 0, 0, 0, 0, 0], // 8
            [0, 0, 0, 0, 0, 0, 0, 0], // 7
            [0, 0, 0, 0, 0, 0, 0, 0], // 6
            [0, 0, 0, 0, 0, 0, 0, 0], // 5
            [0, 0, 0, 0, 0, 0, 0, 0], // 4
            [0, 0, 0, 0, 0, 0, 0, 0], // 3
            [0, 0, 0, 0, 0, 0, 0, 0], // 2
            [0, 0, 0, 0, 0, 0, 0, 0] // 1
        ];
    winner = null;
    render();
}

// This function will update the state of our application and render it to the DOM
function render() {
    renderBoard();
    renderMessage();
    renderControls();
}

function renderBoard() {
    board.forEach(function(colArr, colIdx){
        colArr.forEach(function (rowVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`
            const cellEl = document.getElementById(cellId)
        })
    })
}

function renderMessage() {
    if(winner === 'stalemate') {

    } else if(winner) {

    } else {
        messageEl.textContent = `${PLAYERS[turn].toUpperCase()}'s turn!`
    }
}

function renderControls() {

}