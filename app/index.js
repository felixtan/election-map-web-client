import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

// components
import Map from './containers/Map'
import MissingRoute from './components/MissingRoute/index.jsx'

// import rsdb from './fixtures/rsdb.js';
import store from './store/store.js';

require('../node_modules/leaflet.pattern')

const routeConfig = (
  <Route path="/" component={Map}>
    <Route path="*" component={MissingRoute} />
  </Route>
);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routeConfig} />
  </Provider>,
  document.getElementById('app')
);
