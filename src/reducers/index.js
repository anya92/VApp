import { combineReducers } from 'redux';
import user from './reducer_user';
import singlePoll from './reducer_singlePoll';


const pollsPerPage = (state = [], action) => { // TODO move to reducer_polls.js
  switch (action.type) {
    case 'GET_POLLS_PER_PAGE_SUCCESS':
      const { pollsPerPage } = action;
      return pollsPerPage;
    default:
      return state;  
  }
}

const userPolls = (state = [], action) => {
  switch (action.type) {
    case 'GET_USER_POLLS_SUCCESS':
      const { userPolls } = action;
      return userPolls;
    default:
      return state;  
  }
}

export default combineReducers({
  user,
  pollsPerPage,
  userPolls, 
  singlePoll 
});
