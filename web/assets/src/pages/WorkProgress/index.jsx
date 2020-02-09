
import React, { Component } from 'react';
import {Button, Input, Spin} from 'antd'
import {List} from 'react-virtualized';
import './style.less';
import qishi from '@components/qishi'
import TitleBar from '@components/TitleBar'
import PageFooter from '@components/PageFooter'
import $ from 'jquery'

class WorkProgress extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ques_list: [],
            windowWidth: $(window).width(),
            listHeight: $(window).height() - getRealPX(100),
            show_loading: false
        };

        this.userinfo = {}
        $(window).resize(()=>{
            this.setState({
                windowWidth: $(window).width(),
                listHeight: $(window).height() - getRealPX(100)
            })
        })
    }
    componentDidMount(){
        this.updateWorkProgress()
    }
    async updateWorkProgress(){
        this.setState({
            show_loading: true
        })
        let userinfo = qishi.cookies.get_userinfo()
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let res = await qishi.http.getSync("GetWorkprogress", [userid, token, userinfo.usersubjectid])
        console.log('阅卷进度')
        console.log(res)
        this.setState({
            show_loading: false
        })
        this.userinfo = userinfo
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
            return
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            //qishi.util.alert(res.data.message) //本科目阅卷进程已启动
            this.setState({
                ques_list: res.data.message
            })
        }

    }
    subjectClick(item){

    }
    quesListRender({key, index, style}){

        let data = this.state.ques_list[index]
        let taskTotalCount = data.grouptaskcount == 0 ? data.taskcount : data.grouptaskcount;
        let subjectName = this.userinfo.usersubject;
        let questionName = data.quename;
        let dealWithCount = data.teacount;
        let reat = data.reat;
        return (
            <div key={key} style={style} className="ques-item">
                <div className="box">
                    <div className="row1">
                        <div className="subjectname">
                            {subjectName}
                        </div>
                        <div className="quename">
                            {questionName}
                        </div>
                    </div>
                    <div className="row2">
                        <div className="total">
                            任务量：<span>{taskTotalCount}</span>
                        </div>
                        <div className="deal">
                            已阅卷量：<span>{dealWithCount}</span>
                        </div>
                        <div className="rate">
                            完成量：<span>{reat}%</span>
                        </div>
                    </div>
                    <div className="row3">
                        <div className="progress_title">阅卷进度：</div>
                        <div className="progress_box">
                            <div className="progress_bar" style={{width: '50%'}}></div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="progress_html">
                <TitleBar
                    title="进度查询"
                    back_ico={false}
                />
                <div className="content">
                    <List
                        width={this.state.windowWidth}
                        height={this.state.listHeight}
                        rowCount={this.state.ques_list.length}
                        rowHeight={getRealPX(145)}
                        rowRenderer={this.quesListRender.bind(this)}
                    />
                </div>
                <PageFooter route="/work_progress" history={this.props.history}/>
                <div className="loading_gif" style={{display: this.state.show_loading ? 'block': 'none'}}>
                    <Spin size="large"/>
                </div>
            </div>
        );
    }
}

export default WorkProgress;
