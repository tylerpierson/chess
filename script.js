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

    // The game is initiated with the winner set to 'null' until the game ends
    winner = null;

    // The render function is ran to initiate all the functions that create the game (i.e renderBoard(), 
    // renderMessage(), and renderControls)
    render();
}

// This function will update the state of our application and render it to the DOM
function render() {
    // Run all rending functions
    renderBoard();
    renderMessage();
    renderControls();
}

// Create a renderBoard function
function renderBoard() {
    // Run a forEach function that will take parameters of the colArr(column array that displays each
    // individual column) and the colIdx (column index which displays each column as an indexed number)
    board.forEach(function(colArr, colIdx) {    
        // For each column run another function that takes rowVal(row value that lists out each value in
        // each row) and a rowIdx(row index that lists out each index of each row on the board)
        colArr.forEach(function(rowVal, rowIdx) {
            // Create a variable cellId that takes the column index and the row index to pinpoint a specific
            // location on the game board using the ID created in the HTML for each square of the board
            const cellId = `c${colIdx}r${rowIdx}`;
            // Use a variable to store each individual cell on the board by selecting it by its ID
            const cellEl = document.getElementById(cellId);

            // Create an if statement w/in the renderBoard function to place each gamepiece image on its
            // designated cell
            // If the rowVal does not equal zero, then it needs to run a function to identify which game
            // piece belongs on the cell
            if (rowVal !== 0) {
                // Create a variable to store each game piece's information as a string (i.e. name, color, 
                // and image src)
                const piece = PIECES[rowVal.toString()];
                // store an image element in a variable
                const imgEl = document.createElement('img');
                // Give the new image element a value of piece.img using the .src method
                imgEl.src = piece.img;
                // Set the width of the images to 6rem
                imgEl.style.width = '6rem';
                // Append the image element to the cell element
                cellEl.appendChild(imgEl);
            }

            // Within the renderBoard function, use a forEach function to identify which type of game piece
            // has been selected when the square is clicked
            // For each cell, I want to add a click event listener
            cellEl.addEventListener('click', function () {
                // If the rowVal does not equal zero, then the function will determine what value it contains
                if (rowVal !== 0) {
                    // Create a variable to store the PIECES color concatenated with the PIECES name
                    const currentPiece = PIECES[rowVal.toString()].color + ' ' + PIECES[rowVal.toString()].name;
                    console.log(currentPiece);
                    if (PIECES[rowVal.toString()].name === 'rook') {
                        console.log('YES!');
                    }
                }
            });
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

function renderControls() {
// Change visibility of btn depending on state of game using a ternary statement
    !winner ? playAgainBtn.style.visibility = 'hidden':playAgainBtn.style.visibility = 'visible' 
}