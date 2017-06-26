import React, { Component } from 'react';

export default class TextPage extends Component {
    render(){
		let page = this.props.page;
		return (
            <div dangerouslySetInnerHTML={{__html: page.content}} />
        );
	}
}