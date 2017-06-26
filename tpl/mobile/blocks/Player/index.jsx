import React from 'react';
import PlayerMobile from './PlayerMobile';
import PlayerWalkman from './PlayerWalkman';

import { bindActionCreators } from 'redux';
import { connect  } from 'react-redux';
import * as Actions from 'app/actions';

import * as Modes from 'const/modes';

import { rand } from 'cmp/functions';

import { 
	WALKMAN_PLAYED,
	WALKMAN_PAUSED, 
	WALKMAN_NEXT_TRACKED,
	WALKMAN_PREV_TRACKED, 
	SET_CURRENT_PLAYLIST 
} from 'app/actions';

class Player extends React.Component {
    state = {
        currentTime: '00:00',
        currentPercent: 0,
    }

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
        return false;
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
            audio.volume = nextProps.volume / 100;
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

    render(){
        let track = this.props.track;
        if(!track || !track.id){
            return null;
        }

        if(track.info){
            track.info.currentTime = this.state.currentTime;
            track.info.currentPercent = this.state.currentPercent;
        }

        var tpl  = this.props.walkmanActive
            ? <PlayerWalkman
                  toggleActive={this.props.toggleActive}
                  play={this.props.play}
                  pause={this.props.pause}
                  next={this.props.next}
                  prev={this.props.prev}
                  canPlay={this.props.canPlay}
                  interfaceSync={this.interfaceSync.bind(this)}
                  track={track} />

            : <PlayerMobile
                  toggleActive={this.props.toggleActive}
                  play={this.props.play}
                  pause={this.props.pause}
                  next={this.props.next}
                  prev={this.props.prev}
                  canPlay={this.props.canPlay}
                  track={track} />

        return tpl;
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
    }
}

function mapDispatchToProps(dispatch){
    return {
        next: bindActionCreators(Actions.next, dispatch),
        prev: bindActionCreators(Actions.prev, dispatch),
        play: bindActionCreators(Actions.play, dispatch),
        pause: bindActionCreators(Actions.pause, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
