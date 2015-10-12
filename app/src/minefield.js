import findMinesNum from './findMinesNum'

function random (max) {
  return Math.floor(Math.random() * max)
}

function makeBoardString (size) {
  return new Array(size*size)
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
  let boardWithMines = []
  let size = Math.sqrt(stringWithMines.length)
  let count = 0
  for(let y = 0; y < size; y++){
    for(let x = 0; x < size; x++) {
      if(stringWithMines[count]) {
        boardWithMines.push({val: 9, posX: x, posY: y})
      }else{
        boardWithMines.push({val: 0, posX: x, posY: y})
      }
      count++
    }
  }
  return boardWithMines
}

function getNumbers (boardWithMines) {
  let board = boardWithMines.map(cell => {
    if(cell.val === 9) {
      console.log('mine');
      return cell
    }else{
      console.log('sending cell', cell);
      cell.val = findMinesNum(cell, boardWithMines)
      // console.log("mines num", findMinesNum(cell, boardWithMines))

      return cell
    }
  })
  return board
}


function minefield (size) {
  return getNumbers(makeBoardWithMines(setMines(makeBoardString(size))))
}
export default minefield


