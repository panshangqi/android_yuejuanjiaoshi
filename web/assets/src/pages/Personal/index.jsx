
import React, { Component } from 'react';
import PageFooter from '@components/PageFooter'
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import {Button} from 'antd'
import './style.less';
import my_change_password from '@imgs/my_change_password.png'
import my_householder_invite from "@imgs/my_householder_invite.png"
import my_register_householder from "@imgs/my_register_householder.png"
import my_fre_question from "@imgs/my_fre_question.png"
import my_custom_service_phone from "@imgs/my_custom_service_phone.png"
class PersonalCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userinfo: {}
        }
    }
    componentDidMount(){
        let userinfo = qishi.cookies.get_userinfo()
        console.log(userinfo);
        this.setState({
            userinfo: userinfo
        })
        // var token = qishi.cookies.get_token();
        // var userid = qishi.cookies.get_userid();
        // console.log(token, userid)
        // var self = this;
        // qishi.http.get('Getstudentinfo',[userid, token],function (data) {
        //     console.log('Getstudentinfo')
        //     console.log(data)
        //     if(data.codeid == qishi.config.responseOK){
        //         self.setState({
        //             stu_name: data.message[0].username,
        //             school_name: data.message[0].stuschool
        //         })
        //     }else{
        //         qishi.util.alert(data.message)
        //     }
        // })
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    exitLoginClick(){
        this.props.history.push('/login')
    }
    modifyPwdClick(){
        this.props.history.push('/modify_password')
    }
    generalQuesClick(){
        this.props.history.push('/general_question')
    }
    servicePhoneClick(){
        window.location.href = '#/service_phone'
    }
    parentRequest(){
        window.location.href = '#/parent_request'
    }
    parentRegister(){
        window.location.href = '#/parent_register'
    }
    onLogoutClick(){
        this.props.history.push('/login')
    }
    render() {
        return (
            <div className="personal_center_html">
                <TitleBar
                    title="我的"
                    back_ico={false}
                    BackClick={(function(){
                        this.props.history.push("/personal")
                    }).bind(this)}
                />
                <div className="headBg">
                    <div className="head_bg"/>
                    <div className="tuoyuan"/>
                </div>
                <div className="user_info">
                    <div className="username">{this.state.userinfo.username}</div>
                    <div className="userid">账号：{this.state.userinfo.userid}</div>
                    <div className="userrole">权限：{this.state.userinfo.userpower}</div>
                </div>
                <div className="menu_box">
                    <div className="row1">
                        <div className="col col1">
                            <img src={my_change_password}/>
                            <span>修改密码</span>
                        </div>
                        <div className="col col2" onClick={this.parentRequest.bind(this)}>
                            <img src={my_householder_invite}/>
                            <span>家长邀请</span>
                        </div>
                        <div className="col col3" onClick={this.parentRegister.bind(this)}>
                            <img src={my_register_householder}/>
                            <span>注册家长</span>
                        </div>
                    </div>
                    <div className="row2">
                        <div className="col col1" onClick={this.generalQuesClick.bind(this)}>
                            <img src={my_fre_question}/>
                            <span>常见问题</span>
                        </div>
                        <div className="col col2" onClick={this.servicePhoneClick.bind(this)}>
                            <img src={my_custom_service_phone}/>
                            <span>客服电话</span>
                        </div>
                    </div>

                    <Button type="primary" className="logout" onClick={this.onLogoutClick.bind(this)}>退出登录</Button>
                </div>

                <PageFooter route="/personal" history={this.props.history}/>
            </div>
        );
    }
}

export default PersonalCenter;
