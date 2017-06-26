import React from 'react';

export default class PlayerWalkman extends React.Component {

    render(){
        let track = this.props.track;
        return (
            <section className="player player--walkman">
              <div className="player__progress-bar player__progress-bar--walkman" onClick={(e) => {
                  this.props.interfaceSync(e.clientX / e.target.clientWidth);
              }}>
                  <div className="player__progress-violet" style={{
                      width: (track.info.currentPercent || 0) + '%',
                  }}></div>
                  <div className="player__progress-time">
                      <span className="player__time player__time--walkman player__time--left">{track.info.currentTime}</span>
                      <span className="player__time player__time--walkman player__time--right">{track.info.duration}</span>
                  </div>
              </div>
              <div className="player__wrapper">
                  <div className="player__box player__box--walkman">
                      <div className="player__button-box player__button-box--walkman">
                        <button className="mdl-button mdl-js-button button__player button__player--walkman mdl-js-ripple-effect" onClick={this.props.prev}>
                            <i className="material-icons" rel="noindex">fast_rewind</i>
                        </button>
                        {this.props.canPlay
                            ? <button className="mdl-button mdl-js-button button__player button__player--walkman mdl-js-ripple-effect" onClick={this.props.pause}>
                                <i className="material-icons" rel="noindex">pause</i>
                              </button>

                            : <button className="mdl-button mdl-js-button button__player button__player--walkman mdl-js-ripple-effect" onClick={this.props.play}>
                                <i className="material-icons" rel="noindex">play_arrow</i>
                              </button>
                        }
                        <button className="mdl-button mdl-js-button button__player button__player--walkman mdl-js-ripple-effect" onClick={this.props.next}>
                            <i className="material-icons" rel="noindex">fast_forward</i>
                        </button>
                        <button className="mdl-button mdl-js-button button__player button__player--walkman mdl-js-ripple-effect" onClick={this.props.toggleActive}>
                            <i className="material-icons" rel="noindex">keyboard_arrow_down</i>
                        </button>
                      </div>
                  </div>
              </div>
            </section>
        )
    }
}
