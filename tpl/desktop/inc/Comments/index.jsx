import React, {Component} from 'react';

import CommentsItem from './CommentsItem';

import TextField from 'material-ui/TextField';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from 'app/actions';

const request = require('cmp/request');

class Comments extends Component {
    static defaultProps = {
        comments: [],
    }

    constructor(props) {
        super(props);

        this.state = {
            comments: props.comments,
            textValue: '',
            parentComment: 0,
            editedMode: false,
            editedComment: 0,
        }
    }

    clearEdit = () => {

        this.setState({
            editedMode: false,
            editedComment: 0,
        });
    }

    addComment = () => {

        request('comment/add', {
            text: this.state.textValue,
            resource_id: this.props.resourceId,
            parent: this.state.parentComment,
        }, (r) => {
            let comments = this.state.comments;
            comments.push(r.object);

            this.setState({
                comments: comments,
                textValue: '',
            });
        });
    }

	_handleKeyDown = (event) => {

		if(event.key == 'Enter' && event.ctrlKey){
			this.addComment();
		}
	}

    _handleTextChange = (event) => {
        this.setState({
            textValue: event.target.value,
        });
    }

    render() {
        var commentsList = [];
        for (var i in this.state.comments) {
            let item = this.state.comments[i];
            commentsList.push(
				<CommentsItem
					key={item.id}
					Comments={this}
					editedMode={this.state.editedMode}
					comment={item}
					user={this.props.user}
				/>
			);
        }

        return (
            <div className="comments__wrapper">
                <ul className="comments__list">
                    {commentsList}
                </ul>

                {!this.state.editedMode ?
					this.props.user && this.props.user.id && this.props.user.policies['fs.add_comment']
						?
							<div className="comments__enter-text-box">
								<TextField
									hintText="Ваш комментарий"
									multiLine={true}
									fullWidth={true}
									value={this.state.textValue}
									onChange={this._handleTextChange}
									rows={1}
									underlineStyle={{display: 'none'}}
									textareaStyle={{margin: '3px 0 0'}}
									style={{height: 32}}
									hintStyle={{bottom: 4}}
									className="comments__textarea"
									onKeyDown={this._handleKeyDown}
								/>
								<button
									className="mdl-button mdl-js-button mdl-button--icon mdl-button--colored comments__enter-button"
									type="button"
									onTouchTap={this.addComment}
								><i className="material-icons">send</i>
								</button>
							</div>
						: 
							<h5 className="comments__authorize-title">
								Комментирование доступно только авторизованным пользователям
							</h5>
                : null}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.info,
    }
}

export default connect(mapStateToProps, null)(Comments);
