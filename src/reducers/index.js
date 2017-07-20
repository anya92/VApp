import { combineReducers } from 'redux';
import user from './reducer_user';
import polls from './reducer_polls';
import singlePoll from './reducer_singlePoll';

const pages = (state = [], action) => {
  switch (action.type) {
    case 'GET_POLLS_PAGINATION_SUCCESS':
      const { pages } = action;
      return pages;
    default:
      return state;  
  }
}

export default combineReducers({
  user,
  polls, 
  singlePoll, pages
});
