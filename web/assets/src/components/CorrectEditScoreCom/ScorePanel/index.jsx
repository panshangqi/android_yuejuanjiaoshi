
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import $ from 'jquery'
import './style.less'

import text_back from '@imgs/text_back.png'

class ScorePanelCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stu_score: "0",
            full_score: 0
        }

    }
    componentDidMount(){

    }
    componentWillReceiveProps(props){

    }
    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }
    componentWillUnmount(){
        this.setState = (state,callback)=>{
            return;
        };
    }

    scoreClick(num){
        console.log(num)
        let temp_score = this.state.stu_score

        if(num >=0 && num <=9){
            if(!isNaN(Number(temp_score+'' + num))){
                temp_score = Number(temp_score+'' + num).toString()
            }
            //temp_score += num
        }
        else if(num == '.' && !isNaN(Number(temp_score+'.'))){
            temp_score += num
        }
        else if(num == 'del'){
            temp_score = temp_score.substring(0, temp_score.length - 1)
            if(temp_score.length == 0)
                temp_score = '0'
        }else if(num == 'zero'){
            temp_score = '0'
        }else if(num == 'full'){
            temp_score = this.state.full_score.toString()
        }
        console.log(temp_score)
        if(temp_score.length >= 5){
            temp_score = temp_score.substr(0, 5)
        }
        this.setState({
            stu_score: temp_score
        })
    }
    submitClick(){
        if( Number(this.state.stu_score) - this.state.full_score > 0.0001){
            qishi.util.alert('分数最高为'+this.state.full_score+'分')
        }
    }
    render() {
        return (
            <div className="score_panel_html">
                {/*打分板*/}

                <div className="score_show"><span>{this.state.stu_score}</span>分</div>
                <div className="score_keys">
                    {
                        [0,1,2,3,4,5,6,7,8,9,'.'].map((val)=>{
                            return (
                                <div className="skey" onClick={this.scoreClick.bind(this, val)}>{val}</div>
                            )
                        })
                    }
                    <div className="skey" onClick={this.scoreClick.bind(this, 'del')}><img src={text_back}/></div>
                </div>
                <div className="btns_box">
                    <div className="full_btn" onClick={this.scoreClick.bind(this, 'full')}>满分</div>
                    <div className="zero_btn" onClick={this.scoreClick.bind(this, 'zero')}>错误</div>
                    <div className="submit_btn" onClick={this.submitClick.bind(this)}>提交</div>
                </div>

            </div>
        );
    }
}

export default ScorePanelCom;
