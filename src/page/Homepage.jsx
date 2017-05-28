import React, { Component } from 'react';
import { Helmet } from "react-helmet";

export default class Homepage extends Component {
    state = {
        qty: 1
    };

    handleClick = e => {
        e.preventDefault();
        this.setState({
            qty: this.state.qty + 1
        });
    };

    render() {
        const { qty } = this.state;

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>My Title</title>
                    <link rel="canonical" href="http://mysite.com/example"/>
                </Helmet>

                <div className="b-world b-button"
                onClick={this.handleClick}>Hello homepage: {qty}</div>
            </div>
        );
    }
}