import { GET_USER, LOGOUT_USER } from '../constants';

// let user = {
//   email: null,
//   displayName: null,
//   photoURL: null
// };

let user = null;

export default (state = user, action) => {
  switch (action.type) {
    case GET_USER:
      const { email, displayName, photoURL } = action;
      user = {
        email,
        displayName,
        photoURL
      };
      return user;
    case LOGOUT_USER:
      user = null;
      return user;
    default:
      return state;  
  }
};
