import { WALKMAN_TOGGLED, LOAD_STARTED, LOAD_ENDED, MESSAGE_SHOW } from '../actions'

var initState = {
  walkmanActive: false,
  loading: false,
  alertMessage: '',
}

export default function layoutReducer(state = initState, action){
    var st = state;
	
    switch(action.type){

      case WALKMAN_TOGGLED:
        // return { ...state, walkmanActive: (typeof action.walkmanActive == undefined ? !state.walkmanActive : action.walkmanActive) };
        return Object.assign(
          {},
          st,
          {
            walkmanActive: (typeof action.payload.walkmanActive == undefined
              ? !st.walkmanActive
              : action.payload.walkmanActive
            ),
          },
        );

      case LOAD_STARTED:
        return Object.assign(
          {},
          st,
          {
            loading: true,
          },
        );

      case LOAD_ENDED:
        return Object.assign(
          {},
          st,
          {
            loading: false,
          },
        );

      case MESSAGE_SHOW:
        return Object.assign(
          {},
          st,
          {
            alertMessage: action.payload.message,
          },
        );
		
      default:
        return state;
    }
}
