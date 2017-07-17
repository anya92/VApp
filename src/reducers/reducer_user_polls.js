import { GET_USER_POLLS } from '../constants';

export default (state = [], action) => {
  switch (action.type) {
    case GET_USER_POLLS:
      const { userPolls } = action;
      return userPolls; 
    default:
      return state;  
  }
};
