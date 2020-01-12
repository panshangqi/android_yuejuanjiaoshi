
import React, { Component } from 'react';
import qishi from '@components/qishi.jsx';
import TitleBar from '@components/TitleBar'
import servicelogo from '@imgs/service_logo.jpg'
import './style.less'

class ServicePhone extends Component {
    constructor(props) {
        super(props);

    }
    componentWillUnmount(){

        this.setState = (state,callback)=>{
            return;
        };
    }
    render() {
        return (
            <div className="service_phone_html">
                <TitleBar
                    title="客服电话"
                    BackClick={(function(){
                        this.props.history.push("/personal")
                    }).bind(this)}
                />
                <div className="bg_box">
                    <img src={servicelogo} style={{width: '40%'}}/>
                </div>
                <div className="telephone">
                    0373-80088208200
                </div>
            </div>
        );
    }
}

export default ServicePhone;
