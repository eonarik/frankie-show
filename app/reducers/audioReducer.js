import {
    WALKMAN_PLAYED,
    WALKMAN_PAUSED,
    WALKMAN_NEXT_TRACKED,
    WALKMAN_PREV_TRACKED,
    SET_CURRENT_PLAYLIST,
    VOLUME_CHANGED,
    MODE_CHANGED,
	GUESS_MODE_TOGGLED
} from '../actions';

import * as Modes from 'const/modes';

var initState = {
    track: {},
    canPlay: false,
    currentPlaylist: [],
    action: '',
    volume: 1,
    mode: Modes.MODE_NORMAL,
	guessMode: false,
}

export default function playerReducer(state = initState, action){
    const st = state;
    const defaultOb = {}

    switch(action.type){
      case SET_CURRENT_PLAYLIST:
        return Object.assign(
          defaultOb,
          st,
          {
            currentPlaylist: action.payload.playlist,
            action: action.type,
          }
        );

      case WALKMAN_PLAYED:
        return Object.assign(
          defaultOb,
          st,
          {
            track: action.payload.track && action.payload.track.id ? action.payload.track : state.track,
            canPlay: true,
            action: action.type,
          }
        );

      case WALKMAN_PAUSED:
        return Object.assign(
          defaultOb,
          st,
          {
            canPlay: false,
            action: action.type,
          }
        );

      case WALKMAN_PREV_TRACKED:
        return Object.assign(
          defaultOb,
          st,
          {
            canPlay: false,
            action: action.type,
          }
        );

      case WALKMAN_NEXT_TRACKED:
        return Object.assign(
          defaultOb,
          st,
          {
            canPlay: false,
            action: action.type,
          }
        );

      case VOLUME_CHANGED:
        return Object.assign(
          defaultOb,
          st,
          {
            volume: action.payload.volume,
            action: action.type,
          }
        );

      case MODE_CHANGED:
        let mode = action.payload.mode;
        if(!mode){
            let keys = Object.keys(Modes);
            for(let i in keys){
                if(mode == st.mode){
                    mode = Modes[keys[i +1]] ? Modes[keys[i +1]] : Modes[keys[0]]
                }
            }
        }
        return Object.assign(
          defaultOb,
          st,
          {
            mode: mode,
            action: action.type,
          }
        );
		
      case GUESS_MODE_TOGGLED:
        return Object.assign(
          defaultOb,
          st,
          {
            guessMode: action.payload.guessMode,
            action: action.type,
          }
        );

      default:
        return state;
    }
}
