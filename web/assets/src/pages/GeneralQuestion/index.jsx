
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import './style.less'

class GeneralQuestion extends Component {
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
            <div className="general_ques_html">
                <TitleBar
                    title="常见问题"
                    BackClick={(function(){
                        this.props.history.push("/personal")
                    }).bind(this)}
                />
                <div className="content">
                    暂无内容
                </div>
            </div>
        );
    }
}

export default GeneralQuestion;
