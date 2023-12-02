function wPawn() {
    // Set an event listener on the mainBoard in order to target individual squares by setting an evt parameter
    mainBoard.addEventListener('click', function(evt) {
        // Set variables to more easily call on the target selection, target type, and target id
        const square = evt.target
        const squareElType = evt.target.tagName
        const squareId = evt.target.id

        // separate the character at index 1 of the id to remove the column index
        const colIdx = squareId.charAt(1)
        // separate the character at index 3 of the id to remove the row index
        const rowIdx = squareId.charAt(3)

        // Once the row index is separated, create a variable to store it as a 'number' by using parseInt()
        const rowIndex = parseInt(rowIdx)
        const colIndex = parseInt(colIdx)
        const pieceVal = board[colIdx][rowIdx]

        // Create an if statement to check on the current state of the highlightedPrimaryCell
        if (highlightedPrimarySquare) {
            // If the primary square is currently highlighted, remove the class 'highlightedPrimary' from the square
            highlightedPrimarySquare.classList.remove('highlightedPrimary')
            // Run a forEach function on the secondary highlights to remove all highlighted cells with a class name
            // of 'highlightedSecondary'
            secondaryHighlightedSquares.forEach(cellId => {
                // Create a 'cell' variable that stores the cell by targeting it with its cellId
                const cell = document.getElementById(cellId);
                // If 'cell' is true (as in it is currently in the secondaryHighlightSquares array)
                if (cell) {
                    // Remove the class name 'highlightedSecondary' from each cell
                    cell.classList.remove('highlightedSecondary')
                    render()
                }
            });
            // Reset the highlightedPrimarySquare to 'null'
            highlightedPrimarySquare = null
            // Reset the secondaryHighlightedSquares to an empty array
            secondaryHighlightedSquares = []            
            // Reset the enemyHighlightedSquares to an empty array
            enemyHighlightedSquares = []
        }

        // Create an if statement to check that the squares type is an IMG and that it is currently at
        // a row index of 1 (the white pawns starting position)
        if (squareElType === 'IMG' && pieceVal === 1 && rowIndex === 1) {
            // Create a for loop that iterates 2 times to target all possible jump points
            for (let i = 1; i <= 2; i++) {
                // To target the next row indices, set a variable of nextRowIndex equal to current rowIndex + i
                const nextRowIdx = rowIndex + i

                // Use the nextRowIdx to search for the next possible square element by placing it within getElementById()
                // along with the desired column index (ex. `c${colIdx}r${nextRowIdx}`)
                const nextSquare = document.getElementById(`c${colIdx}r${nextRowIdx}`)


                // Create an if statement to determine what to do with the newly created 'nextSquare' variable
                if (nextSquare) {
                    // Give the primary square a class of 'highlightedPrimary' to style it appropriately
                    square.classList.add('highlightedPrimary')
                    // Give the nextSquare a class of 'highlightedSecondary' to style all jump points accordingly
                    nextSquare.classList.add('highlightedSecondary')
                    // Set the highlightedPrimarySquare variable to equal the evt.target
                    highlightedPrimarySquare = square
                    // Push all nextSquare id's into the secondaryHighlightedSquares array by pushing in its id
                    secondaryHighlightedSquares.push(`c${colIdx}r${nextRowIdx}`)
                    
                    // Create an event listener for the nextSquare selection
                    nextSquare.addEventListener('click', function() {
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 1
                        // Remove the primary highlight class from the highlightedPrimarySquare
                        highlightedPrimarySquare.classList.remove('highlightedPrimary')
                        // Run another forEach function to remove the highlightedSecondary class from all cells
                        // within the secondaryHighlightedSquares array
                        secondaryHighlightedSquares.forEach(cellId => {
                            const cell = document.getElementById(cellId)
                            if (cell) {
                                cell.classList.remove('highlightedSecondary')
                                render()
                            }
                        })
                        // Reset the highlightedPrimarySquare and secondaryHighlightedSquares back to their initial states
                        highlightedPrimarySquare = null
                        secondaryHighlightedSquares = []
                        enemyHighlightedSquares = []
                        newTurn()
                        render()
                    })
                }
            }
        // Determine if the piece is any position other than its initial pos
        } else if (squareElType === 'IMG' && pieceVal === 1 && rowIndex !== 1) {
            // To target the next row indices, set a variable of nextRowIndex equal to current rowIndex + i
            const nextRowIdx = rowIndex + 1
            const leftColIdx = colIndex - 1
            const rightColIdx = colIndex + 1

            // Use the nextRowIdx to search for the next possible square element by placing it within getElementById()
            // along with the desired column index (ex. `c${colIdx}r${nextRowIdx}`)
            const nextSquare = document.getElementById(`c${colIdx}r${nextRowIdx}`)
            const leftSquare = document.getElementById(`c${leftColIdx}r${nextRowIdx}`)
            const rightSquare = document.getElementById(`c${rightColIdx}r${nextRowIdx}`)

            // Create an if statement to determine what to do with the newly created 'nextSquare' variable
            if (nextSquare) {
                // Check to see if the nextSquare's value === 0 to see if it can move
                if (board[colIdx][nextRowIdx] === 0) {
                    // Give the primary square a class of 'highlightedPrimary' to style it appropriately
                    square.classList.add('highlightedPrimary')
                    // Give the nextSquare a class of 'highlightedSecondary' to style all jump points accordingly
                    nextSquare.classList.add('highlightedSecondary')
                    // Set the highlightedPrimarySquare variable to equal the evt.target
                    highlightedPrimarySquare = square
                    // Push all nextSquare id's into the secondaryHighlightedSquares array by pushing in its id
                    secondaryHighlightedSquares.push(`c${colIdx}r${nextRowIdx}`)
                    
                    // Create an event listener for the nextSquare selection
                    nextSquare.addEventListener('click', function() {
                        board[colIdx][rowIdx] = 0
                        board[colIdx][nextRowIdx] = 1
                        render()
                        // Remove the primary highlight class from the highlightedPrimarySquare
                        highlightedPrimarySquare.classList.remove('highlightedPrimary')
                        // Run another forEach function to remove the highlightedSecondary class from all cells
                        // within the secondaryHighlightedSquares array
                        secondaryHighlightedSquares.forEach(cellId => {
                            const cell = document.getElementById(cellId)
                            if (cell) {
                                cell.classList.remove('highlightedSecondary')
                                render()
                            }
                        })
                        // Reset the highlightedPrimarySquare and secondaryHighlightedSquares back to their initial states
                        highlightedPrimarySquare = null
                        secondaryHighlightedSquares = []
                        enemyHighlightedSquares = []
                        newTurn()
                        render()
                    })
                } 
            }
            
            if (leftSquare) {
                // Check to see if the nextSquare's value !== 0 to see if it can move
                if (board[leftColIdx][nextRowIdx] < 0) {
                    // Give the primary square a class of 'highlightedPrimary' to style it appropriately
                    square.classList.add('highlightedPrimary')
                    // Give the nextSquare a class of 'highlightedSecondary' to style all jump points accordingly
                    leftSquare.classList.add('highlightedEnemy')
                    // Set the highlightedPrimarySquare variable to equal the evt.target
                    highlightedPrimarySquare = square
                    // Push all nextSquare id's into the secondaryHighlightedSquares array by pushing in its id
                    enemyHighlightedSquares.push(`c${leftColIdx}r${nextRowIdx}`)
                    
                    // Create an event listener for the nextSquare selection
                    leftSquare.addEventListener('click', function() {
                        board[colIdx][rowIdx] = 0
                        board[leftColIdx][nextRowIdx] = 1
                        // Remove the primary highlight class from the highlightedPrimarySquare
                        highlightedPrimarySquare.classList.remove('highlightedPrimary')
                        // Run another forEach function to remove the highlightedEnemy class from all cells
                        // within the enemyHighlightedSquares array
                        enemyHighlightedSquares.forEach(cellId => {
                            const cell = document.getElementById(cellId)
                            if (cell) {
                                cell.classList.remove('highlightedEnemy')
                                render()
                            }
                        })
                        // Reset the highlightedPrimarySquare and enemyHighlightedSquares back to their initial states
                        highlightedPrimarySquare = null
                        enemyHighlightedSquares = []
                        render()
                    })
                } 
            }
        }
    })
}
wPawn()