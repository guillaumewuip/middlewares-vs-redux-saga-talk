import 'colors';

import {
  createStore,
} from 'redux'

import reducer from './reducer';

const store = createStore(reducer);

console.log('---------------------------- Start ! ----------------------------'.red);
store.dispatch({ type: 'LOGIN' });
