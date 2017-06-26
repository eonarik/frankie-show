import React, { Component } from 'react';

export default class TextPage extends Component {
	
    render(){
		let page = this.props.page;
		return (
			<div className="lyrics">
				<div className="playlist__header">
					<div className="playlist__background-box" style={{
						
					}}></div>
					<div className="playlist__title-box">
						<h1 className="playlist__title">{page.longtitle || page.pagetitle}</h1>
					</div>
                </div>
				<div className="playlist__box"  dangerouslySetInnerHTML={{__html: page.content}} />
			</div>
		);
	}
}