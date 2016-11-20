import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { Provider } from 'react-redux';

// components
import Map from './containers/Map';
import MissingRoute from './components/MissingRoute';

// import rsdb from './fixtures/rsdb.js';
import store from './store/store.js';

require('../node_modules/leaflet.pattern');

const routeConfig = (
  <Route path="/" component={Map}>
    <Route path="*" component={MissingRoute} />
  </Route>
);

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routeConfig} />
  </Provider>,
  document.getElementById('app')
);
