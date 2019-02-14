import * as React from 'react';

import { Route, Switch } from 'react-router-dom';

import Home from '@views/Home';

export default (props) => {
  return (
    <Switch>
      <Route component={Home} exact path="/" />
    </Switch>
  );
};
