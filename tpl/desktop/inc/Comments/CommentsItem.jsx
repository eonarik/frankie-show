import React, {Component} from 'react';

import UserAvatar from 'cmp/UserAvatar';
import TextField from 'material-ui/TextField';

const request = require('cmp/request');
const moment = require('moment');
moment.locale('ru');

export default class CommentsItem extends Component {
	
	static defaultProps = {
		editedMode: false,
		comment: {},
	}

    constructor(props) {
        super(props);

        this.state = {
            textValue: '',
            comment: props.comment,
        }
    }

    commentResponse = () => {
        this.props.Comments.setState({
            textValue: (this.state.comment.author.fullname ? this.state.comment.author.fullname : this.state.comment.author.username) + ', ' + this.props.Comments.state.textValue,
            parentComment: this.state.comment.id,
        });
    }

    commentUpdate = () => {
        this.props.Comments.setState({
            editedMode: true,
            editedComment: this.state.comment.id,
        });
        this.setState({
            textValue: this.state.comment.text,
        });
    }

    commentDeleteToggle = () => {
        request('comment/update', {
            deleted: this.state.comment.deleted ? 0 : 1,
            id: this.state.comment.id,
        }, (r) => {
            this.setState({
                comment: r.object,
            });
        })
    }

    _handleTextChange = (event) => {
        this.setState({
            textValue: event.target.value,
        });
    }

    _handleUpdateComment = () => {
        request('comment/update', {
            id: this.state.comment.id,
            text: this.state.textValue,
        }, (r) => {
            this.setState({
                comment: r.object,
            });
            this.props.Comments.clearEdit();
        })
    }

    _handleCancelComment = () => {
        this.props.Comments.clearEdit();
    }
	
	shouldComponentUpdate(nextProps, nextState){
		if(
			nextState.comment.text != this.state.comment.text
			|| nextState.comment.deleted != this.state.comment.deleted
			|| nextState.comment.editedon != this.state.comment.editedon
			|| nextState.textValue != this.state.textValue
			|| nextProps.editedMode != this.props.editedMode
			|| nextProps.user.id != this.props.user.id
		){
			return true;
		}
		
		return false;
	}

    render() {
        const comment = this.state.comment;
        const globalUser = this.props.user;

        var policies = {};
        if (globalUser && globalUser.id) {
            policies.viewDeleted = globalUser.policies['fs.view_deleted_comments'];
            policies.commentResponse = globalUser.policies['fs.add_comment'];
            policies.commentUpdate = globalUser.policies['fs.view_deleted_comments'] || globalUser.id == comment.createdby;
            policies.commentDelete = globalUser.policies['fs.delete_comment'];
        }

        if (comment.deleted && !policies.viewDeleted) {
            return null;
        }

        return (
            <li id={"comment-" + comment.id} className="comments__item">
                <UserAvatar size={40} user={comment.author} align='flex-start'>
                    <span className="comments__primary-content" style={{
                        height: 'auto',
                        marginTop: -5,
                    }}>
                        <span className="comments__author">
                            {comment.deleted ? <small>[Удалено] &nbsp;</small> : null}
							{comment.author && (comment.author.fullname || comment.author.username)}
                        </span>

                        {comment.edited_user ?
                            <div>
                                <small>
                                    Отредактирован: {comment.edited_user.fullname || comment.edited_user.username}
								</small>
                            </div>
						: null}

                        {this.props.editedMode && this.props.Comments.state.editedComment == comment.id
                            ?
                            <div>
                                <TextField
                                    floatingLabelText="Ваш комментарий"
                                    multiLine={true}
                                    fullWidth={true}
                                    value={this.state.textValue}
                                    onChange={this._handleTextChange}
                                    rows={1}
                                />
                                <button className="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect"
                                        type="button"
                                        onTouchTap={this._handleUpdateComment}
                                >ОК
                                </button>
                                <button className="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect"
                                        type="button"
                                        onTouchTap={this._handleCancelComment}
                                >Отмена
                                </button>
                            </div>
                            :
                            <span className="comments__body">
                                {comment.deleted ? <s>{comment.text}</s> : comment.text}
                            </span>

                        }

                        <span className="comments__date">
                            {moment(comment.createdon * 1000).format('DD MMMM YYYY в HH:mm')}
                        </span>

                        {policies.commentResponse &&
                            <a href={"#comment-" + comment.id} className="comments__answer" onTouchTap={this.commentResponse}>Ответить</a>
                        }
                        <div className="comments__button-box">
                            {policies.commentUpdate &&
                                <a className="mdl-button mdl-js-button mdl-button--icon" href={"#comment-" + comment.id} onTouchTap={this.commentUpdate}>
                                    <i className="material-icons" rel="noindex">mode_edit</i>
                                </a>
                            }
                            {policies.commentDelete &&
                                <a className="mdl-button mdl-js-button mdl-button--icon" href={"#comment-" + comment.id}
                                   onTouchTap={this.commentDeleteToggle}>
                                    {comment.deleted ? <i className="material-icons" rel="noindex">undo</i> : <i className="material-icons" rel="noindex">close</i>}
                                </a>
                            }
                        </div>
                    </span>
                </UserAvatar>
            </li>
        );
    }
}