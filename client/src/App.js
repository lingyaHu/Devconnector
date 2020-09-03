import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
import './App.css';
import { loadUser } from './actions/auth';
// Redux
//因为redux和react是separate，用provider将它们联系在一起
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken';

const App = () => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  // When the state updates, this will keep running, like a constant loop
  // 来自react-useEffect文档：
  // If you want to run an effect and clean it up only once (on mount and unmount),
  // you can pass an empty array ([]) as a second argument.
  // This tells React that your effect doesn’t depend on any values
  // from props or state, so it never needs to re-run.
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    // 用provider把它们包起来，这样里面的components都能使用这个state
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
