
import React, { Component } from 'react';
import TitleBar from '@components/TitleBar'
import qishi from '@components/qishi.jsx';
import './style.less'

class QueDetail extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.answerInfo = props.location.query
        this.state = {
            query: this.answerInfo
        }
        console.log('QueDetail:=>')
        console.log(this.answerInfo)
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    dataformat(key){
        return this.answerInfo ? this.answerInfo[key] : '-/-'
    }
    renderStuAnswer(){
        if(this.dataformat('questiontype') == '客观题'){
            return (
                <div className="answer">
                    正确答案是：{this.dataformat('standardanswer')}，
                    我的作答是：{this.dataformat('studentanswer')}
                </div>
            )
        }else if(this.dataformat('questiontype') == '主观题'){
            var imagename = this.dataformat('studentanswer')
            var imagelist = imagename.split(',')
            var arr = []
            var keyid = 0;
            for(var img of imagelist){
                arr.push(
                    <img src={qishi.util.make_image_url(img)} key={keyid+'img_'}/>
                )
                keyid++
            }
            return (
                <div className="answer">
                    {arr}
                </div>
            )
        }
    }
    render() {
        return (
            <div className="que_detail_html">

                <TitleBar
                    title="试题详情"
                    BackClick={(function(){
                        this.props.history.push({
                            pathname: "/exam_analysis",
                            query: this.state.query
                        })
                    }).bind(this)}
                />
                <div className="que_title">
                    <span className="que_num">{this.dataformat('questionname')}</span>
                    <span className="que_score">
                        {this.dataformat('questionstudentscore')}分
                        /
                        {this.dataformat('questionfullscore')}分
                    </span>
                </div>
                <div className="que_answer_box">
                    <h4>考试作答</h4>
                    <div className="cut_line"/>
                    {
                        this.renderStuAnswer()
                    }
                </div>
            </div>
        );
    }
}

export default QueDetail;
