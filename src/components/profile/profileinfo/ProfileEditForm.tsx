import React, {useState} from 'react';
import { MyInput} from '../../common/forms_controls/FormsControls';
import {ProfileDataType, saveProfileThunk} from "../../redux/ProfileReducer";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {useDispatch} from "react-redux";

type ProfileDataFormProps = {
    initialValues: ProfileDataType;
    isOwner: boolean;
    setEditMode : (value : boolean) => void
};

export const ProfileEditForm = (props: ProfileDataFormProps) => {
    const dispatch : any = useDispatch()
    const [error,setError] = useState<string>("")

    //Sending new data from formik to thunk to update the state
    const handleSubmit = async (values: ProfileDataType, { setFieldError, setSubmitting }: FormikHelpers<ProfileDataType>) => {
        try {
            await dispatch(saveProfileThunk(values));
            // If successful, you can perform additional actions if needed
            props.setEditMode(false);
        } catch (error : any) {
            // Handle the error and set a field error for formWideError
            setFieldError("formWideError", error.message);
            setError(error.message)
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <Formik
            enableReinitialize
            initialValues={props.initialValues}
            onSubmit={handleSubmit}

        >
            <Form >

                {props.isOwner && (
                    <div>
                        <button type="submit">Save</button>
                    </div>
                )}



                <ul style={{listStyle: 'none'}}>
                    <li>
                        <b>Full name : </b>
                        <Field
                            name="fullName"
                            component={MyInput}
                            placeholder="Full name"
                        />
                    </li>

                    <li>
                        <b>Am I looking for a job</b>
                        <Field
                            name="lookingForAJob"
                            type="checkbox"
                            component={MyInput}
                            placeholder="Am I looking for a job"
                        />
                    </li>
                    <li>
                        <b>My professional skills:</b>
                        <Field
                            name="lookingForAJobDescription"
                            component="textarea"
                            placeholder="My professional skills"
                        />
                    </li>
                    <li>
                        <b>About me</b>
                        <Field
                            name="aboutMe"
                            component="textarea"
                            placeholder="About me"
                        />
                    </li>
                    {error && <div style={{color : "red",fontWeight : "bold"}} >{error} -
                        <div>
                            Please type the link in right format : example.com
                        </div>  </div>}
                    <li>Contacts:{Object.keys(props.initialValues.contacts).map(key => (
                        <div key={key}>
                            <b>{key} : </b>
                            <Field
                                name={`contacts.${key}`}
                                component={MyInput}
                                placeholder={key}
                            />
                        </div>
                    ))} </li>
                </ul>
            </Form>
        </Formik>

    );
};

