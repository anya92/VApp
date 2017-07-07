import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser, logOutUser } from '../actions';
import { firebaseApp } from '../firebase';

// components

import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import NotFound from './NotFound';
import Profile from './protected/Profile';

// routes

function PrivateRoute({ component: Component, auth, ...rest }) {
  return (
    <Route 
      {...rest}
      render={(props) => auth === true
        ? <Component {...props} {...rest}/>
        : <Redirect to={{ pathname: '/login', state: { from: props.location }}} /> 
      }
    />
  );
}

function PublicRoute({ component: Component, auth, ...rest }) {
  return (
    <Route 
      {...rest}
      render={(props) => auth === false
        ? <Component {...props} {...rest} />
        : <Redirect to="/profile" />}
    />
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      auth: false
    }

  }

  componentDidMount() {
    this.removeListener = firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        const { email, displayName, photoURL } = user;
        this.props.getUser(email, displayName, photoURL);
        this.setState({
          auth: true,
          loading: false
        });
      } else {
        this.props.logOutUser();
        this.setState({
          auth: false,
          loading: false
        });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    return this.state.loading ? <h1>Loading...</h1> : (
      <Router>
        <div>
          <nav>Voting App</nav>
          <div className="container">
            <Switch>
              <Route exact path='/' component={Home} />
              <PublicRoute auth={this.state.auth} path='/login' component={Login} user={this.props.user} />
              <PublicRoute auth={this.state.auth} path='/signup' component={SignUp} />
              <PrivateRoute auth={this.state.auth} path='/profile' component={Profile} user={this.props.user} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
      </Router>
    );  
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return {
    user
  }
}

export default connect(mapStateToProps, { getUser, logOutUser })(App);

