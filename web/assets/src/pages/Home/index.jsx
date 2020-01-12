
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import PageFooter from '@components/PageFooter'
import { Radio } from 'antd';
import './style.less'

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id: 0
        }
    }
    async componentDidMount(){
        let userinfo = qishi.cookies.get_userinfo()
        console.log(userinfo)
        let token = qishi.cookies.get_token();
        let userid = qishi.cookies.get_userid();
        console.log(token, userid)
        let res = await qishi.http.getSync("GetWorkprogress",[userid, token, userinfo.usersubjectid])
        console.log('正评列表')
        console.log(res)
        // var self = this;
        // qishi.http.get('GetTestscorelist',[userid, token],function (data) {
        //     console.log('GetTestscorelist')
        //     console.log(data)
        //     if(data.codeid == qishi.config.responseOK){
        //
        //         if(data.message && data.message.length > 0){
        //             var exam_info = data.message[0]
        //             self.setState({
        //                 stu_score: exam_info.studentscore,
        //                 total_score: exam_info.fullscore,
        //                 exam_name: exam_info.examname,
        //                 exam_date: exam_info.examdate,
        //                 exam_id: exam_info.examprojectid
        //             })
        //             console.log(exam_info.studentscore, exam_info.fullscore)
        //         }else{
        //             console.log('data.message.length == 0')
        //         }
        //
        //         self.setState({
        //             exam_list: data.message
        //         })
        //
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
    onTabsChange(e) {
        console.log(`radio checked:${e.target.value}`);
        this.setState({
            tab_id: e.target.value
        })
    }
    render() {
        return (
            <div className="home_html">
                <div className="tabs_bar">
                    <Radio.Group size="large" value={this.state.tab_id} onChange={this.onTabsChange.bind(this)} defaultValue="a">
                        <Radio.Button value={0}>正评列表</Radio.Button>
                        <Radio.Button value={1}>回评列表</Radio.Button>
                    </Radio.Group>
                </div>
                <PageFooter route="/home" history={this.props.history}/>
            </div>
        );
    }
}

export default Home;
