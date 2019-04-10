import 'colors';

import {
  createStore,
  applyMiddleware,
} from 'redux'

import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';

import * as ACTION_TYPES from './actionTypes';

import {
  isLoggedSelector,
} from './selectors';

import * as service from './service';

import * as websocket from './websocket';

import {
  eventChannel,
} from 'redux-saga';

const websocketChannel = eventChannel(emitter => {
  websocket.onNewMessage((message) => {
    emitter(message);
  });

  return () => {};
});

console.clear();
console.log(`-- Start ${Date.now()} !`.grey);

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(
    sagaMiddleware
  ),
);


store.dispatch({ type: ACTION_TYPES.LOGIN });
