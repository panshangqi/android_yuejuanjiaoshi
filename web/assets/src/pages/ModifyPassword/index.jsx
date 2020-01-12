
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import {Input,Button} from 'antd'
import modify_password_bg from "@imgs/modify_password_bg.png"
import TitleBar from '@components/TitleBar'
import './style.less'

class ModifyPassword extends Component {
    constructor(props) {
        super(props);
        this.state={
            old_password: '',
            new_password: '',
            certain_password: ''
        }

    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    onOldPassword(event){
        this.setState({
            old_password: event.target.value
        })
    }
    onNewPassword(event){
        this.setState({
            new_password: event.target.value
        })
    }
    onCertainPassword(event){
        this.setState({
            certain_password: event.target.value
        })
    }
    submitClick(){
        if(this.state.certain_password != this.state.new_password){
            qishi.util.alert("新密码输入不一致")
            return;
        }
        var userid = qishi.cookies.get_userid()
        var token = qishi.cookies.get_token()
        var self = this
        qishi.http.get('ParentChangePassword',[userid,token,this.state.old_password,this.state.new_password],function (data) {
            console.log(data)
            if(data.codeid == qishi.config.responseOK){
                qishi.util.alert("密码修改成功")
                self.props.history.push('/personal')
            }else{
                qishi.util.alert(data.message)
            }
        })
    }
    render() {
        return (
            <div className="modify_pwd_html">
                <img className="bg_image"
                     src={modify_password_bg}
                />
                <div className="content">
                    <TitleBar
                        title="修改密码"
                        BackClick={(function(){
                            this.props.history.push("/personal")
                        }).bind(this)}
                    />
                    <div className="op_panpel">
                        <div className="subtitle">原密码</div>
                        <Input className="input_style"
                               placeholder="请输入旧密码"
                               onChange={this.onOldPassword.bind(this)}
                               value={this.state.old_password} type="password"

                        />
                        <div className="subtitle">新密码</div>
                        <Input className="input_style"
                               placeholder="请输入新密码"
                               onChange={this.onNewPassword.bind(this)}
                               value={this.state.new_password} type="password"
                        />
                        <div className="subtitle">确认密码</div>
                        <Input className="input_style" placeholder="请再次输入新密码"
                               onChange={this.onCertainPassword.bind(this)}
                               value={this.state.certain_password} type="password"
                        />
                        <button className="theme_red_btn submit_btn"
                                style={{marginTop: 32}}
                                onClick={this.submitClick.bind(this)}
                        >确 认</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ModifyPassword;
