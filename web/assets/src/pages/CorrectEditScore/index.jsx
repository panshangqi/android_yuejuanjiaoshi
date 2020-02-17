
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import {Scrollbars} from 'react-custom-scrollbars'
import LabelSideBar from '@components/CorrectEditScoreCom/LabelSideBar'
import HeadMenuBar from '@components/CorrectEditScoreCom/HeadMenuBar'
import ScorePanel from '@components/CorrectEditScoreCom/ScorePanel'
import './style.less'
import $ from "jquery";
import {List} from "react-virtualized";

import toback_white from '@imgs/toback_white.png'
import MyCanvas from './my_canvas'

class ServicePhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image_url: null,
            ques_list: [],
            score_points_list: [],
            already_mark_list: [],
            canvas_height: 0,
            canvas_width: 0,
            contentHeight: $(window).height() - getRealPX(26)
        }
        this.windowWidth = $(window).width()
        console.log(props)
        this.url_params = qishi.util.get_search_params(props.location.search)
        console.log(this.url_params)
        this.selected_queid = this.url_params.queid
        $(window).resize(()=>{
            this.setState({
                contentHeight: $(window).height() - getRealPX(26)
            })
        })
    }
    componentDidMount(){
        this.getExamTaskQuesInfo()
        this.getNextTask(this.selected_queid)
        this.getAleadyMarkList()

        this.myCanvas = new MyCanvas('main_canvas', 'main_box')
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    //获取下一个批改任务
    async getNextTask(selectedQueid){
        let userinfo = qishi.cookies.get_userinfo()
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let queid = selectedQueid;
        console.log(userid, token, userinfo.usersubjectid, queid)
        let res = await qishi.http.getSync("GetExamtaskinfo", [userid, token, userinfo.usersubjectid, queid])
        console.log('批改任务详情')
        console.log(res)
        this.userinfo = userinfo
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            let examInfo = res.data.message && res.data.message.length > 0 ? res.data.message[0]: {}
            console.log(qishi.util.make_image_url(examInfo.imgurl))
            this.setState({
                image_url: qishi.util.make_image_url(examInfo.imgurl)
            })
            return true
        }
    }
    //获取该科目所有题目结构信息，包括总分，给分点，以及小问信息
    async getExamTaskQuesInfo(){
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let userinfo = qishi.cookies.get_userinfo()
        let res = await qishi.http.getSync("GetUsertaskqueinfo", [userid, token, userinfo.usersubjectid])
        console.log('获取所有可批阅的题目，包括给分点，以及小问信息')
        console.log(res)

        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            //如果题目没有小问
            let score_points_list = []
            for(let que of res.data.message){
                if(que.queid == this.selected_queid){
                    score_points_list = que.scorepoints.split(',')
                    console.log(score_points_list)
                    break
                }
            }
            this.setState({
                ques_list: res.data.message,
                score_points_list
            })

            return true
        }
    }
    //获取已评列表
    async getAleadyMarkList(){
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let userinfo = qishi.cookies.get_userinfo()
        let res = await qishi.http.getSync("GetAlreadymarklist", [userid, token, userinfo.usersubjectid])
        console.log('获取已评列表')
        console.log(res)
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            this.setState({
                already_mark_list: res.data.message
            })
        }
    }
    onImgLoad(){
        let imgW = $('#main_image').width();
        let imgH = $('#main_image').height();

        console.log('图片加载完成', imgW, imgH)
        // $('#main_canvas').css({
        //     width: imgW + 'px',
        //     height: imgH + 'px'
        // })
        this.myCanvas.setWH(imgW, imgH)
    }
    screenRotate(event){
        console.log('屏幕翻转', event.message)
    }
    backClick(){
        if(qishi.browser.versions.android)
        {
            android.setScreenPortrait()
        }
        window.location.href = '#/home'
    }
    onLabelClick(res, event){
        console.log(res)
        if(res.type == 'pen') {
            if(res.active) {
                this.myCanvas.drawLine()
                console.log('开始自由画笔')
            }
            else {
                this.myCanvas.cancelDrawLine()
                console.log('停止自由画笔')
            }
        }
        else if(res.type == 'dui'){
            if(res.active)
                this.myCanvas.drawDui()
            else
                this.myCanvas.cancelDrawDui()
        }
        else if(res.type == 'bandui'){
            if(res.active)
                this.myCanvas.drawBandui()
            else
                this.myCanvas.cancelDrawBandui()
        }
        else if(res.type == 'wrong'){
            if(res.active)
                this.myCanvas.drawWrong()
            else
                this.myCanvas.cancelDrawWrong()
        }
    }
    onMenuClick(item){
        console.log(item)
        if(item.active){
            $('#op_panel').find('.panel_bg').hide()
            $('#op_panel').find('.panel_'+item.type).show()
        }else{
            $('#op_panel').find('.panel_'+item.type).hide()
        }

    }
    //自定义面板打分
    scoreClick(num){
        console.log(num)
    }
    render() {
        return (
            <div className="correct_edit_score_html">
                <div className="head_bar">
                    <div className="left_box" onClick={this.backClick.bind(this)}>
                        <div><img src={toback_white} width={12}/></div>
                        <span className="que_name">{"第四题"}</span>
                    </div>
                    <div className="right_box" id="menu_list">
                        <HeadMenuBar onMenuClick={this.onMenuClick.bind(this)}/>
                    </div>
                </div>
                <div className="content">
                    <div className="left">
                        <div><LabelSideBar onLabelClick={this.onLabelClick.bind(this)}/></div>
                    </div>
                    <div className="mid" id="main_box" style={{height: this.state.contentHeight}}>

                            <img src={this.state.image_url} id="main_image" onLoad={this.onImgLoad.bind(this)}/>
                            <canvas id="main_canvas" className="main_canvas"></canvas>
                    </div>
                    <div className="right" id="op_panel">
                        <div>
                            <div className="score_potions_list" style={{
                                height: this.state.contentHeight
                            }}>
                                <List
                                    width={getRealPX(60)}
                                    height={this.state.contentHeight}
                                    rowCount={this.state.score_points_list.length}
                                    rowHeight={getRealPX(22)}
                                    rowRenderer={({key, index, style})=>{
                                        let score = this.state.score_points_list[index]
                                        return (
                                            <div className="item-wrap" style={style} key={key}>
                                                <div className="item">
                                                    {score}
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className="ques_list panel_1 panel_bg" style={{height: this.state.contentHeight}}>
                        </div>
                        <div className="record_list panel_2 panel_bg" style={{height: this.state.contentHeight}}>
                            <div className="item-wrap head-wrap">
                                <span>序号</span>
                                <span>评分</span>
                            </div>
                            <List
                                width={getRealPX(60)}
                                height={this.state.contentHeight}
                                rowCount={this.state.already_mark_list.length}
                                rowHeight={getRealPX(22)}
                                rowRenderer={({key, index, style})=>{
                                    let data = this.state.already_mark_list[index]
                                    let params = {
                                        order: index+1,
                                        score: data.firstmark,
                                        secretid: data.secretid,
                                        quename: data.quename
                                    }
                                    return (
                                        <div className="item-wrap" style={style} key={key}>
                                            <span>{params.order}</span>
                                            <span style={{color:'#f00'}}>{params.score}</span>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        <div className="ques_list panel_3 panel_bg" style={{height: this.state.contentHeight}}>
                            <ScorePanel/>
                        </div>
                        <div className="ques_list panel_4 panel_bg" style={{height: this.state.contentHeight}}>
                            <List
                                width={getRealPX(60)}
                                height={this.state.contentHeight}
                                rowCount={this.state.ques_list.length}
                                rowHeight={getRealPX(25)}
                                rowRenderer={({key, index, style})=>{
                                    let data = this.state.ques_list[index]
                                    let quename = data.quename
                                    let queid = data.queid
                                    quename = quename.replace("第","")
                                    quename = quename.replace("题","")
                                    return (
                                        <div className="item-wrap" style={style} key={key}>
                                            <div className="item" style={{color: queid == this.url_params.queid ? '#f00': '#333'}}>
                                                {quename}
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default ServicePhone;
