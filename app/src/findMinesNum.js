const neighbourPositions = [
  {x: -1, y: -1},
  {x: 0, y: -1},
  {x: 1, y: -1},
  {x: -1, y: 0},
  {x: 1, y: 0},
  {x: -1, y: 1},
  {x: 0, y: 1},
  {x: 1, y: 1}
]

function isNeighbour (checkCell, mainCell) {
  console.log('positions before', neighbourPositions)
  let checkCellNeighbours = neighbourPositions.forEach(cell => {

    console.log('cell position', cell);

    cell.x = cell.x + checkCell.x
    console.log('cellX', cell.x);
    cell.y = cell.y + checkCell.y
    console.log('cellY', cell.y);
    return cell
  })

  console.log('checkCellNeighbours', checkCellNeighbours);
  console.log('positions after', neighbourPositions);

  let thereIsNeighbour = checkCellNeighbours.find(cell => {
    cell.x === mainCell.x && cell.y === mainCell.y
  })

  console.log('thereIsNeighbour', thereIsNeighbour);

  return thereIsNeighbour ? true : false
}

function findNeighbours (mainCell, board) {

  let neighbours = board.filter(cell => {
    isNeighbour(cell, mainCell)
    // console.log('isNeighbour', isNeighbour(cell, mainCell));
  })
  console.log('findNeighbours', neighbours);
  return neighbours
}

function findMinesNum (mainCell, board) {
  console.log('findMinesNum');
  let neighbours = findNeighbours(mainCell, board)

  // console.log('mainCell', mainCell);
  let mines = neighbours.map(cell => {
    if(cell.val === 9){
      return cell
    }
  })
  // console.log('mines length', mines);
  return mines.length
}

export default findMinesNum
