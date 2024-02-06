import React, {useEffect} from 'react';
import {Breadcrumb, ConfigProvider, Layout, Menu, Row, theme} from 'antd';
import {NavLink, Route, Routes} from "react-router-dom";
import Users from "./components/users/Users";
import Login from "./components/login/Login";
import HeaderContainer from "./components/header/HeaderContainer";
import {useDispatch, useSelector} from "react-redux";
import {initializeApp} from "./redux/AppReducer";
import FloodChat from "./components/flood_chat/FloodChat";
import Friends from "./components/friends/Friends";
import ProfileContainer from "./components/profile/profileinfo/ProfileContainer";
import DialogsContainer from "./components/dialogs/DialogsContainer";
import News from "./components/news/News";
import AskOpenAi from "./components/openAi/AskOpenAi";
import PageNotFound from "./components/404/PageNotFound";
import Preloader from "./common/preloader/Preloader";
import SideBar from "./components/sidebar/SideBar";
import "./css/app.css"


const {Header, Content, Footer, Sider} = Layout;

const AppComp = () => {

    const initialized = useSelector((state: any) => state.app.initialized)
    console.log('initialized', initialized)

    const dispatch: any = useDispatch();
    useEffect(() => {
        dispatch(initializeApp());
    }, [dispatch]);

    // const {
    //     token: {colorBgContainer, borderRadiusLG},
    // } = theme.useToken();

    if (!initialized) {
        return <div style={{fontSize: "200px"}}><Preloader isFetching={true}/></div>
    }

    return (
        <ConfigProvider theme={{
                token: {
                    colorBgContainer: "white",
                    // fontFamily: "Hacker Noon V1"
                    fontFamily: "IBM Plex Mono , monospace"


                }
        }} >
        <Layout>
            <HeaderContainer/>
            <Content  style={{padding: '0 48px'}}>
                <Layout
                    style={{padding: '24px 0', }}
                    // background: colorBgContainer, borderRadius: borderRadiusLG
                >
                    <SideBar borderRadiusLG="0px"/>

                    <Content style={{padding: '0 24px', minHeight: 280}}>
                        <Routes>
                            <Route path="/profile/:id?" element={<ProfileContainer/>}/>
                            <Route path="/users" element={<Users/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/friends" element={<Friends/>}/>
                            <Route path="/dialogs/:id?" element={<DialogsContainer/>}/>
                            <Route path="/news" element={<News/>}/>
                            <Route path="/flood_chat" element={<FloodChat/>}/>
                            <Route path="/ask_ai" element={<AskOpenAi/>}/>
                            <Route path="*" element={<PageNotFound/>}/>
                        </Routes>
                    </Content>


                </Layout>
            </Content>


            <Footer style={{textAlign: 'center'}}>
                <div  className="app_container">HELLO WORLD!</div>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
            </ConfigProvider>
    );
};

export default AppComp;