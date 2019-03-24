import 'colors';

import {
  createStore,
} from 'redux'

import reducer from './reducer';

import * as ACTION_TYPES from './actionTypes';

console.clear();
console.log(`------------------- Start ${Date.now()} ! -------------------`.grey);

const store = createStore(
  reducer,
);

store.dispatch({ type: ACTION_TYPES.LOGIN });
