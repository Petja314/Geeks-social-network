import React, {useEffect} from 'react';
import {Input} from "../common/forms_controls/FormsControls";
import {requiredField} from "../utils/validators/Validators";
import {connect, useDispatch, useSelector} from "react-redux";
import {captchaThunk, login} from "../redux/AuthReducer";
import {Navigate} from "react-router-dom";
import {Field, Form, Formik, FormikHelpers, FormikProps} from "formik";
// @ts-ignore
import Cookie from "js.cookie";


// export type IProps = {
//     captchaUrl: string | null
// }
// // const LoginForm: React.FC<InjectedFormProps<LoginPropsType> & IProps> = ({captchaUrl, handleSubmit, error,}) => {
// const LoginForm: React.FC<FormProps<LoginPropsType> & IProps> = ({captchaUrl, handleSubmit, error,}) => {
//     return (
//         <Form onSubmit={handleSubmit}>
//             <div>
//                 <Field
//                     // validate={[requiredField]}
//                     placeholder={"Email"}
//                     name="email"
//                     component={Input}
//                     type="login"/>
//             </div>
//             <div>
//                 <Field
//                     // validate={[requiredField]}
//                     placeholder={"Password"}
//                     name="password"
//                     component={Input}
//                     type="password"/>
//             </div>
//
//             <div>
//                 <Field
//                     placeholder={"rememberMe"}
//                     name="rememberMe"
//                     component={Input}
//                     type="checkbox"/>remember me
//             </div>
//
//
//             <div>
//                 <button type="submit">Login</button>
//             </div>
//             <div style={{color: "red"}}>
//                 {error}
//             </div>
//
//
//             {captchaUrl &&
//                 <img src={captchaUrl} alt="Captcha"/>
//             }
//             {captchaUrl &&
//                 <Field
//                     placeholder={"Captcha"}
//                     name="captcha"
//                     component={Input}
//                     type="text"
//                 />
//             }
//
//         </Form>
//     );
// };
//
// // const LoginReduxForm = reduxForm({form: 'login'})(LoginForm)
//
// const LoginReduxForm = connect()(LoginForm)
//
// type LoginPropsType = {
//     captchaUrl: null,
//     isAuth: boolean,
//     login: any
// }
// type formDataType = {
//     email: string,
//     password: string,
//     rememberMe: boolean
//     captcha:  null
// }
// export  const Login = () => {
//     const isAuth = useSelector((state: any) => state.userAuthPage.isAuth)
//     const captchaUrl = useSelector((state: any) => state.userAuthPage.captchaUrl)
//     const dispatch : any = useDispatch()
//
//     const onSubmit = (formData: formDataType) => {
//         dispatch(login(formData.email, formData.password, formData.rememberMe, formData.captcha))
//
//         // props.login(formData.email, formData.password, formData.rememberMe, formData.captcha)
//     }
//
//     if (isAuth) {
//         return <Navigate to={"/profile"}/>
//     }
//     return (
//         <>
//             <h1>Login</h1>
//             <LoginReduxForm
//                 onSubmit={onSubmit}
//                 captchaUrl={captchaUrl}
//             />
//         </>
//     );
// }
// type MapStateType = {
//     isAuth: boolean,
//     captchaUrl: null
// }
// type MapDispatchType = {
//     login: (email: string, password: string, rememberMe: boolean, captcha: any) => void
// }
// let mapStateToProps = (state: any) => ({
//     isAuth: state.userAuthPage.isAuth,
//     captchaUrl: state.userAuthPage.captchaUrl,
//
// })
//
// export default connect<MapStateType, MapDispatchType>(mapStateToProps, {login})(Login);

//------------------------------------------------------------------------------------------


// type IProps = {
//     captchaUrl: string | null;
// };
//
// type LoginFormValues = {
//     email: string;
//     password: string;
//     rememberMe: boolean;
//     captcha: any
// };
//
// export const Login: React.FC<any> = () => {
//     const dispatch: any = useDispatch();
//
//     const isAuth = useSelector((state: any) => state.userAuthPage.isAuth);
//     const captchaUrl = useSelector((state: any) => state.userAuthPage.captchaUrl);
//
//     if (isAuth) {
//         return <Navigate to="/profile"/>;
//     }
//
//
//     const initialValues: LoginFormValues = {
//         email: '',
//         password: '',
//         rememberMe: false,
//         captcha: null
//     };
//
//     // const onSubmit = async (
//     //     values: LoginFormValues,
//     //     formikHelpers: FormikHelpers<LoginFormValues>
//     // ) => {
//     //     alert('hi')
//     //     await dispatch(login(values.email, values.password, values.rememberMe, values.captcha));
//     //     formikHelpers.resetForm();
//     // };
//
//     const handleSubmit = () => {
//         alert('hooo')
//     }
//
//     return (
//         <div>
//             <h1>LOGIN</h1>
//
//             <Formik
//                 initialValues={initialValues}
//                 onSubmit={handleSubmit}
//             >
//                 <Form>
//                     <div>
//                         <Field
//                             validate={requiredField}
//                             placeholder="Email"
//                             name="email"
//                             component={Input}
//                             type="text"
//                         />
//                     </div>
//                     <div>
//                         <Field
//                             validate={requiredField}
//                             placeholder="Password"
//                             name="password"
//                             component={Input}
//                             type="password"
//                         />
//                     </div>
//
//                     <div>
//                         <Field
//                             placeholder="rememberMe"
//                             name="rememberMe"
//                             component={Input}
//                             type="checkbox"
//                         />
//                         Remember me
//                     </div>
//
//                     <div>
//                         <button type="submit">Login</button>
//                     </div>
//
//                     <div style={{color: 'red'}}>
//                         {captchaUrl && <img src={captchaUrl} alt="Captcha"/>}
//                         {captchaUrl && (
//                             <Field
//                                 validate={requiredField}
//                                 placeholder="Captcha"
//                                 name="captcha"
//                                 component={Input}
//                                 type="text"
//                             />
//                         )}
//                     </div>
//                 </Form>
//             </Formik>
//
//         </div>
//     );
// };

type FormikTypes = {
    field: any, form: any
}
export const MyInput = ({field, form, ...props}: FormikTypes) => {
    return <input {...field}
                  {...props}
    />;
};


const Login = () => {
    const dispatch: any = useDispatch()
    const isAuth = useSelector((state: any) => state.userAuthPage);
    // console.log(isAuth.captchaUrl)
    if (isAuth.isAuth) {
        return <Navigate to={"/users"}/>
    }
    const storedEmail = Cookie.get('email') || '';
    const storedPassword = Cookie.get('password') || '';
    const handleSubmit = async (values: any, submitProps: any) => {
        const {email, password, rememberMe, captcha} = values;
        dispatch(login(email, password, rememberMe, captcha));
        submitProps.resetForm();

        Cookie.set('email', email);
        Cookie.set('password', rememberMe ? password : '');
    };
    return (
        <div>
            <h1>Login Form</h1>
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
                        <div>
                            <label htmlFor="email">Email</label>
                            <div>
                                <Field type="email" name="email" placeholder="email" component={MyInput}/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <div>
                                <Field type="password" name="password" placeholder="password" component={MyInput}/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="checkbox">Remember Me</label>
                            <div>
                                <Field type="checkbox" name="checkbox" placeholder="remember me" component={MyInput}/>

                            </div>
                        </div>

                        <button type="submit">Submit</button>

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
    );
};
export default Login