import React, { Component } from 'react';

import Toggle from 'material-ui/Toggle';
import AutoComplete from 'material-ui/AutoComplete';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import UserAvatar from 'cmp/UserAvatar';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';

let request = require('cmp/request');

class LayoutInner extends Component {
    state = {
        searchSource: [],
        searchText: '',
        authModalOpen: false,
        registerModalOpen: false,
    }

    guessModeToggle = () => {
        this.props.setGuessMode(!this.props.guessMode);
    }

    historyBack = () => {
        window.history.back()
    }

    historyForward = () => {
        window.history.forward()
    }

    _handleUpdateInput = (value) => {
        this.setState({
            searchText: value,
        });
        if (value.length >= 3) {
            request('search', {
                search: value,
            }, (r) => {
                this.setState({
                    searchSource: r.object,
                });
            });
        }
    }

    _handleNewRequest = (chosenRequest, index) => {
        if (chosenRequest && chosenRequest.uri) {
            this.props.Layout.updateContent(chosenRequest.uri);
            this.setState({
                searchText: '',
            });
        }
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

        return (
            <section className="head">
                <div className="head__box">
                    <div className="head__back-next-box">
                        <button className="mdl-button mdl-js-button mdl-button--icon mdl-button--color-text-dark"
                            onClick={this.historyBack}>
                            <i className="material-icons" rel="noindex">keyboard_arrow_left</i>
                        </button>
                        <button className="mdl-button mdl-js-button mdl-button--icon mdl-button--color-text-dark"
                            onClick={this.historyForward}>
                            <i className="material-icons" rel="noindex">keyboard_arrow_right</i>
                        </button>
                    </div>
                    <div>
                        <label htmlFor="search">
                            <button className="mdl-button mdl-js-button mdl-button--icon">
                                <i className="material-icons">search</i>
                            </button>

                            <AutoComplete
                                id="search"
                                hintText="Поиск"
                                searchText={this.state.searchText}
                                dataSource={this.state.searchSource}
                                onUpdateInput={this._handleUpdateInput.bind(this)}
                                onNewRequest={this._handleNewRequest.bind(this)}
                                filter={(searchText, key) => searchText !== ''}
                                open={true}
                                textFieldStyle={{
                                    height: 36,
                                    lineHeight: '14px',
                                    fontSize: 14
                                }}
                                menuProps={{
                                    menuItemStyle: {
                                        fontSize: 13,
                                        minHeight: 'unset',
                                        lineHeight: '30px',
                                    },
                                }}
                            />
                        </label>
                    </div>
                </div>

                <div className="head__box">
                    {this.props.user && this.props.user.id &&
                        <div className="head__switch-box">
                            <Toggle
                                label={"Режим угадывания: " + (this.props.guessMode ? 'Вкл.' : 'Выкл.')}
                                defaultToggled={false}
                                toggled={this.props.guessMode}
                                labelPosition="right"
                                labelStyle={{ color: '#ABABAD' }}
                                onToggle={this.guessModeToggle.bind(this)}
                            />
                        </div>
                    }
                    <div className="head__login-box">
                        <span id="demo-menu-lower-right">
                            {this.props.user && this.props.user.id
                                ?
                                <UserAvatar
                                    user={this.props.user}>
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
                                    <span className="mdl-chip mdl-chip--contact" label="Dialog"
                                        onTouchTap={this._handleAuthOpen.bind(this)}>
                                        <span className="mdl-chip__contact mdl-button mdl-js-button mdl-button--icon">
                                            <i className="material-icons">account_circle</i>
                                        </span>
                                        <span className="mdl-chip__text">Вход</span>
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
                        </span>
                    </div>
                </div>
            </section>
        );
    }
}

function mapStateToProps(state) {
    state = {
        user: state.user.info,
        guessMode: state.audio.guessMode,
    };
    return state;
}

function mapDispatchToProps(dispatch) {
    return {
        setUserInfo: bindActionCreators(Actions.setUserInfo, dispatch),
        setGuessMode: bindActionCreators(Actions.setGuessMode, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutInner);