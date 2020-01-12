
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import './style.less';

class Header extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className="page_base_html">
                {this.props.children}
            </div>
        );
    }
}
export default Header;
