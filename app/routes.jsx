import React from 'react';
import { Route } from 'react-router';

import LayoutMobile from 'tpl/mobile/Layout';
import LayoutDesktop from 'tpl/desktop/Layout';

const MOBILE_RENDER = false;
const device = require("cmp/device");

var Layout = null;
if (device.mobile() || MOBILE_RENDER) {
    Layout = LayoutMobile;
} else {
    Layout = LayoutDesktop;
}

export default (
    <Route name="app" component={Layout} path="/">
    </Route>
);