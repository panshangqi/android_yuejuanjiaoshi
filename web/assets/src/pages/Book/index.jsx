
import React, { Component } from 'react';
import {Button, Input } from 'antd'
import './style.less';
import qishi from '@components/qishi'
import login_bg from '@imgs/login_bg.jpg'
import TitleBar from '@components/TitleBar'
import PageFooter from '@components/PageFooter'

function getNameFirst(name){
    if(typeof name != 'string')
        return "NO"
    if(name.length == 0)
        return "NOO"
    return name.substring(0, 1)
}
let SubjectKeys = {
    '其他':'subject_000',
    '语文':'subject_001',
    '数学':'subject_002',
    '英语':'subject_003',
    '物理':'subject_004',
    '化学':'subject_005',
    '生物':'subject_006',
    '政治':'subject_007',
    '地理':'subject_008',
    '历史':'subject_009',
    '科品':'subject_010',
}
let SubjectIndex = {
    '其他':'0',
    '语文':'1',
    '数学':'2',
    '英语':'3',
    '物理':'4',
    '化学':'5',
    '生物':'6',
    '政治':'7',
    '地理':'8',
    '历史':'9',
    '科品':'10',
}
let SubjectMap = {
    '语文':true,
    '数学':true,
    '英语':true,
    '物理':true,
    '化学':true,
    '生物':true,
    '政治':true,
    '地理':true,
    '历史':true,
    '科品':true,
}
const tickets = Object.values(SubjectKeys).map(item => require("../../imgs/" + item + ".png"));
//console.log(tickets)

function checkSubject(name){
    if(SubjectMap[name]){
        return tickets[SubjectIndex[name]]
    }else{
        return tickets[SubjectIndex['其他']]
    }
}

class Book extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subject_list: []
        };

    }
    componentDidMount(){
        qishi.http.get_ajax(qishi.util.mark_http_url('/ctb/ctb/app/student/getallsubjectlist'),{}, (data) => {
            console.log(data)
            if(data.codeid == qishi.config.responseOK){

                this.setState({
                    subject_list: data.data  //[0: {errorquestioncount: 10, subjectcode: "B964E4FACF962CBD493D1D89DC4044CB", subjectname: "数学"}]
                })
            }
        })
    }
    subjectClick(item){
        console.log(item)
        this.props.history.push({
            pathname: "/error_book_list",
            state: {
                subjectcode: item.subjectcode
            }
        })
    }
    subjectListRender(){
        let arr = []
        let key = 0
        for(let sub of this.state.subject_list){
            arr.push(
                <div className="item" key={'subject'+key} onClick={this.subjectClick.bind(this, sub)}>
                    <img src={checkSubject(sub.subjectname)}/>
                    <div className="info">
                        <div className="name">{sub.subjectname}</div>
                        <div className="tip">{sub.errorquestioncount}道错题</div>
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

    render() {
        return (
            <div className="book_html">
                <TitleBar
                    title="错题本"
                    back_ico={false}
                />
                <div className="content">
                    <div className="subject_list">
                        {this.subjectListRender()}
                    </div>
                </div>
                <PageFooter route="/book" history={this.props.history}/>
            </div>
        );
    }
}

export default Book;
