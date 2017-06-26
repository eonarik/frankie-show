import React, { Component } from 'react';

import RefreshIndicator from 'material-ui/RefreshIndicator';

export default class LoadMask extends Component {
	static defaultProps = {
		show: false,
		position: 'fixed',
	}
	
	render(){
		return (
			<div style={{
				display: this.props.show ? 'flex' : 'none',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0,0,0,.5)',
				position: this.props.position,
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 99,
			}}>
				<RefreshIndicator
				  size={40}
				  top={0}
				  status="loading"
				  style={{
					position: 'unset',
					transform: 'unset',
					top: 'unset',
					left: 'unset',
				  }}
				/>
			</div>
		);
	}
} 