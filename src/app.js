import './configure';

import React from 'react';
import { render } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { Router, handle, routerRender } from 'router';
import routes from './routes';
import createBrowserHistory from 'history/createBrowserHistory';
import { Helmet } from "react-helmet";

if (module.hot) {
    module.hot.accept();
}

if (typeof document !== 'undefined') {
    render((
        <Router history={createBrowserHistory()} routes={routes}/>
    ), document.getElementById('root'));
}

module.exports = ({ url, props }) => {
    return routerRender.renderToString(url, props, routes);
};
