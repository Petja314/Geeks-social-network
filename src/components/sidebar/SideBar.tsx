import React from 'react';
import {Menu} from "antd";
import {NavLink} from "react-router-dom";
import Sider from "antd/es/layout/Sider";

const SideBar = (props : any) => {
    return (
        <div>
            <Sider style={{background: props.colorBgContainer}} width={200}>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    // style={{height: '100%'}}
                    items={[
                        {
                            key: '1',
                            label: <NavLink to={"/profile"}>Profile</NavLink>,
                        },
                        {
                            key: '2',
                            label: <NavLink to={"/users"}>Users</NavLink>,
                        },
                        {
                            key: '3',
                            label: <NavLink to={"/friends"}>Friends</NavLink>,
                        },
                        {
                            key: '4',
                            label: <NavLink to={"/dialogs"}>Messenger</NavLink> ,
                        },
                        {
                            key: '5',
                            label: <NavLink to={"/news"}>News</NavLink>,
                        },
                        {
                            key: '6',
                            label: <NavLink to={"/flood_chat"}>Flood Dev Chat</NavLink>,
                        },
                        {
                            key: '7',
                            label: <NavLink to={"/ask_ai"}>Ask AI</NavLink>,
                        },
                    ]}
                />

            </Sider>

        </div>
    );
};

export default SideBar;