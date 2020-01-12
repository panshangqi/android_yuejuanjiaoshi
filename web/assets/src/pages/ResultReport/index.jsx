
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import banyuanbg from '@imgs/banyuanbg.png'
import pen_001 from '@imgs/pen_001.png'
import $ from 'jquery'
import './style.less'

class ResultReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject_list: [],
            exam_name: '--/--',
            class_rank: 0,
            grade_rank: 0,
            student_score: '-1',
            full_score: '-1',
            exam_id: props.location.query ? props.location.query.exam_id : ''
        }

    }
    componentDidMount(){
        //考试科目列表
        var token = qishi.cookies.get_token();
        var userid = qishi.cookies.get_userid();
        console.log('token = ' +token, userid, this.state.exam_id)
        var self = this
        qishi.http.get('GetOneTestscore',[userid, token, this.state.exam_id],function (data) {
            console.log(data)
            if(data.codeid == qishi.config.responseOK){
                if(data.message.length > 0){
                    var exam_info = data.message[0];
                    self.setState({
                        exam_name: exam_info.examname,
                        grade_rank: exam_info.njmc,
                        class_rank: exam_info.bjmc,
                        student_score: exam_info.studentscore,
                        full_score: exam_info.fullscore,
                        subject_list: exam_info.paperscore//data.message[0].paperscore
                    })
                }
            }else{
                qishi.util.alert(data.message)
            }
        })

        $('#subjectlist_body').on('click','.item',function () {
            var subid = $(this).attr('subid')
            console.log(subid)
            self.props.history.push({
                pathname: '/exam_analysis',
                query:{
                    subject_id: subid,
                    exam_id: self.state.exam_id
                }
            })
        })

    }
    renderSubjectList(){
        var arr = []
        for(var i=0; i<this.state.subject_list.length;i+=2){
            var item1 = this.state.subject_list[i]
            var item2 = this.state.subject_list[i+1]
            arr.push(
                <tr  key={'tr'+i}>
                    <td key={i+'a'} subid={item1.subjectid} className="item">
                        <div className="sub_name">{item1.subjectname}</div>
                        <div className="sub_score"><span>{item1.stuscore}</span>/{item1.fullscore}分</div>
                    </td>
                    {
                        i+1 < this.state.subject_list.length ? (
                            <td key={i+'b'} subid={item2.subjectid}  className="item">
                                <div className="sub_name">{item2.subjectname}</div>
                                <div className="sub_score"><span>{item2.stuscore}</span>/{item2.fullscore}分</div>
                            </td>
                        ):(
                            <td key={i+'b'}></td>
                        )
                    }
                </tr>
            )
        }
        return arr;
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    render() {
        return (
            <div className="result_report_html">
                <TitleBar
                    title="成绩报告"
                    BackClick={(function(){
                        this.props.history.push("/home")
                    }).bind(this)}
                />
                <div className="exam_name">{this.state.exam_name}</div>
                <div className="general_panel">
                    <div className="left_kont"></div>
                    <div className="right_kont"></div>
                    <div className="stu_score"><span>{this.state.student_score}</span>/{this.state.full_score}分</div>
                    <table className="table_stu_score">
                        <tbody><tr style={{height: '3.5rem'}}>
                            <td style={{width: '25%',verticalAlign:'bottom'}}>
                                <img src={pen_001} style={{width: '3.3rem'}}/>
                            </td>
                            <td style={{width: '40%',fontSize: '1.3rem',verticalAlign:'top'}} className="theme_color">
                                总成绩
                            </td>
                            <td style={{width: '35%', textAlign:'left', verticalAlign:'bottom'}}>
                                <span>
                                    <div>
                                        <span className="theme_color"> 年级：{this.state.grade_rank}名</span>
                                    </div>
                                    <div>
                                        <span className="theme_color"> 班级：{this.state.class_rank}名</span>
                                    </div>

                            </span></td>
                        </tr></tbody>
                    </table>
                    <table className="table_subject_list">
                        <tbody id="subjectlist_body">
                        {this.renderSubjectList()}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default ResultReport;
