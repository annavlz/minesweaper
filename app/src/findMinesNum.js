import isNeighbour from './neighbours'

function findNeighbours (mainCell, board) {
  let neighbours = board.filter(cell => {
    if(isNeighbour(cell, mainCell)) {
      return cell
    }
  })
  return neighbours
}

function findMinesNum (mainCell, board) {
  let neighbours = findNeighbours(mainCell, board)
  let mines = neighbours.filter(cell => {
    if(cell.val === 9){
      return cell
    }
  })
  return mines.length
}

export default findMinesNum
