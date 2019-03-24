import 'colors';

import {
  createStore,
  applyMiddleware,
} from 'redux'

import createSagaMiddleware from 'redux-saga';

import reducer from './reducer';

import * as ACTION_TYPES from './actionTypes';

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
  take,
} from 'redux-saga/effects';

// testing take
// try to dispatch LOGIN two times. Does the saga catch the second action ?
function* waitLogin() {
  console.log('SAGA waitLogin'.magenta, 'start'.grey);

  const action = yield take(ACTION_TYPES.LOGIN);
  console.log('SAGA waitLogin'.magenta, 'received'.grey, action);
}
// sagaMiddleware.run(waitLogin);

// testing take
// try to dispatch LOGIN two times. Does the saga catch the second action ?
function* waitLogins() {
  console.log('SAGA waitLogins'.yellow, 'start'.grey);

  while (true) {
    const action = yield take(ACTION_TYPES.LOGIN);
    console.log('SAGA waitLogins'.yellow, 'received'.grey, action);
  }
}
// sagaMiddleware.run(waitLogins);

import {
  takeEvery,
} from 'redux-saga/effects';

// testing takeEvery
// try to dispatch LOGIN two times. Does the saga catch the second action ?
function* waitEveryLogin() {
  console.log('SAGA waitLogins'.cyan, 'start'.grey);

  yield takeEvery(ACTION_TYPES.LOGIN, function* (action) {
    console.log('SAGA waitLogins'.cyan, 'received'.grey, action);
  });
}
// sagaMiddleware.run(waitEveryLogin);

import {
  put,
} from 'redux-saga/effects';

// testing put
function* dispatchSomething() {
  console.log('SAGA dispatchSomething'.green, 'start'.grey);

  yield put({
    type: ACTION_TYPES.ANOTHER_ACTION,
  });
}
// sagaMiddleware.run(dispatchSomething);

import {
  select,
} from 'redux-saga/effects';

import {
  isLoggedSelector,
} from './selectors';

import * as service from './service';

// testing select
function* selectSomething() {
  console.log('SAGA selectSomething'.blue, 'start'.grey);

  const isLogged = yield select(isLoggedSelector);
  console.log('SAGA selectSomething'.blue, 'state'.grey, isLogged);
}
// sagaMiddleware.run(selectSomething);

import {
  call,
} from 'redux-saga/effects';

// testing output side effect
// test service.loginThatFail
function* loginSaga() {
  console.log('SAGA loginSaga'.red, 'start'.grey);
  yield take(ACTION_TYPES.LOGIN);

  yield put({
    type: ACTION_TYPES.LOGIN_REQUESTED,
  });

  try {
    const result = yield call(
      service.login,
    );
    console.log('SAGA loginSaga'.red, 'success'.grey, result);

    yield put({
      type: ACTION_TYPES.LOGIN_SUCCEEDED,
    });
  } catch(error) {
    yield put({
      type: ACTION_TYPES.LOGIN_FAILED,
    });

    console.log('SAGA loginSaga'.red, 'failure'.grey);
  }

  const isLogged = yield select(isLoggedSelector);
  console.log('SAGA loginSaga'.red, 'state'.grey, isLogged);
}
// sagaMiddleware.run(loginSaga);

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

// testing input side effect
function* websocketSaga() {
  console.log('SAGA websocketSaga'.blue, 'start'.grey);

  yield take(ACTION_TYPES.LOGIN_SUCCEEDED);

  yield takeEvery(websocketChannel, function* (message) {
    console.log('SAGA websocketSaga'.blue, 'new message'.grey, message);
  });
}
// sagaMiddleware.run(websocketSaga);

import {
  delay,
} from 'redux-saga/effects';

function* process1() {
  console.log('SAGA process1'.blue, 'start'.grey);

  yield delay(2000);
  console.log('SAGA process1'.blue, 'done'.grey);

  return 'process1 done';
}

function* process2() {
  console.log('SAGA process2'.magenta, 'start'.grey);

  yield delay(1000);
  console.log('SAGA process2'.magenta, 'done'.grey);

  return 'process2 done';
}

import {
  fork,
  join,
} from 'redux-saga/effects';

// testing async process synchronisation with join / fork
// test without join
// test to only join task2
function* syncSaga() {
  console.log('SAGA syncSaga'.green, 'start'.grey);
  const task1 = yield fork(process1);
  const task2 = yield fork(process2);

  // const results = yield join(task2);
  const results = yield join([
    task1,
    task2,
  ]);

  console.log('SAGA syncSaga'.green, 'done'.grey, results);
}
// sagaMiddleware.run(syncSaga);

import {
  all,
} from 'redux-saga/effects';

// testing async process synchronisation with all
// test replacing call with fork
function* syncSagaBis() {
  console.log('SAGA syncSagaBis'.cyan, 'start'.grey);

  const results = yield all({
    process1: call(process1),
    process2: call(process2),
  });

  console.log('SAGA syncSagaBis'.cyan, 'done'.grey, results);
}
// sagaMiddleware.run(syncSagaBis);

import {
  race,
} from 'redux-saga/effects';

// testing async process synchronisation with race
// try dispatching ANOTHER_ACTION before process1 is done
function* doSomethingOnLoginSaga() {
  console.log('SAGA doSomethingOnLoginSaga'.red, 'start'.grey);

  yield take(ACTION_TYPES.LOGIN);

  const {
    result,
    isCanceled,
  } = yield race({
    result: call(process1),
    isCanceled: take(ACTION_TYPES.ANOTHER_ACTION),
  });

  console.log('SAGA doSomethingOnLoginSaga'.red, 'done'.grey, `${result}`.yellow, isCanceled);
}
// sagaMiddleware.run(doSomethingOnLoginSaga);

store.dispatch({ type: ACTION_TYPES.LOGIN });
// setTimeout(() => {
//   store.dispatch({ type: ACTION_TYPES.ANOTHER_ACTION });
// }, 1000);
