let board

class GamePieces {
    constructor (name, initPos, val, img) {
      this.name = name;
      this.initPos = initPos;
      this.val = val;
      this.img = img;
    }
    attack() {
      this.hp -= 20;
      return `${this.name} used a basic attack now has ${this.hp} hp left!`
    }
  }

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
}

const mainBoard = document.querySelector('.board')
mainBoard.addEventListener('click', function(evt) {
    console.log(evt.target.id)
    const colIndex = evt.target.id.charAt(1)
    const rowIndex = evt.target.id.charAt(3)
    const colIdx = parseInt(colIndex)
    const rowIdx = parseInt(rowIndex)

    console.log(Pokemon)
})