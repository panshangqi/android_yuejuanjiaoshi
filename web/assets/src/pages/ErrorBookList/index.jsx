
import React, { Component } from 'react';
import {Button, Input } from 'antd'
import './style.less';
import qishi from '@components/qishi'
import login_bg from '@imgs/login_bg.jpg'
import TitleBar from '@components/TitleBar'
import PageFooter from '@components/PageFooter'
import $ from "jquery";

class ErrorBookList extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            error_list: [],
            exam_name: '',
            subjectcode: (props.location.state && props.location.state.subjectcode) || "B964E4FACF962CBD493D1D89DC4044CB"
        };

    }
    componentDidMount(){
        /**
         * answer: "046AD933186DC10EB49BAC6B1A52642CDC1F146BB89B05108983F51CC3270C1D97B8B484BD8A7707AA79047550713950B46DA6CE9BEF067F15E36B5E9547232C5927DD97EF85C41C3B77AC96C934ECD28A7231F24EDD39440732096D9F98240BE7794920BAE25137594B85FF24D42971"
         examname: "天源期末"
         fullscore: 1
         questiondry: "046AD933186DC10EB49BAC6B1A52642CDC1F146BB89B05108983F51CC3270C1D4B1CC846D8A902CB0625F0EF34C01EA958BF09D9744DC29C7E3C7CDF4B59F34C5B7AEE5DD2AC331CC55026E34F2EFB7C"
         questionid: 1
         questionname: "1"
         studentscore: 0
         subjectname: "数学"
         */
        qishi.http.get_ajax(qishi.util.mark_http_url('/ctb/ctb/app/student/getsubjecterrorquestionlist'),{subjectcode: this.state.subjectcode}, (data) => {
            console.log(data)
            if(data.codeid == qishi.config.responseOK){

                this.setState({
                    error_list: data.data,
                    exam_name: data.data.length > 0 ? data.data[0].examname: ''
                })
            }
        })

        let windowH = $(window).height() - this.refs.title_bar.getTitleBarHeight()
        console.log(windowH, this.refs.title_bar.getTitleBarHeight())
        $('#error_content').css({
            height: windowH + 'px'
        })
    }
    itemClick(item){
        console.log(item)
    }
    errorListRender(){
        let arr = []
        let key = 0
        for(let item of this.state.error_list){
            arr.push(
                <div className="item" key={'subject'+key} onClick={this.itemClick.bind(this, item)}>
                    <div className="head_bar">
                        <div className="number">{item.questionid}</div>
                        <div className="score">{item.studentscore}分/{item.fullscore}分</div>
                    </div>
                    <div className="image">
                        <img src={qishi.util.make_image_url2(item.questiondry+'')}/>
                    </div>
                </div>
            )
            key++
        }
        return arr
    }

    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    toBackClick(){

    }
    render() {
        return (
            <div className="error_book_html">
                <TitleBar
                    title="错题列表"
                    BackClick={(function(){
                        this.props.history.push("/book")
                    }).bind(this)}
                    ref="title_bar"
                />
                <div className="content" id="error_content">
                    <div className="exam_name">
                        {this.state.exam_name}
                        <span style={{marginLeft: 15}}/>
                        <span style={{color: '#FF7E7E'}}>{this.state.error_list.length}道错题</span>
                    </div>
                    <div className="question_list">
                        {this.errorListRender()}
                    </div>
                </div>

            </div>
        );
    }
}

export default ErrorBookList;
