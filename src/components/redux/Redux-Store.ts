import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import {ProfileReducer} from "./ProfileReducer";
import {DialogsReducer} from "./DialogsReducer";
import {UsersReducer} from "./UsersReducer";
import {MusicReducer} from "./MusicReducer";
import {AuthReducer} from "./AuthReducer";
import thunkMiddleware from 'redux-thunk';
// import { reducer as formReducer} from 'redux-form';
import {AppReducer} from "./AppReducer";
import ChatReducer from "./ChatReducer";
import MyPostsReducer from "../profile/myposts/MyPostsReducer";

export type RootState = ReturnType<typeof rootReducers>
 let rootReducers = combineReducers({
    profilePage: ProfileReducer,
    messagesPage: DialogsReducer,
    usersPage: UsersReducer,
    musicPage: MusicReducer,
    userAuthPage : AuthReducer,
    app : AppReducer,
    chat : ChatReducer,
    myposts : MyPostsReducer
    // form : formReducer
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