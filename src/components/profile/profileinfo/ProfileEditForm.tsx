import React from 'react';
import {ContactsType, ProfileDataType, saveProfileThunk} from "../../../redux/ProfileReducer";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {useDispatch, useSelector} from "react-redux";
import "../../../css/profile/profile_edit.css"


type ProfileDataFormProps = {
    initialValues: ProfileDataType;
    isOwner: boolean;
    setEditMode: (value: boolean) => void
    activateEditMode : () => void
};

export const ProfileEditForm = (props: ProfileDataFormProps) => {
    const dispatch: any = useDispatch()
    const fieldsErrors = useSelector((state: any) => state.profilePage.error)
    const handleSubmit = async (values: ProfileDataType, {setFieldError, setSubmitting}: FormikHelpers<ProfileDataType>) => {
        try {
            values.contacts = Object.fromEntries(
                Object.entries(values.contacts ?? {}).map(([key, value]) => [
                    key,
                    value?.toLowerCase() || '',
                ])
            ) as ContactsType;
            await dispatch(saveProfileThunk(values));
            // If successful, you can perform additional actions if needed
            props.setEditMode(false);
        } catch (error: any) {
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <Formik
            enableReinitialize={true}
            initialValues={props.initialValues}
            onSubmit={handleSubmit}
        >
            <Form>
                <div className="profile_list_section">
                    <ul>
                        <li>
                            <span>Full name : </span>
                            <Field
                                name="fullName"
                                component="input"
                                placeholder="Full name"
                            />
                        </li>

                        <li>
                            <span>Am I looking for a job</span>
                            <Field
                                name="lookingForAJob"
                                type="checkbox"
                                component="input"
                                placeholder="Am I looking for a job"
                            />
                        </li>
                        <li>
                            <span>My professional skills:</span>
                            <Field
                                name="lookingForAJobDescription"
                                component="textarea"
                                placeholder="My professional skills"
                            />
                        </li>
                        <li>
                            <span>About me</span>
                            <Field
                                name="aboutMe"
                                component="textarea"
                                placeholder="About me"
                            />
                        </li>

                        <li>Contacts:{Object.keys(props.initialValues.contacts).map(key => (
                            <div key={key}>
                                <span>{key} : </span>
                                <Field
                                    name={`contacts.${key}`}
                                    component="input"
                                    placeholder={key}
                                />
                                {fieldsErrors &&
                                    fieldsErrors.map((item: any) => item.toLowerCase().includes(key) ?
                                        <span style={{color: "red", fontWeight: "bold"}}>{item} , please type correct link : example.com </span> : null)
                                }
                            </div>
                        ))} </li>


                    </ul>
                </div>
                <div className="edit_form_btn">
                    {props.isOwner && (
                        <div>
                            <button type="submit">Save</button>
                        </div>
                    )}

                    <div>
                        <button onClick={props.activateEditMode} >
                            Close
                        </button>
                    </div>
                </div>
            </Form>
        </Formik>

    );
};

