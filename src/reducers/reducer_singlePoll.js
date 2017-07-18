// import { GET_ALL_POLLS } from '../constants';


export default (state = [], action) => {
  switch (action.type) {
    case 'GET_SINGLE_POLL':
      const { singlePoll } = action;
      return singlePoll;
    default:
      return state;  
  }
};
