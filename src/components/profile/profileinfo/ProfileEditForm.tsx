import React, {useEffect, useState} from 'react';
import {actionsProfile, ProfileDataType, saveProfileThunk} from "../../../redux/ProfileReducer";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {useDispatch, useSelector} from "react-redux";
import {MyInput} from "../../login/Login";

type ProfileDataFormProps = {
    initialValues: ProfileDataType;
    isOwner: boolean;
    setEditMode: (value: boolean) => void
};

export const ProfileEditForm = (props: ProfileDataFormProps) => {
    const dispatch: any = useDispatch()
    const fieldsErrors = useSelector((state: any) => state.profilePage.error)

    const handleSubmit = async (values: ProfileDataType, {setFieldError, setSubmitting}: FormikHelpers<ProfileDataType>) => {
        try {
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

                    <li>Contacts:{Object.keys(props.initialValues.contacts).map(key => (
                        <div key={key}>
                            <b>{key} : </b>
                            <Field
                                name={`contacts.${key}`}
                                component={MyInput}
                                placeholder={key}
                            />
                            {fieldsErrors &&
                                fieldsErrors.map((item: any) => item.toLowerCase().includes(key) ?
                                    <span style={{color: "red", fontWeight: "bold"}}>{item} , please type correct link : example.com </span> : null)
                            }
                        </div>
                    ))} </li>


                </ul>
            </Form>
        </Formik>

    );
};

