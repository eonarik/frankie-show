import React from 'react';
import AlbumInner from './AlbumInner';

import { bindActionCreators } from 'redux';
import { connect  } from 'react-redux';
import * as Actions from 'app/actions';

import { TEMPLATE_URL } from 'const';

export class Album extends React.Component {

	componentWillMount(){

        /* if(!this.props.currentPlaylist.length){ */
            this.props.setCurrentPlaylist(this.props.page.props.playlists);
        /* } */
	}

	togglePlay(track){
		if(this.props.track && this.props.track.id == track.id){
			if(this.props.canPlay){
				this.props.pause();
			} else {
				this.props.play();
			}
		} else {
			this.props.play(track);
		}
	}

	componentWillReceiveProps(nextProps){
		  if(
			  this.props.canPlay != nextProps.canPlay
			  || nextProps.track && this.props.track && this.props.track.id != nextProps.track.id
		  ){
			  return true;
		  }

		  return false;
	}

	render(){

		return (
			<AlbumInner
				track={this.props.track}
				page={this.props.page}
				playlists={this.props.playlists}
				canPlay={this.props.canPlay}
				Album={this}
				Layout={this.props.Layout}
			/>
		);
	}
}

function mapStateToProps(state){
    return {
        track: state.audio.track,
        canPlay: state.audio.canPlay,
        currentPlaylist: state.audio.currentPlaylist,
        guessMode: state.audio.guessMode,
    }
}

function mapDispatchToProps(dispatch){
    return {
        play: bindActionCreators(Actions.play, dispatch),
        pause: bindActionCreators(Actions.pause, dispatch),
        setCurrentPlaylist: bindActionCreators(Actions.setCurrentPlaylist, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
