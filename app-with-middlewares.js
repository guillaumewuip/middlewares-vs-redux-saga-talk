import 'colors';

import {
  createStore,
  applyMiddleware,
} from 'redux'

import reducer from './reducer';

import * as ACTION_TYPES from './actionTypes';

import * as service from './service';

import * as websocket from './websocket';

console.clear();
console.log(`-- Start ${Date.now()} !`.grey);

// test removing next(action) to see if the action reach the reducer or not
// test calling next multiple times
// test calling next after a delay
// try to call dispatch without the switch on action.type
// try to call dispatch after a delay
// test the difference between calling next before / after dispatch
// try to call next only in the switch case
// testing transforming / extending the action before next
const simpleMiddleware = store => next => action => {
  console.log('MIDDLEWARE SIMPLE '.magenta, 'received'.grey, action);

  next(action);

  const {
    dispatch,
  } = store;

  const {
    type,
  } = action;

  switch (type) {
    case ACTION_TYPES.LOGIN: {
      dispatch({ type: ACTION_TYPES.ANOTHER_ACTION });
    }
  }
}

// "real" middleware
const websocketAfterLoginMiddleware = store => {
  const {
    dispatch,
  } = store;

  let isWebsocketAlreadyRunning = false;

  return next => action => {
    next(action);

    const {
      type,
    } = action;

    switch (type) {
      case ACTION_TYPES.LOGIN: {
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

      case ACTION_TYPES.LOGIN_SUCCEEDED: {
        // be sure to not listen twice to websocket if we receive multiple
        // login sucess
        if (isWebsocketAlreadyRunning) {
          return;
        }

        websocket.onNewMessage((message) => {
          dispatch({
            type: ACTION_TYPES.NOTIFICATION_RECEIVED,
            message,
          });
        });

        isWebsocketAlreadyRunning = true;
      }
    }
  };
};

const store = createStore(
  reducer,
  applyMiddleware(
    // simpleMiddleware,
    // websocketAfterLoginMiddleware,
  ),
);

store.dispatch({
  type: ACTION_TYPES.LOGIN,
});
