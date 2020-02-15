
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import $ from 'jquery'
import './style.less'

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
import down_arrow from "@imgs/down_arrow.png"
import up_arrow from "@imgs/up_arrow.png"

class LabelSiderBarCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active_id: 0,
            pen_active: false,
            delete_active: false,
            dui_active: false,
            bandui_active: false,
            wrong_active: false,
            onLabelClick: this.props.onLabelClick
        }
        this.type_active = null
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
    labelBtnClick(type){

        if(this.type_active != type){
            let params = {}
            if(this.type_active)
                params[this.type_active+'_active'] = false
            params[type+'_active'] = true
            this.showDrawLabel(type)
            this.setState(params)
            this.type_active = type
        }else{
            if(this.state[type+'_active']){
                let params = {}
                params[type+'_active'] = false
                this.setState(params)
            }else{
                let params = {}
                params[type+'_active'] = true
                this.showDrawLabel(type)
                this.setState(params)
            }

        }
    }
    showDrawLabel(type){
        //console.log(type)
        if(typeof this.state.onLabelClick == 'function'){
            this.state.onLabelClick(type)
        }
    }
    render() {
        return (
            <div className="label_side_bar_nav_html">
                {/*标注按钮*/}
                <div className="label_panel">
                    <div className="label_bg">
                        <div className="label_buttons" id="label_buttons">
                            <img src={this.state.pen_active ? canvas_pen_active: canvas_pen} className="pen" onClick={this.labelBtnClick.bind(this,"pen")}/>
                            <img src={this.state.delete_active? canvas_delete_active: canvas_delete} className="delete" onClick={this.labelBtnClick.bind(this,"delete")}/>
                            <img src={this.state.dui_active? canvas_dui_active: canvas_dui} className="dui" onClick={this.labelBtnClick.bind(this,"dui")}/>
                            <img src={this.state.bandui_active? canvas_bandui_active: canvas_bandui} className="bandui" onClick={this.labelBtnClick.bind(this,"bandui")}/>
                            <img src={this.state.wrong_active? canvas_wrong_active: canvas_wrong} className="wrong" onClick={this.labelBtnClick.bind(this,"wrong")}/>
                        </div>
                    </div>
                    <div className="hide_btn">
                        <img src={down_arrow} id="label_hide_btn" hide="false" onClick={function(){
                            console.log(10)
                            if($('#label_hide_btn').attr('hide') == 'false'){
                                $('#label_hide_btn').attr('hide', 'true')
                                //$('#label_hide_btn').css('background-image','url('+up_arrow+')')
                                $('#label_hide_btn').css('transform', 'rotateX(180deg)')
                                $('#label_buttons').css('height','0')
                            }else{
                                $('#label_hide_btn').attr('hide', 'false')
                                //$('#label_hide_btn').css('background-image','url('+down_arrow+')')
                                $('#label_hide_btn').css('transform', 'rotateX(0deg)')
                                $('#label_buttons').css('height',getRealPX(82)+'px')
                            }
                        }}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default LabelSiderBarCom;
