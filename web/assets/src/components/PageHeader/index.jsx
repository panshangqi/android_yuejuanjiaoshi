
import React, { Component } from 'react';

import qishi from '@components/qishi.jsx';
import './style.less'

class PageHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxwindow: false
        }

    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    render() {
        return (
            <div className="page_head">
                {this.props.children}
            </div>
        );
    }
}

export default PageHeader;
