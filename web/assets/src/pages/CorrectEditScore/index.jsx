
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import './style.less'
import toback_white from '@imgs/toback_white.png'
import $ from "jquery";
class ServicePhone extends Component {
    constructor(props) {
        super(props);
        this.windowWidth = $(window).width()
        this.windowHeight = $(window).height()
        console.log('横屏宽高：'+this.windowWidth, this.windowHeight)
    }
    componentDidMount(){
        //window.addEventListener("YJ_SCREEN_EVENT_LANDSCAPE", this.screenRotate)
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    screenRotate(event){
        console.log('屏幕翻转', event.message)
    }
    backClick(){
        if(qishi.browser.versions.android)
        {
            android.setScreenPortrait()
        }
        this.props.history.push({
            pathname: '/home'
        })

    }
    render() {
        return (
            <div className="correct_edit_score_html">
                <div className="head_bar">
                    <div className="left_box" onClick={this.backClick.bind(this)}>
                        <div><img src={toback_white} width={12}/></div>
                        <span className="que_name">{"第四题"}</span>
                    </div>
                    <div className="right_box">
                        <div className="btn">提交仲裁</div>
                        <div className="btn">阅卷记录</div>
                        <div className="btn">打分版</div>
                        <div className="btn">选题</div>
                    </div>

                </div>
            </div>
        );
    }
}

export default ServicePhone;
