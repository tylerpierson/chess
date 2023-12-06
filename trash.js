const wPawnSingleMove = document.getElementById(`c${colIdx}r${rowIdx + 1}`)
wPawnSingleMove.classList.add('highlightedSecondary')

const wPawnDoubleMove = document.getElementById(`c${colIdx}r${rowIdx + 2}`)
wPawnDoubleMove.classList.add('highlightedSecondary')

wPawnSingleMove.addEventListener('click', function(e) {
    e.stopPropagation()
    board[colIdx][rowIdx] = 0
    board[colIdx][rowIdx + 1] = 1
    turn *= -1
    wPawnSingleMove.classList.remove('highlightedSecondary')
    wPawnDoubleMove.classList.remove('highlightedSecondary')
    pieceId.classList.remove('highlightedPrimary')
    console.log(turn)
    render()
}, {once:true})  

wPawnDoubleMove.addEventListener('click', function(e) {
    e.stopPropagation()
    board[colIdx][rowIdx] = 0
    board[colIdx][rowIdx + 2] = 1
    turn *= -1
    wPawnSingleMove.classList.remove('highlightedSecondary')
    wPawnDoubleMove.classList.remove('highlightedSecondary')
    pieceId.classList.remove('highlightedPrimary')
    console.log(turn)
    render()
}, {once:true}) 