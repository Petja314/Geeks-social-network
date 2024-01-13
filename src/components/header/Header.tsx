import header_classes from "./Header.module.css"
import React from "react";
import "../../App.css";
import {NavLink} from "react-router-dom";
import {Button, Col, Menu, Row} from "antd";
import Avatar from "antd/es/avatar/avatar";
import {UserOutlined} from "@ant-design/icons";
import {Header} from "antd/es/layout/layout";
import {inspect} from "util";
// import styles = module

export type HeaderPropsType = {
    isAuth? : boolean,
    login?  : string,
    logout? : () => void
}

function HeaderComponent(props : HeaderPropsType) {



    return (
        <div>

            <Header style={{ display: "flex", alignItems: "center" }}>
                <Row justify="space-between" align="middle" style={{ flex: 1 }}>
                    <Col span={18}>
                        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                            <Menu.Item key="1">
                                <NavLink to={"/users"}>Developers</NavLink>
                            </Menu.Item>
                        </Menu>
                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        {props.isAuth ? (
                            <>
                                <Avatar shape="square" icon={<UserOutlined />} style={{ backgroundColor: "#f56a00" }} />
                                <Button onClick={props.logout} >
                                    {props.login} - Log out
                                </Button>
                            </>
                        ) : (
                            <Button>
                                <NavLink to={"/login"}>Login</NavLink>
                            </Button>
                        )}
                    </Col>
                </Row>
            </Header>

        </div>

        // <header className={header_classes.header}>
        //     <div className={header_classes.header_container}>
        //         <div className={header_classes.header_main_image}>
        //             <img src="https://f.hubspotusercontent30.net/hubfs/2235233/blog-import/2020/20-08-Aug/sm-icons-facebook-logo.png" alt=""/>
        //         </div>
        //         <div className={header_classes.header_searchbar}>
        //             <input type="text" placeholder="Search Facebook"/>
        //         </div>
        //
        //         { props.isAuth
        //             ? <div>{props.login} - <button onClick={props.logout}>Log out</button></div>
        //             : <NavLink to={"/login"}> Login  </NavLink>}
        //     </div>
        // </header>
    )
}

export default HeaderComponent;