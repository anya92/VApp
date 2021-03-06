import React, { Component } from 'react';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser, logOutUser } from '../actions';
import { firebaseApp, userRef } from '../firebase';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.css';

// components

import NavbarComponent from './NavbarComponent';
import Footer from './Footer';
import Home from './Home';
import SinglePoll from './SinglePoll';
import Login from './Login';
import SignUp from './SignUp';
import Popular from './Popular';
import NotFound from './NotFound';

import EditProfile from './protected/EditProfile';
import Profile from './protected/Profile';
import Add from './protected/Add';

// routes (https://github.com/tylermcginnis/react-router-firebase-auth)

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
        : <Redirect to="/profil" />}
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
    // get user
    this.removeListener = firebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid } = user;
        userRef.child(uid).on('value', snap => {
          const { email, displayName, photoURL } = snap.val();
          this.props.getUser(uid, email, displayName, photoURL);
          this.setState({
            auth: true,
            loading: false
          });
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
    return this.state.loading ? <div id="loading"></div> : (
      <Router>
        <div>
          <NavbarComponent user={this.props.user} />
          <div className="container">
            <div className="col-md-10 col-md-offset-1 content">
              <Switch>
                <Route exact path='/' render={() => (<Home />)} />
                <Route exact path='/glosowanie/:key' component={SinglePoll} />
                <Route path='/top' component={Popular} />
                <PublicRoute auth={this.state.auth} path='/login' component={Login} user={this.props.user} />
                <PublicRoute auth={this.state.auth} path='/signup' component={SignUp} />
                <PrivateRoute auth={this.state.auth} exact path='/profil' component={Profile} user={this.props.user} />
                <PrivateRoute auth={this.state.auth} path='/ustawienia' component={EditProfile} user={this.props.user} />
                <PrivateRoute auth={this.state.auth} path='/dodaj' component={Add} user={this.props.user} />
                <Route component={NotFound} />
              </Switch>
            </div>  
          </div>
          <Footer />
        </div>
      </Router>
    );  
  }
}

function mapStateToProps(state) {
  const { user, polls } = state;
  return {
    user,
    polls
  }
}

export default connect(mapStateToProps, { getUser, logOutUser })(App);

