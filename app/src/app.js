/** @jsx hJSX */

import {Rx} from '@cycle/core'
import {h, hJSX} from '@cycle/dom'
import minefield from './minefield'
import cell from './cell'

function intent(DOM) {
  console.log('intent');
  const newGameClick$ = Rx.Observable
  .fromEvent(newgame, 'click')
  .startWith(true)
  return newGameClick$
}

function model(actions, itemFn) {
  console.log('model')
  function createCell(props) {
    const sinks = itemFn(props)
    sinks.DOM = sinks.DOM.replay(null, 1)
    sinks.DOM.connect()
    return {DOM: sinks.DOM}
  }

  const initialState = []

  const addItemMod$ = actions.map(click => {
    let game = minefield(8)
    let newItems = []
    game.map(cell => {
      newItems.push(createCell({val: cell.val}))
    })
    return function (listItems) {
      return listItems.concat(newItems)
    }
  })
  return Rx.Observable.merge(addItemMod$)
    .startWith(initialState)
    .scan((listItems, modification) => modification(listItems))
    .publishValue(initialState).refCount()
}

function view(itemDOMs$) {
  console.log('view');
  return itemDOMs$.map(itemDOMs =>
    <div className="minefield">{itemDOMs}</div>
  )
}

function makeItemWrapper(DOM) {
  return function itemWrapper(props) {
    const propsObservables = {
      val$: Rx.Observable.just(props.val),
    }
    return cell({props: propsObservables})
  }
}

function app (sources) {
  const actions = intent(sources.DOM)
  console.log('actions', actions);
  const itemWrapper = makeItemWrapper(sources.DOM)
  const items$ = model(actions, itemWrapper)
  console.log('items$', items$);
  const itemDOMs$ = items$.map(items => items.map(item => item.DOM))
  console.log('itemDOMs$', itemDOMs$)
  const vtree$ = view(itemDOMs$)
  return console.log('app'),
  {
    DOM: vtree$
  }
}

export default app
