import { GET_USER, LOGOUT_USER, GET_ALL_POLLS } from '../constants';

export function getUser(uid, email, displayName, photoURL) {
  const action = {
    type: GET_USER,
    uid,
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

export function getAllPolls(polls) {
  const action = {
    type: GET_ALL_POLLS,
    polls
  };
  return action;
}
