import React from "react";
import {FilterType, FormType} from "../redux/UsersReducer";
import {Field, Form, Formik} from "formik";
import {useSelector} from "react-redux";
import {getUsersFilterSelector} from "../redux/UsersSelectors";

type UsersSearchFormPropsType = {
    filter? : boolean | null
    onFilterChanged: (filter: FilterType) => void
}
const UsersSearchForm = React.memo((props : UsersSearchFormPropsType) => {
    const submit = (values: FormType, {setSubmitting}: { setSubmitting: (isSubmitting: boolean) => void }) => {
        //converting the values.friends into the boolean from string "true" => true (boolean) req. by the api docs.
        const filter: FilterType = {
            term: values.term as string,
            friend: values.friend === 'null' ? null : values.friend === "true" ? true : false
        }
        //Callback to send the data from form
        props.onFilterChanged(filter)
        setSubmitting(false)
    }

    return (<div>
        <h3>Find user</h3>
        <Formik
            initialValues={{term: '', friend: String(props.filter)}}
            onSubmit={submit}
        >
            {({isSubmitting }) => (
                <Form>
                    <Field type="text" name="term"/>


                    {props.filter !== undefined && ( // Conditionally render friend selection field
                        <Field name="friend" as="select">
                            <option value="null">All</option>
                            <option value="true">Only followed</option>
                            <option value="false">Only unfollowed</option>
                        </Field>
                    )}

                    <button type="submit" disabled={isSubmitting}>
                        Find
                    </button>
                </Form>
            )}
        </Formik>
    </div>)
})

const UsersSearchFormMemoComponent = React.memo(UsersSearchForm)
export default UsersSearchFormMemoComponent


