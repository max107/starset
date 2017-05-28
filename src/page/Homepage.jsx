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
                    <title>Homepage</title>
                    <link rel="canonical" href="http://starset.studio107.ru"/>
                </Helmet>

                <div className="b-typeset">
                    <p>Пример индексируемого текста</p>
                </div>

                <div className="b-divider b-divider_gray"></div>

                <div className="b-typeset">
                    <p>Пример компонента React</p>
                    <button className="b-world b-button" onClick={this.handleClick}>Click me: {qty}</button>
                    <p>State: {JSON.stringify(this.state)}</p>
                </div>
            </div>
        );
    }
}