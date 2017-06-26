import React from 'react';

import { UNKNOWN_TRACK } from 'const';

export default class AlbumTrack extends React.Component {

    togglePlay(track){
        this.props.togglePlay(track);
    }

    render(){
        let item = this.props.item;

        return (
		  
			<li className={"playlist__item " + (this.props.active ? 'playlist__item--play' : '')}>
				<div className="playlist__track-box">
					<span className="playlist__counter">{this.props.index +1}</span>
					<button className="mdl-button mdl-js-button mdl-button--icon mdl-button--color-text-dark playlist__button"
						onClick={this.togglePlay.bind(this,item)}>
						<i className="material-icons" rel="noindex">
							{this.props.canPlay
								? 'pause'
								: 'play_arrow'
							}
						</i>
					</button>
					<span className="playlist__track-name">
						{!this.props.guessMode ? item.info.title : UNKNOWN_TRACK}
					</span>
				</div>
				<div className="playlist__track-box">
					<div className="playlist__track-menu-box">
						
						<a href={item.uri} className="mdl-button mdl-js-button mdl-button--icon mdl-button--color-text-dark">
							<i className="material-icons" rel="noindex">link</i>
						</a>
					</div>
					<span className="playlist__track-time">{item.info.duration}</span>
				</div>
			</li>
        );
    }
}