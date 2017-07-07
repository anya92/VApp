import { GET_USER } from '../constants';

export function getUser(email, displayName, photoURL) {
  const action = {
    type: GET_USER,
    email,
    displayName,
    photoURL
  };
  return action;
}
