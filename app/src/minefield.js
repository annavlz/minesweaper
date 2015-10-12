function random (max) {
  return Math.floor(Math.random() * max)
}

function findNeighbours(position, board) {
  let neighbours = board.filter(cell => {
    neighbours(position, cell)
  })
  return neighbours
}

function makeBoardString (size) {
  return new Array(size*size)
  // return Array.apply(null, Array(size*size)).map(()=>{return 0})
}

function setMines (boardString) {
  let boardStringWithMines = boardString
  let mineTotal = Math.round(boardString.length / 6.4)
  let mineCount = 0
  while(mineCount < mineTotal) {
    let index = random(boardString.length)
    let cell = boardStringWithMines[index]
    if(!cell){
      boardStringWithMines[index] = 9
      mineCount++
    }
  }

  return boardStringWithMines
}

function makeBoardWithMines (stringWithMines) {
  console.log('mines', stringWithMines);
  let boardWithMines = []
  let size = Math.sqrt(stringWithMines.length)
  let count = 0
  for(let y = 0; y < size; y++){
    let row = []
    for(let x = 0; x < size; x++) {
      if(stringWithMines[count]) {
        row.push({val: 9, posX: x, posY: y})
      }else{
        row.push({val: 0, posX: x, posY: y})
      }
      count++
    }
    boardWithMines.push(row)
  }
  return boardWithMines
}

function getNumbers (boardWithMines) {
  let board = boardWithMines.map(cell => {
    findNeighbours(cell, boardWithMines)
  })


  return board
}





function minefield (size) {
  return makeBoardWithMines(setMines(makeBoardString(size)))
}
export default minefield


