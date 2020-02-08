
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import './style.less'
import $ from "jquery";
import {List} from "react-virtualized";

import toback_white from '@imgs/toback_white.png'
import canvas_bandui from "@imgs/canvas_bandui.png"
import canvas_bandui_active from "@imgs/canvas_bandui_active.png"
import canvas_delete from "@imgs/canvas_delete.png"
import canvas_delete_active from "@imgs/canvas_delete_active.png"
import canvas_dui from "@imgs/canvas_dui.png"
import canvas_dui_active from "@imgs/canvas_dui_active.png"
import canvas_pen from "@imgs/canvas_pen.png"
import canvas_pen_active from "@imgs/canvas_pen_active.png"
import canvas_wrong from "@imgs/canvas_wrong.png"
import canvas_wrong_active from "@imgs/canvas_wrong_active.png"

class ServicePhone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image_url: null,
            ques_list: [],
            score_points_list: [],
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
        $('#menu_list').on('click',".btn", function () {
            $('#menu_list').find('.btn').css('color', '#fff')
            $('#op_panel').find('.panel').css('display', "none")
            let check = $(this).attr('check')
            let type = $(this).attr('type')
            if(check == 'true'){
                $(this).css('color', '#fff')
                $(this).attr('check', "false")
                $('#op_panel').find('.panel_'+type).css('display','none')
            }else{
                $(this).css('color', '#f00')
                $(this).attr('check', "true")
                $('#op_panel').find('.panel_'+type).css('display','block')
            }

        })
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
    screenRotate(event){
        console.log('屏幕翻转', event.message)
    }
    backClick(){
        if(qishi.browser.versions.android)
        {
            android.setScreenPortrait()
        }
        this.props.history.push({
            pathname: '/home'
        })

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
                        <div className="btn" type={0} check="false">提交仲裁</div>
                        <div className="btn" type={1} check="false">阅卷记录</div>
                        <div className="btn" type={2} check="false">打分版</div>
                        <div className="btn" type={3} check="false">选题</div>
                    </div>
                </div>
                <div className="content">
                    <div className="left">

                        {/*标注按钮*/}
                        <div className="label_panel">
                            <div>
                                <img src={canvas_pen}/>
                                <img src={canvas_delete}/>
                                <img src={canvas_dui}/>
                                <img src={canvas_bandui}/>
                                <img src={canvas_wrong}/>
                            </div>
                            <div className="hide_btn"></div>
                        </div>
                    </div>
                    <div className="mid" style={{height: this.state.contentHeight}}>
                        <img src={this.state.image_url}/>
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
                        <div className="ques_list panel_0" style={{height: this.state.contentHeight}}>
                        </div>
                        <div className="ques_list panel_1" style={{height: this.state.contentHeight}}>
                        </div>
                        <div className="ques_list panel_2" style={{height: this.state.contentHeight}}>
                        </div>
                        <div className="ques_list panel_3" style={{
                            height: this.state.contentHeight
                        }}>
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
