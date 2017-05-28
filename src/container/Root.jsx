import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-easy-router';

export default class Root extends Component {
    render() {
        return (
            <div className="b-wrapper b-wrapper_left b-site">
                <Helmet titleTemplate="%s - Starset"/>
                <div className="b-row">
                    <div className="b-col b-col_small_4">
                        <div className="b-header">
                            <div className="b-logo">Starset</div>
                        </div>
                    </div>
                    <div className="b-col b-col_small_8">
                        <div className="b-menu">
                            <Link className="b-menu__link" to="Homepage">Home</Link>
                            <Link className="b-menu__link" to="About">About</Link>
                        </div>
                    </div>
                    <div className="b-col b-col_small_12">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}