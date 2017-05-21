import React, { Component } from 'react';
import { Helmet } from "react-helmet";
// import './Homepage.scss';
import cls from './test.css';

export default class Homepage extends Component {
    render() {
        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>My Title</title>
                    <link rel="canonical" href="http://mysite.com/example"/>
                </Helmet>

                <div className="b-world">Hello world</div>
            </div>
        );
    }
}