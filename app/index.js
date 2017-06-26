import 'material-design-lite';
import 'less/style.less';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import muiTheme from 'cmp/muiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from 'app/reducers';

import LayoutMobile from 'tpl/mobile/Layout';
import LayoutDesktop from 'tpl/desktop/Layout';

import injectTapEventPlugin from 'react-tap-event-plugin';

const store = createStore(reducers);

const MOBILE_RENDER = false;
const device = require("cmp/device");

const SockJS = require('sockjs-client');

injectTapEventPlugin();

/*
	ядро
*/
if (typeof window !== 'undefined') {
    window.LOADING = false;

    // аудио элемент
    window.audio = document.getElementById('audio');
}

var Layout = null;
if (device.mobile() || MOBILE_RENDER) {
    Layout = LayoutMobile;
} else {
    Layout = LayoutDesktop;
}

// запишем параметры текущей страницы
history.replaceState({
    page: window.location.pathname,
    type: "page",
}, document.title, window.location.pathname);

/*
    сокет
*/
var sock = new SockJS('http://localhost:8080/ws');
sock.onopen = function () {
    console.log('open');
    sock.send('test');
};

// sock.onmessage = function (e) {
//     console.log('message', e.data);
//     sock.close();
// };

sock.onclose = function () {
    console.log('close');
};

/*
	Основной лайоут
*/
const App = () => (
    <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        <Provider store={store}>
            <Layout />
        </Provider>
    </MuiThemeProvider>
);

// рендер
ReactDOM.render(
    <App />
    , document.getElementById('root')
);
