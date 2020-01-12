
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import $ from 'jquery'
import './style.less'

class MenuNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subject_id: props.subject_id,
            exam_id: props.exam_id,
            subject_list: []
        }
        console.log('MenuNav', this.state)
        this.ItemClick = props.ItemClick
    }
    componentDidMount(){
        //考试科目列表
        var token = qishi.cookies.get_token();
        var userid = qishi.cookies.get_userid();
        console.log('MenuNav token = ' +token, userid, this.state.exam_id)
        var self = this
        qishi.http.get('GetOneTestscore',[userid, token, this.state.exam_id],function (data) {
            console.log('GetOneTestscore')
            console.log(data)
            if (data.codeid == qishi.config.responseOK) {

                var sublist = data.message[0].paperscore
                if(self.state.subject_id){
                    self.setState({
                        subject_list: sublist
                    })
                }else{
                    self.setState({
                        subject_id: sublist.length > 0 ? sublist[0].subjectid: null,
                        subject_list: sublist
                    })
                }

                if(typeof self.ItemClick === 'function'){
                    self.ItemClick({
                        id: self.state.subject_id
                    })
                }

            } else {
                qishi.util.alert(data.message)
            }
        })
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        if(isAndroid){		/*注释5*/
            // $('.nav_box').on('touchstart',function(){
            //     $(document).on('touchmove',function(e){
            //         e.preventDefault();
            //     });
            //     $(document).on('touchend',function(){
            //         $(document).unbind();
            //     });
            // });
        }
        var self = this

        $('#nav_box').on('click','li',function () {
            var id = $(this).attr('id')
            self.setState({
                subject_id: id
            })
            if(typeof self.ItemClick === 'function'){
                self.ItemClick({
                    id
                })
            }
        })
    }
    componentWillReceiveProps(props){

    }
    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    renderItemLi(){
        var arr = []
        var keyid = 0;

        for(var item of this.state.subject_list){
            arr.push(
                <li
                    id={item.subjectid}
                    name={item.subjectname}
                    key={'navli_'+keyid}
                    style={{
                        color: this.state.subject_id == item.subjectid ? qishi.config.theme_color: '#444',
                        fontSize: this.state.subject_id == item.subjectid ? getRealPX(18)+'px': getRealPX(16)+'px'
                    }}
                >
                    {item.subjectname}
                </li>
            )
            keyid++

        }
        return arr;
    }
    render() {
        return (
            <div className="menu_nav_html">
                <ul className="nav_box" id="nav_box">
                    {this.renderItemLi()}
                </ul>
            </div>
        );
    }
}

export default MenuNav;
