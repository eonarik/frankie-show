import React, { Component } from 'react';

import Checkbox from 'material-ui/Checkbox';
import IconActionFavorite from 'material-ui/svg-icons/action/favorite';
import IconActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';

import * as Modes from 'const/modes';

const request = require('cmp/request');

class Walkman extends Component {

    constructor(props){
        super(props);

        this.state = {
            likes: 0,
            isLike: false,
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({
            likes: nextProps.track.count_likes,
            isLike: nextProps.track.is_like,
        });
    }

    _handleLikeCheck = () => {
        if(this.props.user && this.props.user.id){
            const check = this.state.isLike;

            request('ajax/like', {
                resource_id: this.props.track.id,
                active: !check,
            }, (r) => {
                this.setState({
                    likes: r.object.total,
                    isLike: r.object.active,
                });
            });
        }
    }

    render() {
        if (!this.props.track || !this.props.track.id) {
            return null;
        } else {
            let walkmanActive = this.props.walkmanActive;
            let track = this.props.track;

            var mode = this.props.mode;
            switch (mode) {
                case Modes.MODE_NORMAL:
                    mode = <i className="material-icons" rel="noindex" onClick={this.props.setMode.bind(this, Modes.MODE_SHUFFLE)}>repeat</i>;
                    break;

                case Modes.MODE_SHUFFLE:
                    mode = <i className="material-icons" rel="noindex" onClick={this.props.setMode.bind(this, Modes.MODE_REPEAT_ONE)}>shuffle</i>;
                    break;

                case Modes.MODE_REPEAT_ONE:
                    mode = <i className="material-icons" rel="noindex" onClick={this.props.setMode.bind(this, Modes.MODE_NORMAL)}>repeat_one</i>
                    break;

                default:
            }

            return (

                <section className={'walkman' + (walkmanActive ? ' walkman--active' : '')}>
                    <div className="walkman__background-box">
                        <img src={track.info.cover} alt="" />
                    </div>
                    <div className="walkman__inside">
                        <div className="walkman__content-top">
                            <div className="walkman__head">
                                <div className="walkman__title-box">
                                    <span className="walkman__title">{track.info.title}</span>
                                    <span className="walkman__title-meta">{track.info.artist} - {track.info.album}</span>
                                </div>
                                <div className="walkman__button-box">
                                    <div className="walkman__like-box">
                                        <Checkbox
                                            ref='like'
                                            checkedIcon={<IconActionFavorite />}
                                            uncheckedIcon={<IconActionFavoriteBorder />}
                                            onCheck={this._handleLikeCheck}
                                            checked={this.state.isLike}
                                        />
                                        <span className="walkman__like-counter">{this.state.likes}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="walkman__slide">
                                <div className="walkman__slide-inside">
                                    <div className="walkman__image-box">
                                        <img src={track.info.cover} alt={track.info.title} />
                                    </div>
                                    <div className="walkman__controls">
                                        <a href={track.uri} className="mdl-button mdl-js-button mdl-button--icon walkman__controls-button" data-upgraded=",MaterialButton">
                                            <i className="material-icons" rel="noindex">insert_link</i>
                                        </a>
                                        <button className="mdl-button mdl-js-button mdl-button--icon walkman__controls-button" data-upgraded=",MaterialButton">
                                            {mode}
                                        </button>
                                        <button className="mdl-button mdl-js-button mdl-button--icon walkman__controls-button" data-upgraded=",MaterialButton">
                                            {this.props.volume > 0
                                                ? <i className="material-icons" rel="noindex" onClick={this.props.setVolume.bind(this, 0)}>volume_up</i>
                                                : <i className="material-icons" rel="noindex" onClick={this.props.setVolume.bind(this, 100)}>volume_off</i>
                                            }
                                        </button>
                                        <button className="mdl-button mdl-js-button mdl-button--icon walkman__controls-button" data-upgraded=",MaterialButton">
                                            <i className="material-icons" rel="noindex">share</i>
                                        </button>
                                    </div>
                                </div>
                                <div className="walkman__dot-box">
                                    <span className="walkman__dot"></span>
                                    <span className="walkman__dot walkman__dot--active"></span>
                                    <span className="walkman__dot"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        track: state.audio.track,
        canPlay: state.audio.canPlay,
        volume: state.audio.volume,
        mode: state.audio.mode,
        user: state.user.info,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        play: bindActionCreators(Actions.play, dispatch),
        pause: bindActionCreators(Actions.pause, dispatch),
        setVolume: bindActionCreators(Actions.setVolume, dispatch),
        setMode: bindActionCreators(Actions.setMode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Walkman);
