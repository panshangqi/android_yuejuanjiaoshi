import React, { Component } from 'react';
import $ from 'jquery'
import qishi from '@components/qishi.jsx'
import './style.less'

class MessageCom {

    constructor(){

    }
    warn(params) {
        //console.log(params)
        if (!params.duration)
            params.duration = 2000
        //params.duration = 200000
        this.init(params)
    }
    init(params){
        let setting = {
            bottom: getRealPX(150)+'px',
            fontSize: getRealPX(18) + 'px',
            lineHeight: getRealPX(30) + 'px',
            padding: getRealPX(9) + "px " + getRealPX(30) + 'px',
            maxWidth: getRealPX(300) + 'px',
            boxShadow: '0 0 '+getRealPX(10)+'px ' + qishi.config.theme_color
        }
        //console.log(document.body.clientWidth, document.body.clientHeight)
        if(document.body.clientWidth > document.body.clientHeight) //横屏
        {
            setting.bottom = getRealPX(60)+'px'
            setting.fontSize = getRealPX(9) + 'px'
            setting.lineHeight = getRealPX(15) + 'px'
            setting.padding = getRealPX(4) + "px " + getRealPX(20) + 'px'
            setting.maxWidth = getRealPX(150) + 'px'
            setting.boxShadow = '0 0 '+getRealPX(10)+'px ' + qishi.config.theme_color
        }

        //console.log(params)
        let div_box = document.createElement('div')
        div_box.style.position = 'absolute';
        div_box.style.left = '0'
        div_box.style.bottom =  '-'+getRealPX(80)+'px';
        div_box.style.marginLeft = '0'
        div_box.style.width = '100%'
        div_box.style.height = 'auto'
        div_box.style.zIndex = '103'
        div_box.style.textAlign = 'center'
        div_box.style.opacity = '1.0'
        div_box.style.transition = 'bottom .5s, opacity .6s'
        let div = document.createElement('div')
        div.style.display = 'inline-block'
        div.style.maxWidth = setting.maxWidth
        div.style.backgroundColor = qishi.config.theme_color
        div.style.textAlign = 'center'
        div.style.lineHeight = setting.lineHeight
        div.style.color = '#fff'
        div.style.borderRadius = getRealPX(100)+'px'
        div.style.fontSize = setting.fontSize
        div.style.padding = setting.padding
        div.style.boxShadow = setting.boxShadow
        //div.appendChild(params.string)
        div.innerText = params.string
        div_box.appendChild(div)
        document.body.appendChild(div_box)

        setTimeout(()=>{
            div_box.style.bottom = setting.bottom;
        },0)

        setTimeout(()=>{
            div_box.style.opacity = '0.0'
            setTimeout(()=>{
                document.body.removeChild(div_box)
            },500)
        }, params.duration)
    }

}
let message = new MessageCom()

export default message;