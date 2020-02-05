import React from 'react';
import $ from 'jquery';
import { message, Spin } from 'antd'
console.log("environment: " + process.env.NODE_ENV)
console.log("os env: " + navigator.userAgent)
const Qishi = {};
Qishi.config = {
    ENV: process.env.NODE_ENV,
    cookiestr: "userid=16031620018;ip=49.4.48.115;token=4419604AF61EFE64FFFA9D91620102F7", //网页测试 123015001
    responseOK: '0001',
    theme_color: '#FF9647',
    theme_red: '#FF796B',
    book_ip: 'http://114.116.116.99' //错题本
}

$('#env_box_0x3320').css({
    display: process.env.NODE_ENV === 'development' ? 'block': 'none'
})
$('#env_box_0x3320').html(process.env.NODE_ENV)
if(window.localStorage){
    Qishi.config.supportStorage = true
    console.log('This browser supports localStorage');
}else{
    Qishi.config.supportStorage = false
    console.log('This browser does NOT support localStorage');
}
console.log(Qishi.config)
Qishi.cookies = {

    get_cookies:function (key) {
        var obj = null
        if(Qishi.config.supportStorage){
            obj = localStorage.getItem(key)
        }
        return obj;
    },
    get_token: function () {
        return Qishi.cookies.get_cookies("yuejuan_teacher_token")
    },
    get_userid: function () {
        return Qishi.cookies.get_cookies("yuejuan_teacher_userid")
    },
    get_userinfo: function(){
        let userinfo = Qishi.cookies.get_cookies("yuejuan_teacher_userinfo")
        console.log(typeof userinfo,userinfo)
        return  JSON.parse(userinfo)
    },
    set_cookies:function (obj) {
        for(var key in obj){
            if(Qishi.config.supportStorage){
                localStorage.setItem(key, obj[key]);
            }
        }
    }
}
Qishi.util = {

    alert:function(msg){
        message.config({
            top: $(window).height() - 200
        })
        message.warning(msg);
    },
    log:function(msg){
        if(typeof android != 'undefined'){
            android.logv(msg)
        }
    },
    wsdl_url: function(){
        var ip = Qishi.cookies.get_cookies('yuejuan_teacher_ip');
        console.log(ip)
        //使用可跨域Chrome浏览器
        if(Qishi.config.ENV == "development"){
             return "/exam/AppdatacenterImpPort?wsdl";
        }

        if(ip){
            return `http://${ip}/exam/AppdatacenterImpPort?wsdl`
        }else{
            Qishi.util.alert("访问错误")
            return "";
        }
    },
    mark_http_url: function(route){

        if(Qishi.config.ENV == "development"){
            return route; // /xx/xx/ss
        }
        return `${Qishi.config.book_ip}${route}`
    },
    make_image_url(image_name){
        var ip = Qishi.cookies.get_cookies('yuejuan_ip');
        if(Qishi.config.ENV == "development"){
            return "/exam/appshowimage?path="+image_name;
        }

        if(ip){
            return `http://${ip}/exam/appshowimage?path=${image_name}`
        }else{
            Qishi.util.alert("访问错误")
            return "";
        }
    },
    make_image_url2(image_name){
        if(Qishi.config.ENV == "development"){
            return `/ctb/showimage?path=${image_name}`
        }
        return `${Qishi.config.book_ip}/ctb/showimage?path=${image_name}`
    }
}

Qishi.http = {
    /*
    params = {
        username: '111'
        password: '222'
    }
http://49.4.48.115
     */
    get:function (url, params, fn) {
        var xmlhttp = new XMLHttpRequest();
        var route = url //such as ParentLogin
        //replace second argument with the path to your Secret Server webservices

        try{
            xmlhttp.open('POST', Qishi.util.wsdl_url(), true);

            //create the SOAP request
            //replace username, password (and org + domain, if necessary) with the appropriate info
            var strRequest =
                '<?xml version="1.0"?>' +
                '<soap:Envelope '+
                'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" ' +
                'xmlns:xsl="http://www.w3.org/1999/XSL/Transform" ' +
                'xmlns:xs="http://www.w3.org/2001/XMLSchema" ' +
                'xmlns:AppdatacenterImpService="http://webservice.app.com/" '+
                'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                'xsl:version="1.0">' +
                '<soap:Body>' +
                '<AppdatacenterImpService:' + route +'>';
            var count = 0;
            for(var param of params){
                strRequest += `<arg${count}>${param}</arg${count}>`
                count ++;
            }
            strRequest += '</AppdatacenterImpService:'+route+'>' +
                '</soap:Body>' +
                '</soap:Envelope>';
            //console.log(strRequest)
            //specify request headers
            xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
            xmlhttp.setRequestHeader('Access-Control-Allow-Origin', '*');

            //FOR TESTING: display results in an alert box once the response is received
            xmlhttp.onreadystatechange = function () {
                /*
                存有 XMLHttpRequest 的状态。从 0 到 4 发生变化。

                0: 请求未初始化
                1: 服务器连接已建立
                2: 请求已接收
                3: 请求处理中
                4: 请求已完成，且响应已就绪
                 */
                if (xmlhttp.readyState == 4) {
                    console.log("http status: "+xmlhttp.status)
                    if(xmlhttp.status==200){
                        var result = xmlhttp.responseText
                        if(typeof fn === 'function'){
                            var xml = $.parseXML(result)
                            var data = xml.firstChild.firstChild.firstChild.firstChild.firstChild
                            data = data.textContent
                            console.log(typeof data)
                            //console.log(data)
                            var jsonData = $.parseJSON(data);

                            fn({
                                type: 'AJAX',
                                data: jsonData[0]
                            });
                        }
                    }
                    else{
                        if(typeof fn === 'function'){
                            console.warn("HTTP GET ERROR": xmlhttp.responseText)
                            fn({
                                type: 'ERROR',
                                data: xmlhttp.responseText
                            })
                        }
                    }
                }
            };

            //send the SOAP request
            xmlhttp.send(strRequest);
        }catch (err){
            Qishi.util.alert("访问错误")
            console.log(err)
        }

    },
    getSync: function(url, params){
        return new Promise((resolve, reject) => {
            Qishi.http.get(url, params, function (result) {
                resolve(result)
            })
        })
    },
    get_ajax:function (url, params, fn, errfn) {
        let params_string = ''
        params.studentid = Qishi.cookies.get_userid()
        params.authtoken = Qishi.cookies.get_token()
        for(let key in params){
            params_string += params_string.length == 0 ? "?" : "&";
            params_string += key + '=' + params[key]
        }
        let final_url = url + params_string
        $.ajax({
            type: 'get',
            url: final_url,
            dataType: 'json',
            success: function (data) {
                if(typeof fn == 'function'){
                    fn(data)
                }
            },
            error: function (err) {
                console.log(err)
                if(typeof errfn == 'function'){
                    errfn(err)
                }
            }
        })
    }
};
function os_versions(){
    let u = navigator.userAgent, app = navigator.appVersion;
    return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
}
Qishi.browser = {
    versions: os_versions()
}
console.log(Qishi.browser.versions)
export default Qishi;
