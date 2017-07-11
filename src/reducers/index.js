import { combineReducers } from 'redux';
import user from './reducer_user';
import polls from './reducer_polls';

export default combineReducers({
  user,
  polls
});
