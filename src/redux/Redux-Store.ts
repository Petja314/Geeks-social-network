import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {ProfileReducer} from "./ProfileReducer";
import {DialogsReducer} from "./DialogsReducer";
import {UsersReducer} from "./UsersReducer";
import {AuthReducer} from "./AuthReducer";
import thunkMiddleware from 'redux-thunk';
import {AppReducer} from "./AppReducer";
import MyPostsReducer from "./MyPostsReducer";
import {FriendsReducer} from "./FriendsReducer";
import {FloodChatReducer} from "./FloodChatReducer";
import OpenAiReducer from "./OpenAiReducer";

export type RootState = ReturnType<typeof rootReducers>
 let rootReducers = combineReducers({
    profilePage: ProfileReducer,
    messagesPage: DialogsReducer,
    usersPage: UsersReducer,
    userAuthPage : AuthReducer,
    app : AppReducer,
    myposts : MyPostsReducer,
    friendPage : FriendsReducer,
    demoChatPage : FloodChatReducer,
    openAiPage : OpenAiReducer

});

type PropertiesType<T> = T extends {[key : string] : infer U} ? U : never
export type InferActionsTypes <T extends {[key : string] : (...args : any[])=> any}> = ReturnType<PropertiesType<T>>

//@ts-ignore
// That is for REDUX DEV TOOL CHROME EXTENSION
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducers, composeEnhancers( applyMiddleware(thunkMiddleware)))

// --------------------------------------------------------------------------------------------------------

// That is just basic creation of our store
// let store = createStore(rootReducers,applyMiddleware(thunkMiddleware));
// @ts-ignore
// window.store = store

export default store;