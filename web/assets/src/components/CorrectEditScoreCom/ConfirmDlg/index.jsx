
import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import $ from 'jquery'
import './style.less'

class DialogCom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            message: props.message,
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
    onClick(){
        setTimeout(()=>{
            this.hideModal()
            if(typeof this.callback == 'function'){
                this.callback()
            }
        },300)
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
                <div className="footer" onClick={this.onClick.bind(this)}>
                    确定
                </div>
            </Modal>

        );
    }
}

export default DialogCom;
