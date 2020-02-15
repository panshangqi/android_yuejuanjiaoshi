
import React, { Component } from 'react';
import $ from 'jquery'
import './style.less'

class MenuNav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onMenuClick: this.props.onMenuClick
        }
        this.active_type = null
        this.active_map = {}
    }
    componentDidMount(){

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
    btnClick(type){
        if(this.active_type != type){
            $('#btn_'+this.active_type).css('color', '#fff')
            $('#btn_'+type).css('color', '#f00')
            this.active_type = type
            if(this.active_type)
                this.active_map[this.active_type] = false
            this.active_map[type] = true
            this.onBtnClick({type, 'active': true})
        }else{
            if(this.active_map[type]){
                this.active_map[type] = false
                $('#btn_'+type).css('color', '#fff')
                this.onBtnClick({type, 'active': false})
            }else{
                this.active_map[type] = true
                $('#btn_'+type).css('color', '#f00')
                this.onBtnClick({type, 'active': true})
            }
        }
    }
    onBtnClick(res){
        if(typeof this.state.onMenuClick == 'function'){
            this.state.onMenuClick(res)
        }
    }
    render() {
        return (
            <div className="head_menu_bar_html">
                {/*菜单按钮*/}
                <div className="btn" id="btn_1" onClick={this.btnClick.bind(this, '1')}>提交仲裁</div>
                <div className="btn" id="btn_2" onClick={this.btnClick.bind(this, '2')}>阅卷记录</div>
                <div className="btn" id="btn_3" onClick={this.btnClick.bind(this, '3')}>打分版</div>
                <div className="btn" id="btn_4" onClick={this.btnClick.bind(this, '4')}>选题</div>
            </div>
        );
    }
}

export default MenuNav;
