import './configure';

import React from 'react';
import { render } from 'react-dom';
import { Router, routerRender } from 'react-easy-router';
import routes from './routes';
import createBrowserHistory from 'history/createBrowserHistory';
import { Helmet } from "react-helmet";
import './scss/app.scss';

if (module.hot) {
    module.hot.accept();
}

if (typeof document !== 'undefined') {
    render((
        <Router history={createBrowserHistory()} routes={routes}/>
    ), document.getElementById('root'));
}

export default ({ url, props, assets }) => {
    const renderServerMarkup = (body, helmet, target = 'root') => {
        // <body ${helmet.bodyAttributes.toString()}>
        return `<!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            <link rel="manifest" href="/manifest.json">
        </head>
        <body class="b-body">
            <link crossorigin="anonymous" href="/app.bundle.css" media="all" rel="stylesheet" />
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="${target}">${body}</div>
            <script type="text/javascript" src="/${assets.app}"></script>
            ${helmet.script.toString()}
        </body>
    </html>`;
    };

    return routerRender.renderToString(url, props, routes, renderServerMarkup);
};
