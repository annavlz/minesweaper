/** @jsx hJSX */

import {Rx} from '@cycle/core'
import {hJSX} from '@cycle/dom'
import minefield from './minefield'

function intent(DOM) {
  const newGameClick$ = Rx.Observable.fromEvent(newgame, 'click')
  return newGameClick$
}

function model(actions) {
  return actions.map(click => console.log('click'))
}

function view(items) {

}

function app (sources) {
  return console.log('app'),{
    DOM: model(intent(sources.DOM))
  }
}

export default app
