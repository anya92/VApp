import { GET_USER, LOGOUT_USER, GET_ALL_POLLS } from '../constants';
import { userRef, pollRef } from '../firebase';

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

// add pagination

export function getAllPolls() {
  return dispatch => {
    dispatch({ type: 'GET_ALL_POLLS_REQUEST' });
    pollRef.on('value', snap => {
      let polls = [];
      snap.forEach(poll => {
        const { title, author, answers, created_At, numberOfVotes, photoURL } = poll.val(); //TODO 
        const pollKey = poll.key;
        polls.push({ pollKey, title, author, answers, created_At, numberOfVotes, photoURL });
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

export function getSinglePoll(key) {
  return dispatch => {
    dispatch({ type: 'GET_SINGLE_POLL_REQUEST' });
    let singlePoll = null;
    pollRef.child(key).on('value', snap => {
      singlePoll = snap.val();
      singlePoll.pollKey = snap.key;
      userRef.child(singlePoll.author).on('value', snap => {
        const { displayName, email, photoURL } = snap.val();
        singlePoll.author = { displayName, photoURL, email };
        dispatch({ type: 'GET_SINGLE_POLL', singlePoll });
      },
      error => {
        dispatch({ type: 'GET_SINGLE_POLL_ERROR' });
        throw error;
      });
    },
    error => {
      dispatch({ type: 'GET_SINGLE_POLL_ERROR' });
      throw error;
    });
  }
}

export function getPollsPagination(page = 1) {
  return dispatch => {
    dispatch({ type: 'GET_POLLS_PAGINATION_REQUEST' });
    fetch(`${pollRef.toString()}.json?shallow=true`) // get number of polls in database
      .then(res => res.json())
      .then(data => {
        console.log('start pagination');
        const keys = Object.keys(data).sort();
        const perPage = 4;
        const numberOfPages = Math.ceil(keys.length / perPage);
        let nextKey, query, promises = [];
        for (let i = 0; i < numberOfPages; i++) {
          nextKey = keys[i * perPage];
          query = pollRef.orderByKey().limitToFirst(perPage).startAt(nextKey);
          console.log('query', query.toString());
          promises.push(query.once('value'));
        }

        Promise.all(promises)
          .then(snaps => {
            let pages = [];
            snaps.forEach((snap, i) => {
              const polls = snap.val();
              let page = [];
              for (let key in polls) {
                let values = polls[key];
                page.push({ key, ...polls[key] });
              }
              pages.push(page);
            });
            dispatch({ type: 'GET_POLLS_PAGINATION_SUCCESS', pages });
          });

      })
      .catch(error => console.log(error));

  }
}
