import {
	USER_INFO_LOADED
} from '../actions';

var initState = {
}

export default function userReducer(state = initState, action){
    const st = state;
    const defaultOb = {}

    switch(action.type){
      case USER_INFO_LOADED:
        return Object.assign(
          defaultOb,
          st,
          {
            info: action.payload.info
          }
        );

      default:
        return state;
    }
}