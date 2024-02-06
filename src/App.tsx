import React, {lazy} from 'react';
import './css/app.css';
import './index'
// import Navbar from "./components/navbar/Navbar";
import {Routes, Route, useParams} from "react-router-dom";
// import { store} from "./components/redux/Store";
import HeaderContainer from "./components/header/HeaderContainer";
import {connect} from "react-redux";
import {compose} from "redux";
import {initializeApp} from "./redux/AppReducer"
import Preloader from "./common/preloader/Preloader";
import { useLocation, useNavigate} from 'react-router-dom';
import Users from "./components/users/Users";
import Login from "./components/login/Login";
import {Button} from "antd";



//REACT LAZY LOADING + HOC
// const ProfileContainer = lazy(() =>  import("./components/profile/ProfileContainer"))
// let LazyProfileContainer = ReactLazyWrappedHOC(ProfileContainer)
// const DialogsContainer = lazy(() =>  import("./components/dialogs/dialogitem/DialogsContainer"))

export const withRouter = (Component: any) => {
    function ComponentWithRouterProp(props: any) {
        console.log('ComponentWithRouterProp' , props)
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }
    return ComponentWithRouterProp;
}
type MapPropsType = ReturnType<typeof mapStateToProps>
type DispatchPropsType = {
    initializeApp : () => void
}
class App extends React.Component<MapPropsType & DispatchPropsType>{
    componentDidMount() {
        this.props.initializeApp()
    }

    render() {
        if (!this.props.initialized) {
            return <Preloader isFetching/>
        }
        // const state = store.getState()
        return (
            <div className="app-wrapper container">
                <HeaderContainer/>
                {/*<Navbar data={state.cat_profile} state={state.sideBar}/>*/}

                <div className="app-wrapper-content">
                    <Button type={"primary"} >404 NOT FOUND</Button>
                    <Routes>
                        {/*<Route path="/profile/:id?"*/}
                        {/*       element={*/}
                        {/*           <LazyProfileContainer/>*/}
                        {/*       }*/}
                        {/*/>*/}
                        <Route path="/users" element={<Users/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>

                </div>
            </div>
        );
    }
}
type MapStateType = {
    initialized : boolean
}
type MapDispatchType = {
    initializeApp : () => void
}
let mapStateToProps = (state: any) => ({
    initialized : state.app.initialized
});

export default compose(
    withRouter,
    connect<MapStateType,MapDispatchType>(mapStateToProps, {initializeApp}))(App)


