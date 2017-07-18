import { GET_USER, LOGOUT_USER, GET_ALL_POLLS } from '../constants';
import { pollRef } from '../firebase';

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

export function getAllPolls() {
  return dispatch => {
    dispatch({ type: 'GET_ALL_POLLS_REQUEST' });
    pollRef.on('value', snap => {
      let polls = [];
      snap.forEach(poll => {
        const { title, author, answers, created_At, numberOfVotes } = poll.val(); //TODO 
        const pollKey = poll.key;
        polls.push({ pollKey, title, author, answers, created_At, numberOfVotes });
      });
      dispatch(getAllPoolsAction(polls));
    },
    error => {
      dispatch({ type: 'GET_ALL_POLLS_ERROR' });
      throw error;
    });
  }
}

function getAllPoolsAction(polls) {
  const action = {
    type: GET_ALL_POLLS,
    polls
  };
  return action;
}

// export function getSinglePoll(key) {
//   return dispatch => {
//     dispatch({ type: 'GET_SINGLE_POLL_REQUEST' });
//     pollRef.child(key).on('value', snap => {
//       let singlePoll = snap.val();
//       // if (!singlePoll) {
//       //   return;
//       // }
//       userRef.child(singlePoll.author).on('value', snap => {
//         const { displayName, email, photoURL } = snap.val();
//         singlePoll.author = { displayName, photoURL, email };
//         dispatch({ type: 'GET_SINGLE_POLL', singlePoll });
//       },
//       error => {
//         dispatch({ type: 'GET_SINGLE_POLL_ERROR' });
//         throw error;
//       });
//     },
//     error => {
//       dispatch({ type: 'GET_SINGLE_POLL_ERROR' });
//       throw error;
//     });
//   }
// }
