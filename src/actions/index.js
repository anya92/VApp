import { GET_USER, LOGOUT_USER } from '../constants';
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


export function getPollsPerPage(page = 1) {
  return dispatch => {
    dispatch({ type: 'GET_POLLS_PER_PAGE_REQUEST' });
    fetch(`${pollRef.toString()}.json?shallow=true`) // get number of polls in database
      .then(res => res.json())
      .then(data => {
        const keys = Object.keys(data).sort();
        const perPage = 6;
        const numberOfPages = Math.ceil(keys.length / perPage);
        let nextKey, query, promises = [];
        for (let i = 0; i < numberOfPages; i++) {
          nextKey = keys[i * perPage];
          query = pollRef.orderByKey().limitToFirst(perPage).startAt(nextKey);
          promises.push(query.once('value'));
        }

        Promise.all(promises)
          .then(snaps => {
            let pollsPerPage = [];
            snaps.forEach((snap, i) => {
              const polls = snap.val();
              let page = [];
              for (let key in polls) {
                page.push({ key, ...polls[key] });
              }
              pollsPerPage.push(page);
            });
            dispatch({ type: 'GET_POLLS_PER_PAGE_SUCCESS', pollsPerPage });
          });

      })
      .catch(error => 
        console.log(error)
      );
  }
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


export function getUserPolls(uid) {
  return dispatch => {
    dispatch({ type: 'GET_USER_POLLS_REQUEST' });
    pollRef.on('value', snap => {
    let userPolls = [];
      snap.forEach(poll => {
        if (poll.val().author === uid) {
          let userPoll = poll.val();
          userPoll.key = poll.key;
          userPolls.push(userPoll);         
        }
      });
      // sort data by time
      userPolls.sort((a, b) => b.created_At - a.created_At);
      dispatch({ type: 'GET_USER_POLLS_SUCCESS', userPolls });
    });
  }
}
