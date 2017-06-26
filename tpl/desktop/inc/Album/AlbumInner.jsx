import React from 'react';
import AlbumTrack from './AlbumTrack';

import { TEMPLATE_URL } from 'const';

import { spell } from 'cmp/functions';

export default class AlbumInner extends React.Component {
	render(){
		let page = this.props.page;
		let data = page.props.playlists;
		page.title = page.longtitle ? page.longtitle : page.pagetitle;

		var tracksTpl = data.map((item, index) => {
			var active = this.props.track && this.props.track.id == item.id;
			var canPlay = active && this.props.canPlay;
			return (
				<AlbumTrack
					key={item.id}
					index={index}
					active={active}
					canPlay={canPlay}
					item={item}
					guessMode={this.props.Album.props.guessMode}
					togglePlay={this.props.Album.togglePlay.bind(this.props.Album)}
				/>
			);
		});
		
		return (
			<div className="playlist">
                <div className="playlist__header">
                    <div className="playlist__background-box" style={{
						backgroundImage: page.image ? 'url('+  page.image + ')' : '',
					}}></div>
					
					<div className="playlist__title-box">
						<h1 className="playlist__title">
							{page.id == 300 && 
								<button className="mdl-button mdl-js-button mdl-button--icon"
									title="Обновить список"
									onClick={this.props.Layout.updateContent.bind(this.props.Layout, page.uri)}>
									<i className="material-icons">refresh</i>
								</button>
							}&nbsp;
							{page.longtitle || page.pagetitle}
						</h1>
						
						{page.albums.length &&
							<ul className="playlist__albums-list">
								{page.albums.map((item, i) => (
									<li key={i}>
										{item.current
											? <span>{item.pagetitle}</span>
											: <a href={item.uri}>{item.pagetitle}</a>
										}
									</li>
								))}
							</ul>
						}
					</div>
                </div>
                <div className="playlist__box">
                    <div className="playlist__info">
                        <span className="playlist__info-text playlist__info-text--dot">Фрэнки шоу</span>
                        <span className="playlist__info-text playlist__info-text--dot">{page.longtitle || page.pagetitle}</span>
                        <span className="playlist__info-text playlist__info-text--dot">
							{data.length} {spell(['трек', 'трека', 'треков'])(data.length)}
						</span>
                        <span className="playlist__info-text">{page.props.total_duration}</span>
                    </div> 
                    <ul className="playlist__list">
						{tracksTpl}
                    </ul>
                </div>
            </div>
		);
	}
}