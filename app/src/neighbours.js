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

  let checkCellNeighbours = JSON.parse(JSON.stringify(neighbourPositions))
    .map(cell => {
      cell.x += checkCell.posX
      cell.y += checkCell.posY
      return cell
    })

  let thereIsNeighbour = checkCellNeighbours.find(cell => {
    if(cell.x === mainCell.posX && cell.y === mainCell.posY) {
      return cell
    }
  })

  return thereIsNeighbour ? true : false
}

export default isNeighbour
