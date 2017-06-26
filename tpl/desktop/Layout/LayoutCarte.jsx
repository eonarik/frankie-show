import React, { Component } from 'react';

export default class LayoutCarte extends Component {
	render(){
		let menu = this.props.menu;
		
		return (
			<div className="carte">
				<div className="carte__top-box">
					<div className="carte__top-box-wrapper">
						<div className="carte__box">
							<span className="carte__title">Медиатека</span>
							
							<Menu menu={menu.main} />
						</div>
						<div className="carte__box">
							<span className="carte__title">Плейлисты</span>
							
							<Menu menu={menu.playlist} />
						</div>
					</div>
				</div>
				<div className="carte__bottom-box">
					<div className="carte__box carte__box--no-margin">
						<ul className="carte__list carte__list--bottom">
						{/*
							<li>
								<a href="javascript:;"><i className="material-icons" rel="noindex">playlist_add</i>Создать плейлист</a>
							</li>
						*/}
							<li>
								<a href="about"><i className="material-icons" rel="noindex">info_outline</i>Info</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

class Menu extends Component {
	render(){
		if(!this.props.menu || !this.props.menu.length){
			return null;
		}
		return (
			<ul className="carte__list">
				{this.props.menu.map((item, i) => (
					<li key={i} className={item.active && ' active'}>
						<a href={item.uri} title={item.pagetitle}>
							<i className="material-icons" rel="noindex">{item.link_attributes}</i>
							{item.menutitle || item.pagetitle}
						</a>
					</li>
				))}
			</ul>
		);
	}
}