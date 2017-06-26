import React from 'react';

export default class PlayerMobile extends React.Component {

    render(){
        let track = this.props.track;
        return (
            <section className="player player--mobile">
              <div className="player__wrapper player__wrapper--mobile">
                  <div className="player__box player__box--info" onClick={this.props.toggleActive}>
                      <div className="player__track-info player__track-info--mobile">
                          <div className="player__tarck-image player__tarck-image--mobile">
                              <img src={track.info.coverMini} alt={track.info.title} />
                          </div>
                          <div className="player__track-description player__track-description--small-font">
                              <span className="player__track-name">{track.info.title}</span>
                              <span>{track.info.artist}</span>
                          </div>
                      </div>
                  </div>
                  <div className="player__box player__box--buttons">
                      <div className="player__button-box">
                            {this.props.canPlay
                                ? <button className="mdl-button mdl-js-button button__player button__player--mobile mdl-js-ripple-effect" onClick={this.props.pause}>
                                    <i className="material-icons" rel="noindex">pause</i>
                                  </button>

                                : <button className="mdl-button mdl-js-button button__player button__player--mobile mdl-js-ripple-effect" onClick={this.props.play}>
                                    <i className="material-icons" rel="noindex">play_arrow</i>
                                  </button>
                            }
                          <button className="mdl-button mdl-js-button button__player button__player--mobile mdl-js-ripple-effect" onClick={this.props.next}>
                              <i className="material-icons" rel="noindex">fast_forward</i>
                          </button>
                      </div>
                  </div>
              </div>
            </section>
        )
    }
}
