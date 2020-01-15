
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import './style.less'
import toback_white from '@imgs/toback_white.png'
class ServicePhone extends Component {
    constructor(props) {
        super(props);

    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    render() {
        return (
            <div className="correct_edit_score_html">
                <div className="head_bar">
                    <div className="left_box">
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
