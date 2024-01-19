import React from "react";
import {FilterType, FormType} from "../redux/UsersReducer";
import {Field, Form, Formik} from "formik";

const usersSearchFormValidate = (values: any) => {
    const errors = {};
    return errors
}
type UsersSearchFormPropsType = {
    onFilterChanged: (filter: FilterType) => void
}


const UsersSearchForm: React.FC<UsersSearchFormPropsType> = React.memo((props) => {
    const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
        //converting the values.friends into the boolean from string "true" => true (boolean) req. by the api docs.
        const filter: FilterType = {
            term: values.term,
            friend: values.friend === 'null' ? null : values.friend === "true" ? true : false
        }
        props.onFilterChanged(filter)
        // props.onFilterChanged(values)
        setSubmitting(false)
    }


    return (<div>
        <h3>Find user</h3>
        <Formik
            initialValues={{term: '', friend: 'null'}}
            validate={usersSearchFormValidate}
            onSubmit={submit}
        >
            {({isSubmitting}) => (
                <Form>
                    <Field type="text" name="term"/>

                    <Field name="friend" as="select">
                        <option value="null">All</option>
                        <option value="true">Only followed</option>
                        <option value="false">Only unfolowwed</option>
                    </Field>

                    <button type="submit" disabled={isSubmitting}>
                        Find
                    </button>
                </Form>
            )}
        </Formik>
    </div>)
})

export default UsersSearchForm
