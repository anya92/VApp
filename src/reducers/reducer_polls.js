import { GET_ALL_POLLS } from '../constants';

export default (state = [], action) => {
  switch (action.type) {
    case GET_ALL_POLLS:
      const { polls } = action;
      return polls;
    default:
      return state;  
  }
};
