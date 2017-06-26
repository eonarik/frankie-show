import { combineReducers } from 'redux';
import layoutReducer from './layoutReducer';
import playerReducer from './playerReducer';
import audioReducer from './audioReducer';
import userReducer from './userReducer';

export default combineReducers({
  layout: layoutReducer,
  player: playerReducer,
  audio: audioReducer,
  user: userReducer,
});
