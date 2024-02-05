import React, {useEffect} from 'react';
import './index.css';
import {Breadcrumb,  Layout, Menu, Row, theme} from 'antd';
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

const {Header, Content, Footer, Sider} = Layout;

const AppComp = () => {

    const initialized  = useSelector((state : any) => state.app.initialized)
    console.log('initialized' ,  initialized)

    const dispatch: any = useDispatch();
    useEffect(() => {
        dispatch(initializeApp());
    }, [dispatch]);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    if ( !initialized ) {
        return <div style={{fontSize : "200px"}} >PRELOADER...</div>
    }

    return (
        <Layout>
            <HeaderContainer/>
            <Content style={{padding: '0 48px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Layout
                    style={{padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG}}
                >
                    <Sider style={{background: colorBgContainer}} width={200}>

                        <Menu
                            mode="inline"
                            // defaultSelectedKeys={['1']}
                            // defaultOpenKeys={['sub1']}
                            style={{height: '100%'}}>

                            <Menu.Item key="1"> <NavLink to={"/profile"}>Profile</NavLink> </Menu.Item>
                            <Menu.Item key="2"> <NavLink to={"/users"}>Users</NavLink> </Menu.Item>
                            <Menu.Item key="3"> <NavLink to={"/friends"}>Friends</NavLink> </Menu.Item>
                            <Menu.Item key="5"> <NavLink to={"/dialogs"}>Messenger</NavLink> </Menu.Item>
                            <Menu.Item key="6"> <NavLink to={"/news"}>News</NavLink> </Menu.Item>
                            <Menu.Item key="8"> <NavLink to={"/flood_chat"}>Flood Dev Chat</NavLink> </Menu.Item>
                            <Menu.Item key="8"> <NavLink to={"/ask_ai"}>Ask AI</NavLink> </Menu.Item>
                        </Menu>


                    </Sider>


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
                        </Routes>
                    </Content>


                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default AppComp;