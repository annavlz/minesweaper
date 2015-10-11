
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import app from './src/app'

function main(responses) {
  console.log('main')
  return app(responses);
}

run(main, {
  DOM: makeDOMDriver('#app')
});


