
import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import app from './src/app'
import minefield from './src/minefield'

// function main(responses) {
//   console.log('main')
//   return app(responses);
// }

// run(main, {
//   DOM: makeDOMDriver('#app')
// });


minefield(3)
// console.log('test');

