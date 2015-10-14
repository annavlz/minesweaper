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
  const board$ = actions.concatMap(click => {
    const game = minefield(8)
    return game.map(cell => {
      return cell})
  })
  return board$
}

function view(items) {
  return items.map(cell => {
    console.log('cell', cell)
    let id = String(cell.posX)+String(cell.posY)
    // return h('div.cell', [String(cell.val)])
    return <div className="cell">{cell.val}</div>
  })
}

function app (sources) {

  return console.log('app'),
  {
    DOM: view(model(intent(sources.DOM)))
  }
}

export default app
