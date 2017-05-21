import { Component } from 'react';

export default class Root extends Component {
    render() {
        return this.props.children;
    }
}