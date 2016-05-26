import thunkMiddleware from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducer';

export default function makeStore() {
  return createStore(reducer, applyMiddleware(thunkMiddleware));
}
