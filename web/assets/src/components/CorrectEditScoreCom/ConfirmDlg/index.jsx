
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import $ from 'jquery'
import './style.less'

class DialogCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            title: props.title ? props.title : "提示",
            message: props.message,
            hideOK: props.hideOK ? props.hideOK : false,
            hideCancel: props.hideCancel ? props.hideCancel : false,
            okText: props.okText ? props.okText : 'OK',
            canelText: props.cancelText ? props.cancelText : 'Cancel',
            modelWidth: 100
        }
        this.callback = null
    }
    componentDidMount(){
        this.clientWidth = document.documentElement.clientWidth || document.body.clientWidth
        this.clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        this.modal_width = this.clientWidth * 0.4
        this.modal_top = this.clientHeight * 0.2
        this.setState({
            modelWidth: this.modal_width
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
    showModal = (callback) => {
        this.setState({
            visible: true,
        });
        this.callback = callback
    };
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    onClick(name){
        setTimeout(()=>{
            if(typeof this.callback == 'function'){
                this.callback(name)
            }
            this.hideModal()
        },300)
    }
    footRender(){
        let arr = []
        if(!this.state.hideCancel){
            arr.push(
                <div className="btn cancel" onClick={this.onClick.bind(this, 'cancel')} key={1}>{this.state.canelText}</div>
            )
        }
        if(!this.state.hideOK && !this.state.hideCancel){
            arr.push(
                <div className="line" key={2}></div>
            )
        }
        if(!this.state.hideOK){
            arr.push(
                <div className="btn" onClick={this.onClick.bind(this, 'ok')} key={0}>{this.state.okText}</div>
            )
        }
        return (
            <div className="footer">
                { arr }
            </div>
        )
    }
    render() {
        return (

            <Modal
                title="Modal"
                visible={this.state.visible}
                onOk={this.hideModal}
                onCancel={this.hideModal}
                okText="确认"
                cancelText="取消"
                width={this.state.modelWidth}
                footer={null}
                closable={false}
                className="cancel_ok_modal"
            >
                <div className="title">温馨提示</div>
                <div className="content">{this.state.message}</div>
                {this.footRender()}

            </Modal>

        );
    }
}

export default DialogCom;
