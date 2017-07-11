import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp, userRef } from '../firebase';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      error: {
        message: ''
      }
    };
  }

  confirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  }

  signUp(e) {
    e.preventDefault();
    const { email, password, confirmPassword } = this.state;
    if (this.confirmPassword(password, confirmPassword)) {
      firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .then(user => {
        // saving user to database - uid as key
        const { uid, email } = user; 
        userRef.child(uid).set({
          email
        });
      })
      .catch(error => {
        this.setState({ error });
      });
    } else {
      this.setState({
        error: {
          message: 'Podane hasła się nie zgadzają.'
        }
      });
    }
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
          <div className="form-group">
            <label htmlFor="confirm-password">Powtórz hasło</label>
            <input
              type="password"
              name="confirm-password"
              className="form-control"
              onChange={e => this.setState({ confirmPassword: e.target.value})}
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
