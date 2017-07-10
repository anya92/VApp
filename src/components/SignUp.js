import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../firebase';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      }
    };
  }

  signUp(e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
    .catch(error => {
      this.setState({ error });
    });
  }

  render() {
    return (
      <div className="login">
        <div className="header__login text-center">
          <Link to="/login">
            <h4 className="not-active">Zaloguj się</h4>
          </Link>
            <h4 className="active">Zarejestruj się</h4>
        </div>
        <div>
        </div>
        <form>
          <p className="error">{this.state.error.message}</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              onChange={e => this.setState({ email: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={e => this.setState({ password: e.target.value})}
            />
          </div>
          <div className="text-center">
            <button
              className="btn btn-lg"
              onClick={e => this.signUp(e)}
            >
              Zarejestruj się
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;
