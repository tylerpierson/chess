1. Constants and State Variables
Defined constants COLORS, PLAYERS, and PIECES to hold player colors, player identifiers, and chess piece details.
Set up state variables to manage game state, such as turn, board, winner, and variables to handle highlighted squares.

2. Initialization and Rendering
Created an init() function to set up the initial game state, including the board and starting player.
Developed a render() function to display the game elements on the screen.

3. Rendering Functions
renderBoard(): Generated the game board based on a 2D array, rendering chess pieces using their respective images.
renderMessage(): Displayed messages indicating the current player's turn or the game's outcome.
renderButton(): Rendered a button to allow players to start a new game.

4. Event Handling and Game Logic
Implemented gamePiece() to manage event listeners and control the game logic.
Included a function clearHighlights() to remove highlighted squares on the board.

5. White Pawn Movement Logic
Defined movement functionalities for the white pawn.
Managed the pawn's initial and subsequent moves.
Implemented logic for the pawn to target and capture enemy pieces diagonally.
Utilized event listeners to handle movements and update the board state based on the rules of chess.
The code primarily focuses on the white pawn's movements and captures, providing event-driven functionality to execute these actions within the constraints of chess rules.

6. White King Movement Logic
NORTHWEST: Target
If the piece is a White King (pieceVal === 2), it's White's turn (turn === 1), and there's an opponent piece (board[colIdx - 1][rowIdx + 1] < 0), mark the Northwest square for targeting.
Set up a click event listener to capture an opponent's piece in the Northwest direction.
If the square is empty (board[colIdx - 1][rowIdx + 1] === 0), mark the Northwest square for a move and set up a click event listener for the White King to move there.
NORTH: Target and Move

Similarly, handle North direction targeting and movement for the White King.
NORTHEAST: Target and Move

Handle targeting and movement for the Northeast direction.
EAST: Target and Move

Handle targeting and movement for the East direction.
SOUTHEAST: Target and Move

Handle targeting and movement for the Southeast direction.
SOUTH: Target and Move

Handle targeting and movement for the South direction.
SOUTHWEST: Target and Move

Handle targeting and movement for the Southwest direction.
WEST: Target and Move

Handle targeting and movement for the West direction.
Event Listeners
Set up event listeners for each direction that the White King can move or capture a piece.
When a valid move or capture is made, update the game state, toggle turns, remove highlights, render the updated board, and remove listeners to prevent further moves until the next turn.
This code section systematically checks all eight directions around the White King's position on the chessboard, highlighting valid moves or captures and setting up event listeners to execute these actions according to the rules of chess.
Using very similar logic, apply a similar function to all other white game pieces.

7. I Repeated these steps for the Black Game Pieces as well. I ensured that a negative value was applied to each game piece as well as directional movements for pawns.

8. Invoke the gamePiece function()

9. Create a function that checks for the 'check' or 'checkmate' of the opponents King.

10. renderMessage() Function
Stalemate Check:

If the winner variable is equal to 'stalemate', set the messageEl content to display "STALEMATE!"
Winner Check:

Otherwise, if there's a winner (not a stalemate), set the messageEl content to display a victory message.
Use the COLORS constant to assign a color to the winning player's name and the PLAYERS constant to get the player's name in uppercase.
Turn Message:

If there's neither a stalemate nor a winner, show a message indicating whose turn it is.
Use the COLORS constant to assign a color to the player's name and the PLAYERS constant to get the player's name in uppercase.
renderButton() Function

10. Play Again Button Visibility:
Uses a ternary statement to toggle the visibility of the "Play Again" button (playAgainBtn) based on the state of the game:
If there's no winner (game still ongoing), hide the button (playAgainBtn.style.visibility = 'hidden').
If there's a winner, show the button (playAgainBtn.style.visibility = 'visible').