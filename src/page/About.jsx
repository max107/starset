import React, { Component } from 'react';
import { Helmet } from "react-helmet";

export default class About extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>About</title>
                    <link rel="canonical" href="http://mysite.com/example"/>
                </Helmet>

                <div>About</div>
            </div>
        );
    }
}