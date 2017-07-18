import { combineReducers } from 'redux';
import user from './reducer_user';
import polls from './reducer_polls';
import singlePoll from './reducer_singlePoll';


export default combineReducers({
  user,
  polls, 
  singlePoll
});
