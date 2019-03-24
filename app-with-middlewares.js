import 'colors';

import {
  createStore,
  applyMiddleware,
} from 'redux'

import reducer from './reducer';

import * as ACTION_TYPES from './actionTypes';

console.clear();
console.log(`-- Start ${Date.now()} !`.grey);

// most basic middleware
// test removing next(action) to see if the action reach the reducer or not
// test calling next multiple times
// texst calling next after a delay
const simpleMiddleware1 = store => next => action => {
  console.log('MIDDLEWARE 1 '.blue, 'received'.grey, action);

  next(action);
};

// testing dispatch
// try to call dispatch without the switch on action.type
// try to call dispatch after a delay
// test the difference between calling next before / after dispatch
// try to call next only in the switch
const simpleMiddleware2 = store => next => action => {
  console.log('MIDDLEWARE 2 '.magenta, 'received'.grey, action);

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

import {
  isLoggedSelector,
} from './selectors';

// testing getState
const simpleMiddleware3 = store => next => action => {
  console.log('MIDDLEWARE 3 '.yellow, 'received'.grey, action);

  next(action);

  const {
    getState,
  } = store;

  const state = getState();
  const isLogged = isLoggedSelector(state)

  console.log('MIDDLEWARE 3 '.yellow, 'state'.grey, isLogged);
};

// testing transforming / extending the action
// test putting this middleware first in applyMiddleware
const simpleMiddleware4 = store => next => action => {
  console.log('MIDDLEWARE 4 '.cyan, 'received'.grey, action);

  const transformedAction = {
    type: `${action.type}-transformed`,
    date: new Date().toISOString(),
  }

  next(transformedAction);
};

import * as service from './service';

// testing output side effect after LOGIN action
// try service.loginThatFail
const httpMiddleware = store => next => action => {
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

// testing input side effect
// try not returning next => action => {}
const websocketMiddleware = store => {
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


// And if I want to start websocket *after* login success ?
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

const thunkMiddleware = store => next => action => {
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
    // thunkMiddleware,
    // simpleMiddleware1,
    // simpleMiddleware2,
    // simpleMiddleware3,
    // simpleMiddleware4,
    // httpMiddleware,
    // websocketMiddleware,
    // websocketAfterLoginMiddleware,
  ),
);

store.dispatch({ type: ACTION_TYPES.LOGIN });
