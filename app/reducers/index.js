import { combineReducers } from 'redux';
import * as reducers from './test';
console.log(reducers)
const reducer = combineReducers(reducers);
export default reducer;
