import React from 'react';

export default class AlbumList extends React.Component {
	render() {
		let page = this.props.page;
		const defaultImage = page.album_default_image;

		var data = page.props.albums;
		var albumsTpl = data.map((item, index) => (
			<div key={item.id} className="mdl-cell mdl-cell--4-col">
				<div className="demo-card-wide mdl-card mdl-shadow--2dp album__card">
					<div className="mdl-card__title album__image-box" style={{
						height: 160,
						overflow: 'hidden',
					}}>
						<img src={item.image || defaultImage} alt={item.pagetitle} />
					</div>
					<div className="mdl-card__actions album__card-actions">
						<a href={item.uri} className="mdl-button mdl-button--color-text-light mdl-js-button mdl-js-ripple-effect">
							The Best {item.menutitle ? item.menutitle : item.pagetitle}
						</a>
					</div>

					{/*
				<div className="mdl-card__menu">
					<button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
						<i className="material-icons">share</i>
					</button>
				</div>
				*/}
				</div>
			</div>
		));

		return (
			<div className="album">
				<div className="mdl-grid">
					{albumsTpl}
				</div>
			</div>
		);
	}
}
