import React from 'react';
import {NavLink} from "react-router-dom";
import "../../css/app.css"
import "../../css/sidebar/sidebar.css"

const SideBar = () => {
    return (
        <div className="sidebar">
                <ul className="sidebar_list" >
                    <li><NavLink to={"/profile"}>Profile</NavLink></li>
                    <li><NavLink to={"/users"}>Users</NavLink></li>
                    <li><NavLink to={"/ask_ai"}>Ask AI</NavLink></li>
                    <li><NavLink to={"/friends"}>Friends</NavLink></li>
                    <li><NavLink to={"/dialogs"}>Messenger</NavLink></li>
                    <li><NavLink to={"/news"}>News</NavLink></li>
                    <li><NavLink to={"/flood_chat"}>Flood Dev Chat</NavLink></li>
                </ul>
        </div>
    );
};
export default SideBar;