/** @jsx hJSX */

import {Rx} from '@cycle/core'
import {hJSX} from '@cycle/dom'

function intent(DOM) {
  console.log('intent');
  return Rx.Observable.fromEvent(document, 'click')
}

function model(actions) {
  console.log('model')
  const word$ = actions.map(ev => {
    console.log("click")
    return ev
    })
  return word$
}

function view(items) {
  console.log("view")
  return items.map(word => {
    console.log(word);
    return <p>Hello</p>
  })
}

function app (sources) {
  return console.log('app'),{
    DOM: view(model(intent(sources.DOM)))
  }
}

export default app
