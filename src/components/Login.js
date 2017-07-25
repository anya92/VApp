import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp, userRef } from '../firebase';


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      },
      renderForgot: false,
      forgotEmail: '',
      resetSuccess: '',
      resetError: ''
    };
  }

  signIn(e) {
    e.preventDefault();
    const { email, password } = this.state;
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        const { uid, email } = user;
        userRef.child(uid).update({ email });
      })
      .catch(error => {
        this.setState({ error });
      }); 
  }

  forgotPassword = () => {
    this.setState(prevState => {
      return {
        renderForgot: !prevState.renderForgot
      };
    })
  }

  sendReset = () => {
    const { forgotEmail } = this.state;
    firebaseApp.auth().sendPasswordResetEmail(forgotEmail).then(() => {
      // Email sent.
      this.setState({ 
        resetSuccess: 'Email został wysłany.', 
        resetError: ''
      });
    }).catch(error => this.setState({ resetError: error.message }));
  }

  render() {
    return (
      <div className="login">
        <div className="header__login text-center">
          <h4 className="active">Zaloguj się</h4>
          <Link to="/signup">
            <h4 className="not-active">Zarejestruj się</h4>
          </Link>
        </div>
        <form className="form">
          <p className="error-message">{this.state.error.message}</p>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email"
              name="email"
              className="form-control"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Hasło</label>
            <input 
              type="password"
              name="password"
              className="form-control"
              onChange={e => this.setState({ password: e.target.value })}
             />
          </div>
          <div className="text-center">
            <button
              className="btn btn-lg"
              onClick={e => this.signIn(e)}
            >
              Zaloguj się
            </button>

          </div>   
        </form>
        <hr/>
        {
          !this.state.renderForgot 
          ? <div className="text-center">
              <button 
                className="btn btn-lg"
                onClick={this.forgotPassword}
              >
                Zapomniałeś hasła?
              </button>

            </div>
          : <div></div>  
        }
        
        { 
          this.state.renderForgot 
          ? (
              <div className="forgot-password">
                <p className="close-btn" onClick={this.forgotPassword}>&#x2715;</p>
                <form className="form">
                  <div className="form-group text-center">
                    <label htmlFor="forgot-email">Nie pamiętasz hasła? Podaj swój adres e-mail. <br/>Zostanie wysłany na niego link do zmiany hasła. </label>
                    <input 
                      type="email" 
                      name="forgot-email" 
                      className="form-control"
                      onChange={e => this.setState({ forgotEmail: e.target.value })}
                    />
                  </div>
                  <p className="success-message">{this.state.resetSuccess}</p>
                  <p className="error-message">{this.state.resetError}</p>
                </form>
                <div className="text-center">
                  <button 
                    type="submit" 
                    className="btn btn-lg"
                    onClick={this.sendReset}
                  >
                    Wyślij
                  </button>
                </div>
              </div>
            )
          : <div></div>
        }
      </div>
    );
  }
}

export default Login;
