
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import toback from '@imgs/toback.png'
import './style.less'
import $ from 'jquery'

class TitleBar extends Component {
    constructor(props) {
        super(props);
        //console.log(props)
        this.title = props.title ? props.title : '--/--'
        this.BackClick = props.BackClick
        this.back_ico = (props.back_ico == true || props.back_ico == null) ? true: false;
        this.style = {}
        if(props.backgroundColor){
            this.style.backgroundColor = props.backgroundColor;
        }
        console.log(this.back_ico)

    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    backClick(){
        if(typeof this.BackClick === 'function'){
            this.BackClick();
        }
    }
    getTitleBarHeight(){
        return $('#titlebar_html').height()
    }
    render() {
        return (
            <div className="titlebar_html" style={this.style} id="titlebar_html">
                <img className="titlebar_title_back_img"
                     src={toback}
                     onClick={this.backClick.bind(this)}
                     style={{display: this.back_ico ? 'block': 'none'}}
                />
                <div className="titlebar_title">{this.title}</div>
            </div>
        );
    }
}

export default TitleBar;
