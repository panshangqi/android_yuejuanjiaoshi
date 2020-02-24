
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import $ from 'jquery'
import './style.less'

import edit_bandui from "@imgs/edit_bandui.png"
import edit_delete from "@imgs/edit_delete.png"
import edit_dui from "@imgs/edit_dui.png"
import edit_pen from "@imgs/edit_pen.png"
import edit_wrong from "@imgs/edit_wrong.png"
import down_arrow from "@imgs/down_arrow.png"

let icons = {
    pen: edit_pen,
    delete: edit_delete,
    dui: edit_dui,
    bandui: edit_bandui,
    wrong: edit_wrong,
}

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
            {
                params[this.type_active+'_active'] = false
                this.showDrawLabel({
                    type: this.type_active,
                    active: false
                })
            }

            params[type+'_active'] = true
            if(type == 'delete'){
                params[type+'_active'] = false
            }
            this.showDrawLabel({
                type: type,
                active: true
            })
            this.setState(params)
            this.type_active = type
        }else{
            if(this.state[type+'_active']){
                let params = {}
                params[type+'_active'] = false
                this.setState(params)
                this.showDrawLabel({
                    type: type,
                    active: false
                })
            }else{
                let params = {}
                params[type+'_active'] = true
                if(type == 'delete'){
                    params[type+'_active'] = false
                }
                this.setState(params)
                this.showDrawLabel({
                    type: type,
                    active: true
                })
            }
        }
    }
    showDrawLabel(type){
        //console.log(type)
        if(typeof this.state.onLabelClick == 'function'){
            this.state.onLabelClick(type)
        }
    }
    resetStatus(){
        this.setState( {
            active_id: 0,
            pen_active: false,
            delete_active: false,
            dui_active: false,
            bandui_active: false,
            wrong_active: false
        })
    }
    render() {
        return (
            <div className="label_side_bar_nav_html">
                {/*标注按钮*/}
                <div className="label_panel">
                    <div className="label_bg">
                        <div className="label_buttons" id="label_buttons">
                            {
                                ['pen', 'delete', 'dui', 'bandui', 'wrong'].map((name)=>{
                                    let active_key = name+"_active"
                                    return (
                                        <img
                                            key={name}
                                            src={icons[name]}
                                            className={name+(this.state[active_key] ? " active": "")}
                                            onClick={this.labelBtnClick.bind(this,name)}
                                        />
                                    )
                                })
                            }
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
