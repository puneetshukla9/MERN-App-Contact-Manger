import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import manageContactsReducer from './reducer';
export const store = createStore(
  combineReducers({ manageContacts: manageContactsReducer }),
  applyMiddleware(ReduxThunk)
);