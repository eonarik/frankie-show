import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';

export default class UserAvatar extends Component {
    static defaultProps = {
        size: 32,
        user: {
            username: '',
            user_color: '#CCCCCC',
        },
        align: 'center',
        style: {},
    }

    render() {
        const avatarStyle = {
            marginRight: 8,
        };
        const avatarWrapperStyle = Object.assign(this.props.style, {
            display: 'flex',
            alignItems: this.props.align,
            color: '#ABABAD',
        });
        var avatar = null;
        var abbr = '';
        var username = '';
        var userColor = this.props.user.user_color;

        if (this.props.user.fullname) {
            abbr = this.props.user.fullname.split(' ');
            abbr = ((abbr[0] ? abbr[0].substr(0, 1) : '') + (abbr[1] ? abbr[1].substr(0, 1) : '')).toUpperCase();
            username = this.props.user.fullname;
        } else {
            abbr = this.props.user.username.substr(0, 1).toUpperCase();
            username = this.props.user.username;
        }

        if (this.props.user.photo) {
            avatar = (
                <Avatar
                    src={this.props.user.photo}
                    size={this.props.size}
                    style={avatarStyle}
                />
            );
        } else {
            avatar = (
                <Avatar
                    size={this.props.size}
                    style={avatarStyle}
                    backgroundColor={userColor}
                >
                    {abbr}
                </Avatar>
            );
        }

        return (
            <span style={avatarWrapperStyle}>
                {avatar}
                {this.props.children}
            </span>
        );
    }
}