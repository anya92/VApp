import { GET_USER, LOGOUT_USER } from '../constants';

export function getUser(email, displayName, photoURL) {
  const action = {
    type: GET_USER,
    email,
    displayName,
    photoURL
  };
  return action;
}

export function logOutUser() {
  const action = {
    type: LOGOUT_USER
  };
  return action;
}
