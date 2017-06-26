import React, { Component } from 'react';

export default class LayoutInner extends Component {
	render() {
		return (
			<div className="mdl-layout mdl-js-layout mdl-layout--fixed-header global__wrapper-flex">
				{this.props.children}

				<div id="toast" className="mdl-js-snackbar mdl-snackbar">
					<div className="mdl-snackbar__text"></div>
					<button className="mdl-snackbar__action" type="button"></button>
				</div>
			</div>
		);
	} 
}