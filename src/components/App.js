import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser, logOutUser } from '../actions';
import { firebaseApp } from '../firebase';

// import '../../node_modules/jquery/dist/jquery.min.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
// import '../../node_modules/bootstrap/dist/js/bootstrap.min.js';
import '../styles/styles.css';

// components

import NavbarComponent from './NavbarComponent';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import NotFound from './NotFound';

import EditProfile from './protected/EditProfile';
import Profile from './protected/Profile';
import Add from './protected/Add';

// routes
// https://github.com/tylermcginnis/react-router-firebase-auth

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
        this.setState({
          auth: false,
          loading: false
        });
        this.props.logOutUser();
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    // const { user } = this.props;
    return this.state.loading ? <h1>Loading...</h1> : (
      <Router>
        <div>
          <NavbarComponent user={this.props.user} />
          <div className="container">
            <div className="row content">
              <Switch>
                <Route exact path='/' component={Home} />
                <PublicRoute auth={this.state.auth} path='/login' component={Login} user={this.props.user} />
                <PublicRoute auth={this.state.auth} path='/signup' component={SignUp} />
                <PrivateRoute auth={this.state.auth} exact path='/profile' component={Profile} user={this.props.user} />
                <PrivateRoute auth={this.state.auth} path='/profile/edit' component={EditProfile} user={this.props.user} />
                <PrivateRoute auth={this.state.auth} path='/add' component={Add} user={this.props.user} />
                <Route component={NotFound} />
              </Switch>
            </div>  
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

