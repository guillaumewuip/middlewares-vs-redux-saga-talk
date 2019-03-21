import 'colors';

const isValidAction = action => !action.type || !action.type.includes('@@redux');

export default function reducer(state = {}, action) {
  if (isValidAction(action)) {
    console.log('REDUCER'.yellow, 'received'.grey, action);
  }

  return state;
};
