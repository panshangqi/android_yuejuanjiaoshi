
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import PageFooter from '@components/PageFooter'
import { Radio, Tabs } from 'antd';
import {List} from 'react-virtualized';
import $ from 'jquery'
import './style.less'

const { TabPane } = Tabs;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id: 0,
            mark_list: [],
            already_mark_list: [],
            windowWidth: $(window).width(),
            windowHeight: $(window).height(),
            listHeight: $(window).height() - getRealPX(208)
        }
        this.userinfo = {}

        $(window).resize(()=>{

            this.setState({
                windowWidth: $(window).width(),
                windowHeight: $(window).height(),
                listHeight: $(window).height() - getRealPX(208)
            })

        })
    }
    componentDidMount(){

        this.callback()
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    //检查阅卷是否启动
    async checkMarkStatus(subject_id) {
        //GetSubjectstatus
        let res = await qishi.http.getSync("GetSubjectstatus", [subject_id])
        console.log('阅卷状态')
        console.log(res)
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            //qishi.util.alert(res.data.message) //本科目阅卷进程已启动
            return true
        }
        qishi.util.alert(res.data.message) //本科目阅卷进程未启动 or 服务器数据异常
        return false
    }

    onTabsChange(e) {
        let value = e.target.value
        console.log(`radio checked:${value}`);
        this.setState({
            tab_id: value
        })
        if(value == '0'){
            $('#mark_page').show()
            $('#already_mark_page').hide()
            this.callback()
        }else{
            $('#mark_page').hide()
            $('#already_mark_page').show()
            this.AlreadyMarkCallback()
        }
    }
    markListItemClick(item, e){
        console.log(item)
        if(qishi.browser.versions.android){
            android.setScreenLandscape()
        }
        this.props.history.push({
            pathname: '/correct_edit_score',
            state: item
        })
    }
    //正评列表
    markListRender({key, index, style}){

        let que_info = this.state.mark_list[index]
        let taskTotalCount = que_info.grouptaskcount == 0 ? que_info.taskcount : que_info.grouptaskcount;
        let dealWithCount = que_info.teacount;
        let subjectName = this.userinfo.usersubject;
        let questionName = que_info.quename;
        let withoutCount = taskTotalCount - que_info.teacount;
        let item = {
            queid: que_info.queid,
            quename: que_info.quename
        }
        return(
            <div className="list-item-bg" key={key} style={style} onClick={this.markListItemClick.bind(this, item)}>
                <div className="list-item">
                    <div className="item-title">
                        <div className="subject_name">{subjectName}</div>
                        <div className="question_number">{questionName}</div>
                    </div>
                    <div className="item-content">
                        <div className="every-wrap">
                            <span>任务量：</span>
                            <span style={{color: '#FFCC01'}}>{taskTotalCount}</span>
                        </div>
                        <div className="every-wrap">
                            <span>已阅卷量：</span>
                            <span style={{color: '#03A561'}}>{dealWithCount}</span>
                        </div>
                        <div className="every-wrap">
                            <span>待阅卷量：</span>
                            <span style={{color: '#FF0A0A'}}>{withoutCount}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    //回评列表
    alreadyMarkListRender({key, index, style}){
        let data = this.state.already_mark_list[index]
        let quename = data.quename;
        let que_score = data.firstmark;
        let que_time = data.submittime;
        let secretid = data.secretid;
        return (
            <div key={key} style={style} className="already-item">
                <span style={{width: '30%'}}>{quename}</span>
                <span style={{width: '30%'}}>{que_score}</span>
                <span style={{width: '40%'}}>{que_time}</span>
            </div>
        )
    }
    async callback(key){
        console.log('list type: ', key)
        let userinfo = qishi.cookies.get_userinfo()
        this.userinfo = userinfo
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        console.log(userinfo,token, userid)
        let mark_status = await this.checkMarkStatus(userinfo.usersubjectid)
        if(!mark_status) {
            return;
        }
        let res = await qishi.http.getSync("GetWorkprogress",[userid, token, userinfo.usersubjectid])
        console.log('正评列表')
        console.log(res)
        if(!res || res.style == 'ERROR')
            return;
        if(res.data.codeid == qishi.config.responseOK){
            this.setState({
                mark_list: res.data.message
            })
        }else{
            qishi.util.alert(res.data.message)
        }
    }
    //回评列表
    async AlreadyMarkCallback(){
        let userinfo = qishi.cookies.get_userinfo()
        this.userinfo = userinfo
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        console.log(userinfo,token, userid)
        let mark_status = await this.checkMarkStatus(userinfo.usersubjectid)
        console.log(mark_status)
        if(!mark_status) {
            return;
        }
        let res = await qishi.http.getSync("GetAlreadymarklist",[userid, token, userinfo.usersubjectid])
        console.log('回评列表')
        console.log(res)
        if(!res || res.style == 'ERROR')
            return;
        if(res.data.codeid == qishi.config.responseOK){
            this.setState({
                already_mark_list: res.data.message
            })
        }else{
            qishi.util.alert(res.data.message)
        }
    }
    render() {
        return (
            <div className="home_html">
                <div className="tabs_bar">
                    <Radio.Group size="large"
                                 value={this.state.tab_id}
                                 onChange={this.onTabsChange.bind(this)}
                                 buttonStyle="solid"
                                 defaultValue="a">
                        <Radio.Button value={0}>正评列表</Radio.Button>
                        <Radio.Button value={1}>回评列表</Radio.Button>
                    </Radio.Group>
                </div>
                {/*正评页面*/}
                <div className="tabs_nav" id="mark_page">
                    <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}>
                        <TabPane tab="全部" key="1">
                            <div className="table-list">
                                <List
                                    width={this.state.windowWidth}
                                    height={this.state.listHeight}
                                    rowCount={this.state.mark_list.length}
                                    rowHeight={getRealPX(135)}
                                    rowRenderer={this.markListRender.bind(this)}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="阅卷中" key="2">
                            <div className="table-list">
                                <List
                                    width={this.state.windowWidth}
                                    height={this.state.listHeight}
                                    rowCount={this.state.mark_list.length}
                                    rowHeight={getRealPX(135)}
                                    rowRenderer={this.markListRender.bind(this)}
                                />
                            </div>
                        </TabPane>
                    </Tabs>

                </div>
                {/*回评页面*/}
                <div className="table-list" id="already_mark_page">
                    <div className="table-header">
                        <span style={{width: '30%'}}>题号</span>
                        <span style={{width: '30%'}}>分数</span>
                        <span style={{width: '40%'}}>时间</span>
                    </div>
                    <List
                        width={this.state.windowWidth}
                        height={this.state.listHeight}
                        rowCount={this.state.already_mark_list.length}
                        rowHeight={getRealPX(60)}
                        rowRenderer={this.alreadyMarkListRender.bind(this)}
                    />
                </div>

                <PageFooter route="/home" history={this.props.history}/>
            </div>
        );
    }
}

export default Home;
