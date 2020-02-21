
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import {Spin, message} from "antd";
import LabelSideBar from '@components/CorrectEditScoreCom/LabelSideBar'
import HeadMenuBar from '@components/CorrectEditScoreCom/HeadMenuBar'
import ScorePanel from '@components/CorrectEditScoreCom/ScorePanel'
import ConfirmDlg from '@components/CorrectEditScoreCom/ConfirmDlg'
import './style.less'
import $ from "jquery";
import {List} from "react-virtualized";

import toback_white from '@imgs/toback_white.png'
import MyCanvas from './my_canvas'


class ServicePhone extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            image_url: null,
            test_url: null,
            ques_list: [],
            score_points_list: [],
            already_mark_list: [],
            canvas_height: 0,
            canvas_width: 0,
            show_loading: false,
            contentHeight: $(window).height() - getRealPX(26)
        }
        this.windowWidth = $(window).width()
        this.url_params = qishi.util.get_search_params(props.location.search)
        console.log(this.url_params)

        $(window).resize(()=>{
            this.setState({
                contentHeight: $(window).height() - getRealPX(26)
            })
        })
        this.markScoreJson = {}
    }
    componentDidMount(){
        this.init()
    }
    async init(){
        this.myCanvas = new MyCanvas('main_canvas', 'main_box')
        this.mark_type = this.url_params.type  //正评 0  回评 1
        if(this.mark_type == '0'){
            this.selected_queid = this.url_params.queid
            await this.getNextTask(this.selected_queid)
        }
        else{
            this.refs.head_menu_bar.setMenuItemsHide([0,1,1,0])
            this.selected_secretid = this.url_params.secretid
            await this.getAlreadyMarkBySecretidFromService()
        }
        await this.getExamTaskQuesInfo() //获取此次考试 每道题的详情，以及给分情况
        await this.getMarkRecordList() //阅卷记录

    }
    componentWillReceiveProps(nextProps){
        console.log('=================================================')
        console.log(nextProps)
        this.url_params = qishi.util.get_search_params(nextProps.location.search)
        console.log(this.url_params)
        this.init()
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
        this.setState({
            show_loading: true
        })
        console.log(userid, token, userinfo.usersubjectid, queid)
        let res = await qishi.http.getSync("GetExamtaskinfo", [userid, token, userinfo.usersubjectid, queid])
        console.log('批改任务详情')
        console.log(res)
        this.userinfo = userinfo
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
        }
        else if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            let examInfo = res.data.message && res.data.message.length > 0 ? res.data.message[0]: {}
            //console.log(qishi.util.make_image_url(examInfo.imgurl))
            this.setState({
                image_url: qishi.util.make_image_url(examInfo.imgurl)
            })
            this.markScoreJson.subjectid = userinfo.usersubjectid;
            this.markScoreJson.flag_send = examInfo.flag_send;
            this.markScoreJson.examid = examInfo.examid;
            this.markScoreJson.secretid = examInfo.secretid;
            this.markScoreJson.queid =  this.selected_queid;
            this.markScoreJson.startTime = new Date().getTime();
            this.markScoreJson.signid = "0";
            this.markScoreJson.comment = "";
            this.markScoreJson.commentimage = ""; //没有标注过则为空
            this.markScoreJson.invalidscore = ""
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
                    //console.log(score_points_list)
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
    async getMarkRecordList(){
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
    //提交分数 params: score总分， smallscore：小题分(各小题分用逗号隔开)
    async submitMarkingScore(totalscore, smallscore) {
        this.markScoreJson.endTime = new Date().getTime();
        this.markScoreJson.usedtime = (this.markScoreJson.endTime - this.markScoreJson.startTime).toString()
        this.markScoreJson.score = totalscore;
        this.markScoreJson.smallscore = smallscore;
        if(this.myCanvas.checkIsEdit() == true){
            let base64str = this.myCanvas.canvas.toDataURL("image/png")
            base64str = base64str.replace("data:image/png;base64,", "")
            this.markScoreJson.commentimage = base64str
        }else{
            this.markScoreJson.commentimage = ""
        }
        //console.log(this.markScoreJson)
        let finalMarkScoreJson = JSON.parse(JSON.stringify(this.markScoreJson))
        delete finalMarkScoreJson.startTime
        delete finalMarkScoreJson.endTime
        console.log(finalMarkScoreJson)

        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let scoreJsonString = JSON.stringify(finalMarkScoreJson)

        let res = await qishi.http.getSync("SaveNormalScore", [userid, token, scoreJsonString])
        console.log('提交分数')
        console.log(res)

        if (!res || res.type == 'ERROR') {
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {
            if(this.mark_type == '1')  //回评
            {
                this.refs.confirm_dlg.showModal(()=>{
                    this.backClick()
                })
            }
            else{
                window.location.href = `#/correct_edit_score?queid=${this.url_params.queid}&quename=${this.url_params.quename}&type=0&t=${new Date().getTime()}`
                console.log('继续批改下一题')
            }
        }
    }
    async submitArbitrate(){

        let finalAbtJson = {
            subjectid: this.markScoreJson.subjectid,
            secretid: this.markScoreJson.secretid,
            examid: this.markScoreJson.examid,
            queid: this.markScoreJson.queid
        }
        console.log(finalAbtJson)

        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let subJsonString = JSON.stringify(finalAbtJson)
        let res = await qishi.http.getSync("Savearbitrate", [userid, token, subJsonString])
        console.log('提交仲裁')
        console.log(res)
        if (!res || res.type == 'ERROR') {
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK){
            window.location.href = `#/correct_edit_score?queid=${this.url_params.queid}&quename=${this.url_params.quename}&type=0&t=${new Date().getTime()}`
            console.log('继续批改下一题')
            qishi.util.alert("提交成功")
        }
    }
    //获取已评信息
    async getAlreadyMarkBySecretidFromService(){
        let userinfo = qishi.cookies.get_userinfo()
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        let secretid = this.selected_secretid;
        console.log(userid, token, userinfo.usersubjectid, secretid)
        let res = await qishi.http.getSync("GetAlreadmarkinfo", [userid, token, userinfo.usersubjectid, secretid])
        console.log('获取已评信息')
        console.log(res)
        this.userinfo = userinfo
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误")
            return false
        }
        if (res.type == 'AJAX' && res.data.codeid == qishi.config.responseOK) {

            let info = res.data.message && res.data.message.length > 0 ? res.data.message[0]: {}
            this.markScoreJson.subjectid = userinfo.usersubjectid;
            this.markScoreJson.flag_send = info.flag_send;
            this.markScoreJson.examid = info.examid;
            this.markScoreJson.secretid = info.secretid;
            this.markScoreJson.queid =  info.queid;
            this.markScoreJson.startTime = new Date().getTime();
            this.markScoreJson.signid = "0";
            this.markScoreJson.comment = "";
            this.markScoreJson.commentimage = info.commentimage; //显示已有标注过则为空
            this.markScoreJson.invalidscore = info.firstmark;
            this.markScoreJson.firstsmallmark = info.firstsmallmark;
            this.markScoreJson.firstmark = info.firstmark;
            this.selected_queid = info.queid
            this.setState({
                image_url: qishi.util.make_image_url(info.imgurl) //
            })

        }
    }
    onImgLoad(){
        let imgW = $('#main_image').width();
        let imgH = $('#main_image').height();

        console.log('图片加载完成', imgW, imgH)

        this.myCanvas.setWH(imgW, imgH)
        //加载标注图层
        if(this.mark_type == '1'){
            let image = new Image()
            image.src = `data:image/png;base64,${this.markScoreJson.commentimage}`//
            image.onload = () => {
                this.myCanvas.ctx.drawImage(image, 0, 0);
            }
        }
        setTimeout(()=>{
            this.setState({
                show_loading: false
            })
        },200)
    }
    screenRotate(event){
        console.log('屏幕翻转', event.message)
    }
    backClick(){
        let url = "#/home?type=" + this.mark_type
        if(window.yuejuanteacher)
        {
            $(window).resize(()=>{
                window.location.href = url
            })
            android.setScreenPortrait()
        }
        else{
            window.location.href = url
        }
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
        }else if(res.type == 'delete' && res.active){
            this.refs.cancel_confirm_dlg.showModal((name)=>{
                if(name == 'ok'){
                    this.myCanvas.cleanCanvas()
                }
            })
        }
    }
    onMenuClick(item){
        console.log(item)

        if(item.type == '1'){
            this.refs.submit_zhongcai_dlg.showModal((name)=>{

                console.log(name)
                if(name == 'ok'){
                    this.submitArbitrate()
                }
            })

        }else{
            if(item.active){
                $('#op_panel').find('.panel_bg').hide()
                $('#op_panel').find('.panel_'+item.type).show()
            }else{
                $('#op_panel').find('.panel_'+item.type).hide()
            }
        }
    }
    //自定义面板打分
    scoreClick(num){
        console.log(num)
    }
    onSubmitScoreClick(score, e){
        this.submitMarkingScore(score,"")
    }
    onChangeQueIDClick(item){
        window.location.href = `#/correct_edit_score?queid=${item.queid}&quename=${item.quename}&type=0&t=${new Date().getTime()}`
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
                        <HeadMenuBar onMenuClick={this.onMenuClick.bind(this)} ref="head_menu_bar"/>
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
                                                <div className="item" onClick={this.onSubmitScoreClick.bind(this, score)}>
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
                                height={this.state.contentHeight - getRealPX(22)}
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
                                            <div className="item"
                                                 style={{color: queid == this.url_params.queid ? '#f00': '#333'}}
                                                 onClick={this.onChangeQueIDClick.bind(this, {queid, quename})}
                                            >
                                                {quename}
                                            </div>
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    </div>
                    <ConfirmDlg
                        title="温馨提示"
                        message="分数修改成功，请回评下一题或者继续批阅！"
                        ref="confirm_dlg"
                        okText="确定"
                        hideCancel={true}
                    />
                    <ConfirmDlg
                        title="警告"
                        message="确定要清空所有标注吗？"
                        okText="确定"
                        cancelText="取消"
                        ref="cancel_confirm_dlg"
                    />
                    <ConfirmDlg
                        title="警告"
                        message="确定要提交仲裁吗？"
                        okText="确定"
                        cancelText="取消"
                        ref="submit_zhongcai_dlg"
                    />
                    <div className="loading_gif" style={{display: this.state.show_loading ? 'block': 'none'}}>
                        <Spin size="default"/>
                    </div>
                </div>

            </div>
        );
    }
}

export default ServicePhone;
