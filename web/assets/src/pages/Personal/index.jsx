
import React, { Component } from 'react';
import PageFooter from '@components/PageFooter'
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import './style.less';
// import headbg from '@imgs/personal_header_bg.png'
// import arrow_right from "@imgs/arrow_right.png"
// import modify_password from "@imgs/modify_password.png"
// import general_question from "@imgs/general_question.png"
// import service_phone from "@imgs/service_phone.png"
class PersonalCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stu_name: '-/-',
            school_name: '-/-'
        }
        console.log(qishi.config.window_width)
    }
    componentDidMount(){
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
        this.props.history.push('/service_phone')
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

                <PageFooter route="/personal" history={this.props.history}/>
            </div>
        );
    }
}

export default PersonalCenter;
