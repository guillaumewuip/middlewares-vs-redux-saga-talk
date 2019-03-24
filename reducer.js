import 'colors';

import {
  LOGIN_SUCCEEDED,
} from './actionTypes';

const defaultState = {
  isLogged: false,
};

const isValidAction = action => !action.type || !action.type.includes('@@redux');

export default function reducer(state = defaultState, action) {
  if (isValidAction(action)) {
    console.log('REDUCER'.yellow, 'received'.grey, action);
  }

  if (action.type === LOGIN_SUCCEEDED) {
    return {
      ...state,
      isLogged: true,
    };
  }

  return state;
};
