import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// components
import Map from './containers/Map';
import MissingRoute from './components/MissingRoute';

const routeConfig = (
  <Route path="/" component={Map}>
    <Route path="*" component={MissingRoute} />
  </Route>
);

render(
    <Router history={browserHistory} routes={routeConfig} />,
  document.getElementById('app')
);
