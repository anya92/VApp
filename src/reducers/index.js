import { combineReducers } from 'redux';
import user from './reducer_user';
import singlePoll from './reducer_singlePoll';


const pollsPerPage = (state = [], action) => {
  switch (action.type) {
    case 'GET_POLLS_PER_PAGE_SUCCESS':
      const { pollsPerPage } = action;
      return pollsPerPage;
    default:
      return state;  
  }
}

export default combineReducers({
  user,
  pollsPerPage, // TODO change to pollsPerPage
  singlePoll 
});
