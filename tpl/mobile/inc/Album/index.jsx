import React from 'react';

import { bindActionCreators } from 'redux';
import { connect  } from 'react-redux';
import * as Actions from 'app/actions';

import { TEMPLATE_URL } from 'const';

class AlbumTrack extends React.Component {

    togglePlay(track){
        this.props.togglePlay(track);
    }

    render(){
        let item = this.props.item;

        return (
          <li className={"playlist__item playlist__item--mobile playlist__item--walkman" + (!this.props.active || ' playlist__item--play')} onClick={this.togglePlay.bind(this,item)}>
              <div className="playlist__track-box playlist__track-box--nowrap">
                  <span className="playlist__counter">{this.props.index +1}</span>
                  <button className="mdl-button mdl-js-button mdl-button--icon mdl-button--color-text-dark playlist__button">
                    {this.props.canPlay
                      ? <i className="material-icons" rel="noindex">pause</i>
                      : <i className="material-icons" rel="noindex">play_arrow</i>
                    }
                  </button>
                  <div className="playlist__track-name-box">
                      <span className="playlist__track-name playlist__track-name--mobile">{item.info.title}</span>
                      {/*<span className="playlist__track-meta-info">{item.info.artist} - {item.info.album}</span>*/}
                  </div>
              </div>
              <div className="playlist__track-box">
                  <div className="playlist__track-menu-box">
                      <button className="mdl-button mdl-js-button mdl-button--icon mdl-button--color-text-dark">
                          <i className="material-icons" rel="noindex">more_horiz</i>
                      </button>
                  </div>
              </div>
          </li>
        );
    }
}

class Album extends React.Component {

    constructor(props){
        super(props);

        if(!props.currentPlaylist.length){
            props.setCurrentPlaylist(props.page.props.playlists);
        }
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
        const defaultAlbumImage = TEMPLATE_URL +'static/images/mobile-album.jpg';
		const page = this.props.page;
		const data = page.props.playlists;
		let self = this;
		page.title = page.longtitle ? page.longtitle : page.pagetitle;

		var tracksTpl = data.map(function(item, index) {
			var active = self.props.track && self.props.track.id == item.id;
			var canPlay = active && self.props.canPlay;
			return (
				<AlbumTrack
					key={item.id}
					index={index}
					active={active}
					canPlay={canPlay}
					item={item}
					togglePlay={self.togglePlay.bind(self)} />
			);
		});

		return (
		  <section className="_playlist">
			  <div className="_playlist__head">
				  <div className="_playlist__image-background">
					  <img src={page.mini_image || defaultAlbumImage} alt="" />
				  </div>
				  <div className="_playlist__info">
					  <div className="_playlist__image-preview _playlist__image-preview--circle">
						  <img src={page.mini_image || defaultAlbumImage} alt="" />
					  </div>
					  <span className="_playlist__title">{page.title}</span>
				  </div>
			  </div>
			  <ul className="playlist__list playlist__list--mobile">

				{tracksTpl}
			  </ul>
		  </section>
		);
	}
}

function mapStateToProps(state){
    return {
        track: state.audio.track,
        canPlay: state.audio.canPlay,
        currentPlaylist: state.audio.currentPlaylist,
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
