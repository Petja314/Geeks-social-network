import React, {useEffect} from 'react';
import './index.css';
import {Breadcrumb, Col, Layout, Menu, Row, theme} from 'antd';
import SubMenu from "antd/es/menu/SubMenu";
import {NavLink, Route, Routes} from "react-router-dom";
import Users from "./components/users/Users";
import Login from "./components/login/Login";
import HeaderContainer from "./components/header/HeaderContainer";
import {useDispatch, useSelector} from "react-redux";
import {initializeApp} from "./components/redux/AppReducer";
import ChatPage from "./components/pages/chat/ChatPage";
import EffectTestComponent from "./components/pages/chat/EffectTestComponent";
import DemoChat from "./components/pages/chat/DemoChat";
import Friends from "./components/friends/Friends";
import ProfileContainer from "./components/profile/profileinfo/ProfileContainer";
import Dialogs from "./components/dialogs/Dialogs";
import DialogsContainer from "./components/dialogs/DialogsContainer";

const {Header, Content, Footer, Sider} = Layout;

const AppComp = () => {


    const dispatch: any = useDispatch();
    useEffect(() => {
        dispatch(initializeApp());
    }, [dispatch]);

    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

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

                            <SubMenu key="sub1" title="My Profile">
                                <Menu.Item key="1"> <NavLink to={"/profile"}>Profile</NavLink> </Menu.Item>
                                <Menu.Item key="2"> <NavLink to={"/users"}>Users</NavLink> </Menu.Item>
                                <Menu.Item key="3"> <NavLink to={"/friends"}>Friends</NavLink> </Menu.Item>
                                <Menu.Item key="4"> <NavLink to={"/dialogs"}>Dialogs</NavLink> </Menu.Item>
                                <Menu.Item key="5"> <NavLink to={"/dialogscontainer"}>Container Dialogs</NavLink> </Menu.Item>

                            </SubMenu>

                            <SubMenu key="sub3" title="Chat Websocket">
                                <Menu.Item key="22"> <NavLink to={"/chat"}>ChatPage</NavLink> </Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub4" title="UseEffect Test">
                                <Menu.Item key="23"> <NavLink to={"/effect"}>TestUseEffect</NavLink> </Menu.Item>
                            </SubMenu>

                            <SubMenu key="sub4" title="Demo Chat Websocket">
                                <Menu.Item key="24"> <NavLink to={"/demochat"}>Demo Chat</NavLink> </Menu.Item>
                            </SubMenu>
                        </Menu>


                    </Sider>


                    <Content style={{padding: '0 24px', minHeight: 280}}>
                        <Routes>
                            <Route path="/profile/:id?" element={<ProfileContainer/> } />
                            <Route path="/users" element={<Users/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/friends" element={<Friends/>} />
                            <Route path="/dialogs" element={<Dialogs/>}/>
                            <Route path="/dialogscontainer/:id?" element={<DialogsContainer/>}/>




                            <Route path="/chat" element={<ChatPage/>}/>
                            <Route path="/effect" element={<EffectTestComponent/>}/>
                            <Route path="/demochat" element={<DemoChat/>}/>
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