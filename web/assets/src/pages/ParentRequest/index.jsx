
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import {Button} from 'antd'
import TitleBar from '@components/TitleBar'
import parent_request_bg from '@imgs/parent_request_bg.png'
import './style.less'

class ResultReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){

    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }
    onClickStart(){

    }
    render() {
        return (
            <div className="register_parents_html">
                <TitleBar
                    title="家长邀请"
                    BackClick={(function(){
                        this.props.history.push("/personal")
                    }).bind(this)}
                />
                <div className="content">
                    <img src={parent_request_bg}/>
                    <div className="start_button">
                        <Button className="btn" type="primary" onClick={this.onClickStart.bind(this)}>开始邀请</Button>
                    </div>
                </div>

            </div>
        );
    }
}

export default ResultReport;
