import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loginThunk} from "../../redux/AuthReducer";
import {Navigate} from "react-router-dom";
import {Field, Form, Formik, FormikProps} from "formik";
// @ts-ignore
import Cookie from "js.cookie";
import {ThunkDispatch} from "redux-thunk";
import {RootState} from "../../redux/Redux-Store";
import "../../css/login/login.css"
import LoginReadMe from "./LoginReadMe";

type FormikTypes = {
    field: any, form: any
}
export const MyInput = ({field, form, ...props}: FormikTypes) => {
    return <input {...field}
                  {...props}
    />;
};


const Login = () => {
    const dispatch: ThunkDispatch<RootState, void, any> = useDispatch()
    const isAuth = useSelector((state: RootState) => state.userAuthPage);
    // console.log(isAuth.captchaUrl)
    if (isAuth.isAuth) {
        return <Navigate to={"/users"}/>
    }
    const handleSubmit = async (values: any, submitProps: any) => {
        const {email, password, rememberMe, captcha} = values;
        dispatch(loginThunk(email, password, rememberMe, captcha));
        submitProps.resetForm();

        Cookie.set('email', email);
        Cookie.set('password', rememberMe ? password : '');
    };
    return (
        <div className="login_container">
            <div className="login_section">
                <div className="login_form_fields">
                    <Formik
                    enableReinitialize
                    initialValues={{
                        // email: storedEmail,
                        // password: storedPassword,
                        email: '',
                        password: '',
                        checkbox: false,
                        captcha: ''
                    }}
                    onSubmit={handleSubmit}
                >
                    {(props: FormikProps<any>) => (
                        <Form>

                                <h1 className="login_title">Login Form</h1>

                                <div>
                                    <label htmlFor="email">Email</label>
                                    <div>
                                        <Field type="email" name="email" placeholder="Email" component={MyInput}/>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password">Password</label>
                                    <div>
                                        <Field type="password" name="password" placeholder="Password" component={MyInput}/>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="checkbox">Remember Me</label>
                                    <div>
                                        <Field type="checkbox" name="checkbox" placeholder="remember me" component={MyInput}/>

                                    </div>
                                </div>

                                <button type="submit">Login</button>
                                {props.status && props.status.error && (
                                    <div style={{color: 'red', marginTop: '10px'}}>{props.status.error}</div>
                                )}
                                {/*//CAPTCHA*/}
                                <div>
                                    {isAuth.captchaUrl && (
                                        <div>
                                            <img src={isAuth.captchaUrl} alt="captcha"/>
                                            <Field type="text" name="captcha" placeholder="Type text from image" component={MyInput}/>
                                        </div>
                                    )}
                                </div>


                        </Form>
                    )}
                </Formik>
                </div>



                <LoginReadMe/>


            </div>

        </div>
    );
};

const LoginMemoComponent = React.memo(Login)
export default LoginMemoComponent
