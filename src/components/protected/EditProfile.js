import React, { Component } from 'react';
import { firebaseApp } from '../../firebase';
const userIcon = require('../../icons/user.svg');

class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoURL: '',
      displayName: '',
      email: '',
      error: {
        message: ''
      }
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


  updateUser = (e) => {
    e.preventDefault();
    const { displayName, photoURL } = this.state;
    const user = firebaseApp.auth().currentUser;
    user.updateProfile({
      displayName,
      photoURL,
    }).then(function() {
      // Update successful.
      console.log('updated');
    }, function(error) {
      this.setState({error})
      // An error happened.
    });
   
  }

  render() {
    const { email, photoURL } = this.props.user;
    const displayName = 'Ania Bania';
    return (
      <div>
        <div className="header__edit">
          <h1>Edytuj profil</h1>
          <p>{this.state.error.message}</p>
        </div>
        <div className="user-photo__edit col-sm-4">
          <img src={photoURL || userIcon} alt="user-photo" className="img-responsive" />
        </div>
        <div className="edit-form col-sm-8">
          <form>
            <div className="form-group">
              <label htmlFor="displayName">Ustaw lub zmień nazwę użytkownika</label>
              <input type="text" className="form-control" placeholder="Nazwa użytkownika" name="displayName" onChange={e => this.setState({ displayName: e.target.value })}/>
            </div>
            <div className="form-group">
              <label htmlFor="photo">Ustaw lub zmień zdjęcie profilowe</label>
              <input type="text" className="form-control" placeholder="Link do zdjęcia" name="photo"  onChange={e => this.setState({ photoURL: e.target.value })} />
            </div>
            <button 
              className="btn" 
              type="submit"
              onClick={e => this.updateUser(e)}
            >
              Zapisz
            </button>
            
          </form>
        </div>
      </div>
    );
  }
}

export default EditProfile;
