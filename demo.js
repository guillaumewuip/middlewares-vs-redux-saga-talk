import 'colors';

import {
  createStore,
  applyMiddleware,
} from 'redux'

import reducer from './reducer';

import * as ACTION_TYPES from './actionTypes';

console.clear();
console.log(`-- Start ${Date.now()} !`.grey);

const simpleMiddleware1 = store => next => action => {
  console.log('MIDDLEWARE 1 '.blue, 'received'.grey, action);

  // next(action);
};

const simpleMiddleware2 = store => next => action => {
  console.log('MIDDLEWARE 2 '.magenta, 'received'.grey, action);

  next(action);

  const {
    dispatch,
  } = store;

  const {
    type,
  } = action;

  dispatch({ type: ACTION_TYPES.ANOTHER_ACTION });
}

const simpleMiddleware3 = store => next => action => {
  // import {
  //   isLoggedSelector,
  // } from './selectors';

  console.log('MIDDLEWARE 3 '.yellow, 'received'.grey, action);

  next(action);

  const {
    getState,
  } = store;

  const state = 'what';

  console.log('MIDDLEWARE 3 '.yellow, 'state'.grey, isLogged);
};

const simpleMiddleware4 = store => next => action => {
  console.log('MIDDLEWARE 4 '.cyan, 'received'.grey, action);

  const transformedAction = action;

  next(transformedAction);
};

const httpMiddleware = store => next => action => {
  // import * as service from './service';
  console.log('MIDDLEWARE HTTP '.cyan, 'received'.grey, action);

  next(action);

  const {
    dispatch,
  } = store;

  const {
    type,
  } = action;

  if (type === ACTION_TYPES.LOGIN) {
    dispatch({ type: ACTION_TYPES.LOGIN_REQUESTED });

    service
      .login()
      .then(() => {
        dispatch({ type: ACTION_TYPES.LOGIN_SUCCEEDED });
      })
      .catch(error => {
        dispatch({ type: ACTION_TYPES.LOGIN_FAILED });
      });
  }
};

import * as websocket from './websocket';

// And if I want to start websocket *after* login success ?
const websocketAfterLoginMiddleware = store => {
  const {
    dispatch,
  } = store;

  websocket.onNewMessage((message) => {
    dispatch({
      type: ACTION_TYPES.NOTIFICATION_RECEIVED,
      message,
    });
  });


  return next => action => {
    next(action);
  };
};

const thunkMiddleware = store => next => action => {
  console.log('THUNK '.blue, 'received'.grey, action);
  const {
    dispatch,
    getState,
  } = store;

  if (typeof action === 'function') {
    action(dispatch, getState);
  } else {
    next(action);
  }
};

const store = createStore(
  reducer,
  applyMiddleware(
    // simpleMiddleware1,
    // simpleMiddleware2,
    // simpleMiddleware3,
    // simpleMiddleware4,
    // thunkMiddleware,
    // httpMiddleware,
    // websocketAfterLoginMiddleware,
  ),
);

store.dispatch({ type: ACTION_TYPES.LOGIN });
