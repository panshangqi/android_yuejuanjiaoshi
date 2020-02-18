
import React, { Component } from 'react';
import {Button, Input } from 'antd'
import './style.less';
import qishi from '@components/qishi'
import login_bg_book from '@imgs/login_bg_book.jpg'
import login_bg_foot from '@imgs/login_bg_foot.jpg'

class Login extends Component {
    constructor(props) {
        super(props);
        var userid = qishi.cookies.get_cookies('yuejuan_teacher_userid')
        var ip = qishi.cookies.get_cookies('yuejuan_teacher_ip')
        console.log('init')
        qishi.util.log('userid='+userid+',ip='+ip)
        console.log(userid, ip)
        this.state = {
            username: userid ? userid : "",
            password: "",
            ip: ip ? ip: ""
        };
        //10000073 0 114.116.116.99:88
        //1002 888888 27.128.200.195:8098
    }
    componentDidMount(){
        console.log(window)
    }

    componentWillUnmount(){
        document.removeEventListener("keydown",this.handleEnterKey);
        this.setState = (state,callback)=>{
            return;
        };
    }
    onChangeUsername(event){
        this.setState({
            username: event.target.value
        })
    }
    onChangePassword(event){
        this.setState({
            password: event.target.value
        })
    }
    onChangeIpPort(event){
        this.setState({
            ip: event.target.value
        })
    }
    async loginButtonClick(){

        console.log(this.state.username, this.state.password, this.state.ip)
        qishi.cookies.set_cookies({
            yuejuan_teacher_ip: this.state.ip
        })
        console.log(">>>>>>>>>>>>>>>>Login>>>>>>>>>>>>>>")
        let res = await qishi.http.getSync('UserLogin',[this.state.username, this.state.password])
        console.log(res)
        if(!res || res.type == 'ERROR'){
            qishi.util.alert("网络错误: UserLogin")
            return
        }
        let data = res.data;
        if(data.codeid != qishi.config.responseOK) {
            console.log(data.message)
            qishi.util.alert(data.message)
            return
        }

        console.log('登陆成功')
        qishi.cookies.set_cookies({
            yuejuan_teacher_userid: this.state.username,
            yuejuan_teacher_ip: this.state.ip,
            yuejuan_teacher_token: data.authtoken
        })
        console.log('开始获取用户信息')
        let hr = await qishi.http.getSync("GetUserinfo",[this.state.username, data.authtoken])
        console.log(hr)
        if(!hr || hr.type == 'ERROR'){
            qishi.util.alert("网络错误: GetUserinfo")
            return
        }
        let userinfo = hr.data && hr.data.message.length > 0 ? hr.data.message[0]: {}
        qishi.cookies.set_cookies({
            yuejuan_teacher_userinfo: JSON.stringify(userinfo)
        })
        //this.props.history.push('/home')
        window.location.href = '#/home'
    }
    render() {
        return (
            <div className="login_html">
                <div className="content">
                    <div className="title">登 录</div>
                    <div className="login_icon">
                        <img src={login_bg_book}/>
                    </div>
                    <Input className="input_style" placeholder="输入手机号" onChange={this.onChangeUsername.bind(this)} value={this.state.username}/>
                    <Input className="input_style" placeholder="输入密码" onChange={this.onChangePassword.bind(this)} value={this.state.password} type="password"/>
                    <Input className="input_style" placeholder="输入学校IP地址和端口" onChange={this.onChangeIpPort.bind(this)} value={this.state.ip}/>
                    <Button
                        className="button_style"
                        onClick={this.loginButtonClick.bind(this)}
                    >登 录</Button>
                    <div className="forget_passwd"><span>忘记密码？</span></div>
                </div>

                <img className="login_foot" src={login_bg_foot}/>
            </div>
        );
    }
}

export default Login;
