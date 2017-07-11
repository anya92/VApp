import React, { Component } from 'react';
import * as firebase from 'firebase';
import { firebaseApp, userRef } from '../../firebase';
const userIcon = require('../../icons/user.png');
const errorIcon = require('../../icons/error.png');

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoURL: '',
      displayName: '',
      email: '',
      providedPassword: '',
      newPassword: '',
      error: {
        message: ''
      },
      successEmail: '',
      successPassword: '',
      errorPassword: ''
    };
  }

  componentDidMount() {
    const { email, displayName, photoURL } = this.props.user;

    this.setState({
      displayName,
      email,
      photoURL
    });
   }


  updateUser = e => {
    e.preventDefault();
    const { displayName, photoURL } = this.state;
    const user = firebaseApp.auth().currentUser;
    user.updateProfile({
      displayName,
      photoURL,
    }).then(() => {
      // Update successful.
      const { uid, email, displayName, photoURL } = user;
      this.props.getUser(email, displayName, photoURL);
      // update user in database
      userRef.child(uid).update({
        displayName,
        photoURL
      });
      // console.log(user);
      // redirect to profile page
      this.props.history.push('/profil');
    }, error => {
      // An error happened.
      this.setState({ error });
    });
  }

  changeEmail = e => {
    e.preventDefault();
    const { email, providedPassword } = this.state;
    const user = firebaseApp.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, providedPassword);

    user.reauthenticateWithCredential(credential).then(() => {
      // User re-authenticated.
      user.updateEmail(email).then(() => {
        // Update successful.
        const { uid, email, displayName, photoURL } = user;
        this.props.getUser(email, displayName, photoURL);
        // update user in database
        userRef.child(uid).update({
          email
        });
        this.setState({ successEmail: 'Email został zmieniony pomyślnie.' })
        // this.props.history.push('/profil');
      }).catch(error => this.setState({ error }));
    }).catch(error => this.setState({ error }));
  }

  changePassword = e => {
    e.preventDefault();
    const { providedPassword, newPassword } = this.state;
    const user = firebaseApp.auth().currentUser;
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, providedPassword);
    user.reauthenticateWithCredential(credential).then(() => {
      // User re-authenticated.
      user.updatePassword(newPassword).then(() => {
        // Update successful.
        this.setState({ 
          successPassword: 'Hasło zostało zmienione.',
          errorPassword: ''
        });
      }).catch(error => this.setState({ errorPassword: error.message }));
    }).catch(error => this.setState({ errorPassword: error.message }));
  }

  imageError = () => {
    this.image.src = errorIcon;
  }

  render() {
    
    return (
      <div className="profile__edit">
        <div className="header__edit">
          <h1 className="text-center">Ustawienia</h1>
          <p>{this.state.error.message}</p>
        </div>
        <div className="col-md-4">
          <div className="user-photo__edit">
            <img src={this.state.photoURL || userIcon} alt="user" className="img-responsive" ref={ref => (this.image = ref)} onError={() => this.imageError()} />
          </div>
        </div>
        <div className="user-info__edit col-md-8">
          <form>
            <fieldset>
              <legend>Dane użytkownika</legend>
              <div className="form-group">
                <label htmlFor="displayName">Ustaw lub zmień nazwę użytkownika</label>
                <input type="text" className="form-control" placeholder="Nazwa użytkownika" name="displayName" value={this.state.displayName || ''} onChange={e => this.setState({ displayName: e.target.value })}/>
              </div>
              <div className="form-group">
                <label htmlFor="photo">Ustaw lub zmień zdjęcie profilowe</label>
                <input type="text" className="form-control" placeholder="Link do zdjęcia" name="photo" value={this.state.photoURL || ''} onChange={e => this.setState({ photoURL: e.target.value })} />
              </div>
              <div className="row text-center">
                <button 
                  className="btn btn-lg" 
                  type="submit"
                  onClick={e => this.updateUser(e)}
                >
                  Zapisz
                </button>
              </div>
            </fieldset>  
          </form>
        </div>
        <div className="email__edit col-md-8 col-md-push-4">  
          <form>
            <fieldset>
              <legend>Zmiana adresu e-mail</legend>
              <p className="success-message">{this.state.successEmail}</p>
              <div className="form-group">
                <label htmlFor="email">Nowy adres e-mail</label>
                <input type="email" className="form-control" placeholder="Email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="providedPassword">Hasło</label>
                <input type="password" className="form-control" name="providedPassword" placeholder="Hasło" onChange={e => this.setState({ providedPassword: e.target.value })} />
              </div>
              <div className="text-center">
                <button 
                  className="btn btn-lg" 
                  type="submit"
                  onClick={e => this.changeEmail(e)}
                >
                  Zapisz
                </button>

              </div>
            </fieldset>  
          </form>
        </div>
        <div className="password__edit col-md-8 col-md-push-4" >
          <form>
            <fieldset>
              <legend>Zmiana hasła</legend>
              <p>W celu zmiany hasła, podaj obecne hasło, a następnie wpisz nowe hasło.</p>
              <div className="form-group">
                <label htmlFor="old-password">Obecne hasło</label>
                <input type="password" className="form-control" name="old-password" placeholder="Obecne hasło" onChange={e => this.setState({ providedPassword: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="new-password">Nowe hasło</label>
                <input type="password" className="form-control" name="new-password" placeholder="Nowe hasło" onChange={e => this.setState({ newPassword: e.target.value })} />
              </div>
              <p className="success-message">{this.state.successPassword}</p>
              <p className="error-message">{this.state.errorPassword}</p>
              <div className="text-center">
                <button 
                  className="btn btn-lg" 
                  type="submit"
                  onClick={e => this.changePassword(e)}
                >
                  Zapisz
                </button>

              </div>
            </fieldset>  
          </form>
        </div>
      </div>
    );
  }
}

export default EditProfile;
