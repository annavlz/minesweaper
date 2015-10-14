/** @jsx hJSX */

import {Rx} from '@cycle/core'
import {h, hJSX} from '@cycle/dom'
import minefield from './minefield'

function intent(DOM) {
  const newGameClick$ = Rx.Observable
  .fromEvent(newgame, 'click')
  .startWith(true)
  return newGameClick$
}

function model(actions) {
  return actions.map(click => {
    const game = minefield(8)
    game.map(cell => {
      // console.log('cell', cell);
      return cell})
  })
}

function view(items) {
  return items.map(board => {
    console.log('board', board)
    board.map(cell => {
      // console.log('cell', cell.val, cell.posX, cell.posY)
      let id = String(cell.posX)+String(cell.posY)
      return h('div.cell', [String(cell.val)])
      // return <div className="cell">Hello</div>
    })
  })
}

function app (sources) {

  return console.log('app'), view(model(intent(sources.DOM))).map(cell => console.log("render", cell)),
  {
    DOM: view(model(intent(sources.DOM)))
  }
}

export default app
