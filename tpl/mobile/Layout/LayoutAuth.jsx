import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import UserAvatar from 'cmp/UserAvatar';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';

let request = require('cmp/request');

class LayoutAuth extends Component {
    state = {
        authModalOpen: false,
        registerModalOpen: false,
    }

    _handleLogout = () => {
        request('logout', {}, (r) => {
            this.props.setUserInfo({});
        }, (e) => {
            this.props.setUserInfo({});
        });
    }

    _handleAuthOpen = () => {
        this.setState({
            authModalOpen: true,
            registerModalOpen: false,
        });
    };

    _handleAuthClose = () => {
        this.setState({
            authModalOpen: false
        });
    };

    _handleAuthLogin = () => {
        var hasErrors = false;
        for (var key in this.refs) {
            this.refs[key].setState({
                hasError: false,
                errorText: '',
            });
        }
        for (var key in this.refs) {
            if (!this.refs[key].input.value) {
                this.refs[key].setState({
                    hasError: true,
                    errorText: 'Это поле обязательно',
                });
                hasErrors = true;
            }
        }
        if (!hasErrors) {
            request('login', {
                username: this.refs.username.input.value,
                password: this.refs.password.input.value,
            }, (r) => {
                this.setState({
                    authModalOpen: false,
                });
                request('users/get_own_data', {}, (r) => {
                    this.props.setUserInfo(r.object);
                });
            }, (e) => {
                if (e.data && e.data.length) {
                    for (var error of e.data) {
                        this.refs[error.id].setState({
                            hasError: true,
                            errorText: error.msg,
                        });
                    }
                } else {
                    this.refs.username.setState({
                        hasError: true,
                        errorText: e.message,
                    });
                }
            })
        }
    }

    _handleRegisterOpen = () => {
        this.setState({
            registerModalOpen: true,
            authModalOpen: false,
        });
    };

    _handleRegisterClose = () => {
        this.setState({
            registerModalOpen: false
        });
    };

    _handleRegisterLogin = () => {
        var hasErrors = false;
        for (var key in this.refs) {
            this.refs[key].setState({
                hasError: false,
                errorText: '',
            });
        }
        for (var key in this.refs) {
            if (!this.refs[key].input.value) {
                this.refs[key].setState({
                    hasError: true,
                    errorText: 'Это поле обязательно',
                });
                hasErrors = true;
            }
        }
        if (this.refs.password.input.value != this.refs.confirmpassword.input.value) {
            console.log(this.refs.password.input.value, this.refs.confirmpassword.input.value)
            this.refs.password.setState({
                hasError: true,
                errorText: 'Пароли не совпадают!',
            });
            hasErrors = true;
        }
        if (!hasErrors) {
            request('registration', {
                username: this.refs.username.input.value,
                email: this.refs.email.input.value,
                password: this.refs.password.input.value,
            }, (r) => {
                this.setState({
                    registerModalOpen: false,
                });
                request('users/get_own_data', {}, (r) => {
                    this.props.setUserInfo(r.object);
                });
            }, (e) => {
                if (e.data && e.data.length) {
                    for (var error of e.data) {
                        if (this.refs[error.id]) {
                            this.refs[error.id].setState({
                                hasError: true,
                                errorText: error.msg,
                            });
                        }
                    }
                } else {
                    this.refs.email.setState({
                        hasError: true,
                        errorText: e.message,
                    });
                }
            })
        }
    }

    render() {
        const authModalActions = [
            <FlatButton
                key="cancel"
                label="Отмена"
                primary={true}
                onTouchTap={this._handleAuthClose}
            />,
            <FlatButton
                key="submit"
                label="Войти"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._handleAuthLogin}
            />,
        ];
        const registerModalActions = [
            <FlatButton
                key="cancel"
                label="Отмена"
                primary={true}
                onTouchTap={this._handleRegisterClose}
            />,
            <FlatButton
                key="submit"
                label="Регистрация"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this._handleRegisterLogin}
            />,
        ];

        return this.props.user && this.props.user.id
            ?
            <UserAvatar
                user={this.props.user}
                style={{
                    padding: '0 8px',
                }}>
                <span style={{
                    display: 'inline-block',
                    paddingRight: 8,
                }}>
                    {this.props.user.fullname ? this.props.user.fullname : this.props.user.username}
                </span>
                <span className="mdl-button mdl-js-button mdl-button--icon"
                    onTouchTap={this._handleLogout}>
                    <i className="material-icons">exit_to_app</i>
                </span>
            </UserAvatar>
            :
            <div>
                <span
                    onTouchTap={this._handleAuthOpen.bind(this)}
                    className='mdl-button mdl-js-button mdl-js-ripple-effect _head__button'>
                    <i className="material-icons" rel="noindex">person</i>
                </span>

                <Dialog
                    title="Вход в систему"
                    actions={authModalActions}
                    modal={false}
                    open={this.state.authModalOpen}
                    onRequestClose={this._handleAuthClose.bind(this)}
                    contentStyle={{
                        maxWidth: 320
                    }}
                >
                    <TextField
                        ref='username'
                        hintText="Введите логин"
                        floatingLabelText="Логин"
                        fullWidth={true}
                    />
                    <TextField
                        ref='password'
                        hintText="Введите пароль"
                        floatingLabelText="Пароль"
                        type="password"
                        fullWidth={true}
                    />
                    <div className="global__registration-box">
                        <button type="button" className="global__button-registration"
                            onTouchTap={this._handleRegisterOpen}>Регистрация</button>
                        <button type="button" className="global__button-registration">Забыли пароль?</button>
                    </div>
                </Dialog>

                <Dialog
                    title="Вход в систему"
                    actions={registerModalActions}
                    modal={false}
                    open={this.state.registerModalOpen}
                    onRequestClose={this._handleRegisterClose.bind(this)}
                    contentStyle={{
                        maxWidth: 320
                    }}
                >
                    <TextField
                        ref='username'
                        hintText="Введите ваш логин"
                        floatingLabelText="Логин"
                        fullWidth={true}
                    />
                    <TextField
                        ref='email'
                        hintText="Введите E-Mail"
                        floatingLabelText="E-Mail"
                        fullWidth={true}
                    />
                    <TextField
                        ref='password'
                        hintText="Введите пароль"
                        floatingLabelText="Пароль"
                        type="password"
                        fullWidth={true}
                    />
                    <TextField
                        ref='confirmpassword'
                        hintText="Введите пароль еще раз"
                        floatingLabelText="Пароль еще раз"
                        type="password"
                        fullWidth={true}
                    />
                    <div className="global__registration-box">
                        <button type="button" className="global__button-registration"
                            onTouchTap={this._handleAuthOpen}>Вход</button>
                        <button type="button" className="global__button-registration">Забыли пароль?</button>
                    </div>
                </Dialog>
            </div>
    }
}

function mapStateToProps(state) {
    state = {
        user: state.user.info,
    };
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: bindActionCreators(Actions.setUserInfo, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutAuth);