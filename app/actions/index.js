export const WALKMAN_TOGGLED = 'WALKMAN_TOGGLED';
export function walkmanToggle(walkmanActive) {
  return {
    type: WALKMAN_TOGGLED,
    payload: {
      walkmanActive,
    }
  };
}

export const PLAYER_CHANGED_CONTENT = 'PLAYER_CHANGED_CONTENT';
export function setContent(element) {
  return {
    type: PLAYER_CHANGED_CONTENT,
    payload: {
      element
    }
  }
}

export const PLAYER_PLAYLIST_LOADED = 'PLAYER_PLAYLIST_LOADED';
export function setPlaylist(playlist, album_id) {
  return {
    type: PLAYER_PLAYLIST_LOADED,
    payload: {
        album_id,
        playlist,
    }
  }
}

export const WALKMAN_PLAYED = 'WALKMAN_PLAYED';
export function play(track) {
  return {
    type: WALKMAN_PLAYED,
    payload: {
        track
    }
  }
}

export const WALKMAN_PAUSED = 'WALKMAN_PAUSED';
export function pause() {
  return {
    type: WALKMAN_PAUSED,
  }
}

export const WALKMAN_NEXT_TRACKED = 'WALKMAN_NEXT_TRACKED';
export function next() {
  return {
    type: WALKMAN_NEXT_TRACKED,
  }
}

export const WALKMAN_PREV_TRACKED = 'WALKMAN_PREV_TRACKED';
export function prev() {
  return {
    type: WALKMAN_PREV_TRACKED,
  }
}

export const SET_CURRENT_PLAYLIST = 'SET_CURRENT_PLAYLIST';
export function setCurrentPlaylist(playlist) {
  return {
    type: SET_CURRENT_PLAYLIST,
    payload: {
        playlist
    }
  }
}

export const VOLUME_CHANGED = 'VOLUME_CHANGED';
export function setVolume(volume) {
  return {
    type: VOLUME_CHANGED,
    payload: {
        volume
    }
  }
}

export const MODE_CHANGED = 'MODE_CHANGED';
export function setMode(mode) {
  return {
    type: MODE_CHANGED,
    payload: {
        mode
    }
  }
}

export const GUESS_MODE_TOGGLED = 'GUESS_MODE_TOGGLED';
export function setGuessMode(guessMode) {
  return {
    type: GUESS_MODE_TOGGLED,
    payload: {
        guessMode
    }
  }
}

export const LOAD_STARTED = 'LOAD_STARTED';
export function startLoading() {
  return {
    type: LOAD_STARTED,
  }
}

export const LOAD_ENDED = 'LOAD_ENDED';
export function endLoading() {
  return {
    type: LOAD_ENDED,
  }
}

export const MESSAGE_SHOW = 'MESSAGE_SHOW';
export function showMessage(message) {
  return {
    type: MESSAGE_SHOW,
	payload: {
		message
	}
  }
}

export const USER_INFO_LOADED = 'USER_INFO_LOADED';
export function setUserInfo(info) {
  return {
    type: USER_INFO_LOADED,
	payload: {
		info
	}
  }
}
