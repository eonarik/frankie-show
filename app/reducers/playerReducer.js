import { PLAYER_CHANGED_CONTENT, PLAYER_PLAYLIST_LOADED } from '../actions';

var initState = {
    content: null,
    playlist: [],
    album_id: 0,
}

export default function playerReducer(state = initState, action){
    var st = state;

    switch(action.type){
        case PLAYER_CHANGED_CONTENT:
            return Object.assign(
                {},
                st,
                {
                    content: action.payload.element
                }
            );

        case PLAYER_PLAYLIST_LOADED:
            return Object.assign(
                {},
                st,
                {
                    playlist: action.payload.playlist,
                    album_id: action.payload.album_id,
                }
            );

        default:
            return state;
    }
}
