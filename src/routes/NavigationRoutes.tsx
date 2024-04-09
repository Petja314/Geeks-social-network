import React, {ReactElement} from 'react';
import ProfileContainer from "../components/profile/profileinfo/ProfileContainer";
import AskOpenAi from "../components/openAi/AskOpenAi";
import UsersContainer from "../components/users/UsersContainer";
import Login from "../components/login/Login";
import Friends from "../components/friends/FriendsContainer";
import DialogsContainer from "../components/dialogs/DialogsContainer";
import News from "../components/news/News";
import FloodChat from "../components/flood_chat/FloodChat";
import PageNotFound from "../components/404/PageNotFound";

/** Route navigation map */
export const navigationRoutes : NavigationRoutesType[] = [
    {path: "/",                 element : <ProfileContainer/>,      name: "Profile"},
    {path: "/profile/:id?",     element : <ProfileContainer/>,      name: "Profile"},
    {path: "/ask_ai",           element : <AskOpenAi/>,             name: "AskOpenAi"},
    {path: "/users",            element : <UsersContainer/>,        name: "Users"},
    {path: "/login",            element : <Login/>,                 name: "Login"},
    {path: "/friends",          element : <Friends/>,               name: "Friends"},
    {path: "/dialogs/:id?",     element : <DialogsContainer/>,      name: "Dailogs"},
    {path: "/news",             element : <News/>,                  name: "News"},
    {path: "/flood_chat",       element : <FloodChat/>,             name: "FloodChat"},
    {path: "*",                 element : <PageNotFound/>,          name: "404"},
]

export type NavigationRoutesType = {
    path: string,
    element : ReactElement,
    name: string,

}