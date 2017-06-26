import React, { Component } from 'react';
import Slider from 'material-ui/Slider';

import * as Modes from 'const/modes';

import { bindActionCreators } from 'redux';
import { connect  } from 'react-redux';
import * as Actions from 'app/actions';

import { rand } from 'cmp/functions';
import { UNKNOWN_TRACK } from 'const';

import { 
	WALKMAN_PLAYED,
	WALKMAN_PAUSED, 
	WALKMAN_NEXT_TRACKED,
	WALKMAN_PREV_TRACKED, 
	SET_CURRENT_PLAYLIST 
} from 'app/actions';

class Player extends Component {
	
	constructor(props){
		super(props);
	
		this.state = {
			mode: Modes.MODE_NORMAL,
			modeNext: Modes.MODE_SHUFFLE,
			modeIcon: 'repeat',
			currentTime: '00:00',
			currentPercent: 0,
		}
	}
	
	static defaultProps = {
		volume: 1,
	}
	
	oldVolume = 1;
	
    interfaceSync(kf){
        var p, time;
        if(typeof kf == 'undefined')
            time = audio.currentTime;
        else {
            time = kf * audio.duration;
            audio.currentTime = time;
        }

        var min = parseInt(time / 60),
            sec = parseInt(time % 60);
        time = (min < 10 ? '0'+ min : min) +':'+ (sec < 10 ? '0'+ sec : sec);

        p = (audio.currentTime / audio.duration) * 100;

        this.setState({
            currentTime: time,
            currentPercent: p,
        });
    }

    nextTrack(next = true){
        let pl = this.props.currentPlaylist;
        for(let i = 0; i < pl.length; i++){
            let track = pl[i];
            if(track.id == this.props.track.id){
                let index = next
                  ? pl[i +1]
                    ? i +1
                    : 0
                  : pl[i -1]
                    ? i -1
                    : pl.length -1

              var mode = this.props.mode;
              switch(mode){
                  case Modes.MODE_SHUFFLE:
                    index = rand(0, pl.length -1, i);
                    break;

                  case Modes.MODE_REPEAT_ONE:
                    index = i;
                    break;

                  default:
              }

                return pl[index];
            }
        }
        return pl[0];
    }

    componentWillReceiveProps(nextProps){
        if(!nextProps.currentPlaylist.length){
            return false;
        }

        if(nextProps.canPlay){
            if(!audio.hasAttribute('src') || audio.track.id != nextProps.track.id){
                audio.setAttribute('src', nextProps.track.info.mp3);
                audio.track = nextProps.track;
            }
            if(!audio.canPlay){
                audio.play();
                audio.timer = setInterval(this.interfaceSync.bind(this), 1000);
            }
        } else {
            clearInterval(audio.timer);
            audio.pause();
        }

        if(nextProps.volume != this.props.volume){
            audio.volume = nextProps.volume;
        }

        switch(nextProps.action){
            case WALKMAN_PREV_TRACKED:
                this.props.play(this.nextTrack(false));
                return false;

            case WALKMAN_NEXT_TRACKED:
                this.props.play(this.nextTrack(true));
                return false;

            default:
        }

        return true;
    }
	
	_handleVolumeChange(e, newValue){
		this.props.setVolume(newValue);
	}
	
	_volumeToggle(){
		if(this.props.volume !== 0){
			this.oldVolume = this.props.volume;
		}
		if(this.props.volume > 0){
			this.props.setVolume(0);
		} else {
			this.props.setVolume(this.oldVolume);
		}
	}
	
	_modesToggle(){
		switch(this.state.modeNext){
			case Modes.MODE_SHUFFLE:
				this.setState({
					mode: Modes.MODE_SHUFFLE,
					modeNext: Modes.MODE_REPEAT_ONE,
					modeIcon: 'shuffle',
				});
				this.props.setMode(Modes.MODE_SHUFFLE);
				break;

			case Modes.MODE_REPEAT_ONE:
				this.setState({
					mode: Modes.MODE_REPEAT_ONE,
					modeNext: Modes.MODE_NORMAL,
					modeIcon: 'repeat_one',
				});
				this.props.setMode(Modes.MODE_REPEAT_ONE);
				break;

			case Modes.MODE_NORMAL:
			default:
				this.setState({
					mode: Modes.MODE_NORMAL,
					modeNext: Modes.MODE_SHUFFLE,
					modeIcon: 'repeat',
				});
				this.props.setMode(Modes.MODE_NORMAL);
				break;
		}
	}
	
	render(){
        let track = this.props.track;
        if(!track || !track.id){
            return null;
        }

        if(track.info){
            track.info.currentTime = this.state.currentTime;
            track.info.currentPercent = this.state.currentPercent;
        }
		
		var volumeIcon = '';
		if(this.props.volume === 1){
			volumeIcon = 'volume_up';
		} else if(this.props.volume > .5) {
			volumeIcon = 'volume_down';
		} else if(this.props.volume > 0) {
			volumeIcon = 'volume_mute';
		} else {
			volumeIcon = 'volume_off';
		}
		
		var modeIcon = this.state.modeIcon;
		
		return (
			<section className="player">
				<div className="player__progress-bar" onClick={(e) => {
					this.interfaceSync(e.clientX / e.target.clientWidth);
				}}>
					<div className="player__progress-violet" style={{
						width: (track.info.currentPercent || 0) + '%',
					}}></div>
					<div className="player__progress-time">
						<span className="player__time player__time--left">{track.info.currentTime}</span>
						<span className="player__time player__time--right">{track.info.duration}</span>
					</div>
				</div>
				
				<div className="player__wrapper">
					<div className="player__box">
						<div className="player__button-box">
							<button className="mdl-button mdl-js-button button__player mdl-js-ripple-effect"
								disabled={
									this.state.mode == Modes.MODE_REPEAT_ONE
									|| this.props.currentPlaylist.length == 1
								}
								onClick={this.props.prev}> 
								<i className="material-icons" rel="noindex">fast_rewind</i>
							</button>
							{this.props.canPlay
								? 
									<button className="mdl-button mdl-js-button button__player button__player--big mdl-js-ripple-effect"
										onClick={this.props.pause}>
										<i className="material-icons" rel="noindex">pause</i>
									</button>
								: 
									<button className="mdl-button mdl-js-button button__player button__player--big mdl-js-ripple-effect"
										onClick={this.props.play}>
										<i className="material-icons" rel="noindex">play_arrow</i>
									</button>
							}
							
							<button className="mdl-button mdl-js-button button__player mdl-js-ripple-effect"
								disabled={
									this.state.mode == Modes.MODE_REPEAT_ONE
									|| this.props.currentPlaylist.length == 1
								}
								onClick={this.props.next}>
								<i className="material-icons" rel="noindex">fast_forward</i>
							</button>
						</div>
						
						<div className="player__track-info">
							<div className="player__tarck-image">
								<img src={track.info.cover} alt={!this.props.guessMode ? track.info.title : UNKNOWN_TRACK} />
							</div>
							<div className="player__track-description">
								<span className="player__track-name">
									{!this.props.guessMode ? track.info.title : UNKNOWN_TRACK}
								</span>
								<span>{track.info.artist}: {track.info.album}</span>
							</div>
						</div>
					</div>
					<div className="player__box">
						<div className="player__button-box">
							<button className="mdl-button mdl-js-button button__player mdl-js-ripple-effect"
								onClick={this._modesToggle.bind(this)}>
								<i className="material-icons" rel="noindex">{modeIcon}</i>
							</button>
							<div className="player__volume-range-wrapper">
								<button className="mdl-button mdl-js-button button__player mdl-js-ripple-effect"
									onClick={this._volumeToggle.bind(this)}>
									<i className="material-icons" rel="noindex">{volumeIcon}</i>
								</button>
								
								<div className="player__volume-range-box">
									<div className="player__volume-range-inner">
										<Slider 
											style={{ height: 100 }}
											axis="y"
											defaultValue={1}
											value={this.props.volume}
											onChange={this._handleVolumeChange.bind(this)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}

function mapStateToProps(state){
    return {
        track: state.audio.track,
        canPlay: state.audio.canPlay,
        volume: state.audio.volume,
        action: state.audio.action,
        mode: state.audio.mode,
        currentPlaylist: state.audio.currentPlaylist,
        guessMode: state.audio.guessMode,
    }
}

function mapDispatchToProps(dispatch){
    return {
        next: bindActionCreators(Actions.next, dispatch),
        prev: bindActionCreators(Actions.prev, dispatch),
        play: bindActionCreators(Actions.play, dispatch),
        pause: bindActionCreators(Actions.pause, dispatch),
        setVolume: bindActionCreators(Actions.setVolume, dispatch),
        setMode: bindActionCreators(Actions.setMode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);