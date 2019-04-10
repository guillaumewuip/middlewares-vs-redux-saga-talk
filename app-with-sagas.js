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

import {
  takeEvery,
  put,
  call,
  select,
  fork,
  take,
} from 'redux-saga/effects';

function* listenLogin() {
  console.log('SAGA listenLogin'.magenta, 'start'.grey);

  yield takeEvery(ACTION_TYPES.LOGIN, function* (action) {
    console.log('SAGA listenLogin'.magenta, 'received'.grey, action);

    const isLogged = yield select(isLoggedSelector);
    console.log('SAGA listenLogin'.magenta, 'state'.grey, isLogged);

    yield put({
      type: ACTION_TYPES.LOGIN_REQUESTED
    });

    try {
      const result = yield call(
        service.login,
        // service.loginThatFail,
      );

      console.log('SAGA listenLogin'.magenta, 'service success'.grey);

      yield put({
        type: ACTION_TYPES.LOGIN_SUCCEEDED,
        result,
      });
    } catch (error) {
      console.log('SAGA listenLogin'.magenta, 'service failure'.grey);

      yield put({
        type: ACTION_TYPES.LOGIN_FAILED,
        errorMessage: error.message,
      });
    }
  });
}

// sagaMiddleware.run(listenLogin);

function* listenWebsocket() {
  console.log('SAGA listenWebsocket'.blue, 'start'.grey);

  yield takeEvery(websocketChannel, function* (message) {
    console.log('SAGA listenWebsocket'.blue, 'message received'.grey);
    yield put({
      type: ACTION_TYPES.NOTIFICATION_RECEIVED,
    });
  });
}

// sagaMiddleware.run(listenWebsocket);

function* mainSaga() {
  console.log('SAGA mainSaga'.green, 'start'.grey);
  yield fork(listenLogin);

  yield take(ACTION_TYPES.LOGIN_SUCCEEDED);
  console.log('SAGA mainSaga'.green, 'login success'.grey);
  yield fork(listenWebsocket);
}

sagaMiddleware.run(mainSaga);

store.dispatch({ type: ACTION_TYPES.LOGIN });
