import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route,Redirect, Link, Switch} from 'react-router-dom';
import { createHashHistory } from 'history';

import 'antd/dist/antd.less'
import 'react-virtualized/styles.css'; // only needs to be imported once
import './index.less'
import Login from '@pages/Login'
// import PageFooter from '@components/PageFooter'
import Page from '@components/Page'
import Personal from '@pages/Personal'
import CorrectEditScore from '@pages/CorrectEditScore'
// import Book from '@pages/Book'
// import ModifyPassword from '@pages/ModifyPassword'
import ServicePhone from '@pages/ServicePhone'
import GeneralQuestion from '@pages/GeneralQuestion'
import ParentRegister from '@pages/ParentRegister'
// import ResultReport from '@pages/ResultReport'
import ParentRequest from '@pages/ParentRequest'
import Home from '@pages/Home'
import WorkProgress from "@pages/WorkProgress"
// import ErrorBookList from '@pages/ErrorBookList'


var history = createHashHistory();
//loading-component 动态组件加载s
//使用 react-loadable 动态 import React 组件，让首次加载时只加载当前路由匹配的组件。
document.onreadystatechange = function () {
    console.log(document.readyState);
    if(document.readyState === 'complete') {
        console.log('文档加载完成')
        initRender()

    }else{
        console.log('文档加载中...')
    }
}

function initRender() {
    ReactDOM.render(
        <Router history={history}>
            <Page>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/home" component={Home}/>
                    <Route exact path="/work_progress" component={WorkProgress}/>
                    <Route exact path="/personal" component={Personal}/>
                    <Route exact path="/correct_edit_score" component={CorrectEditScore}/>
                    <Route exact path="/service_phone" component={ServicePhone}/>
                    <Route exact path="/general_question" component={GeneralQuestion}/>
                    <Route exact path="/parent_request" component={ParentRequest} />
                    <Route exact path="/parent_register" component={ParentRegister}/>
                    {/*

                <Route exact path="/modify_password" component={ModifyPassword}/>
                <Route exact path="/service_phone" component={ServicePhone}/>

                <Route exact path="/exam_analysis" component={ExamAnalysis}/>
                <Route exact path="/result_report" component={ResultReport}/>

                <Route exact path="/book" component={Book}/>
                <Route exact path="/error_book_list" component={ErrorBookList}/>

                */}
                    <Route component={Login} />
                </Switch>
            </Page>
        </Router>
        , document.getElementById('root'));
}
