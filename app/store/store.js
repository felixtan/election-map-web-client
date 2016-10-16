import { createStore } from 'redux';
import reducer from '../reducers/index.js';

let storeByEnvironment = null;
if (process.env.NODE_ENV === 'production') {
  storeByEnvironment = createStore(reducer);
} else {
  storeByEnvironment =
    createStore(reducer,
      window.devToolsExtension &&
      window.devToolsExtension());
}
const store = storeByEnvironment;
export default store;
