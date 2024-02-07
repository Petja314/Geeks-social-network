import React from "react";
import {FilterType, FormType} from "../../redux/UsersReducer";
import {Field, Form, Formik} from "formik";
import "../../css/formik.css"

type UsersSearchFormPropsType = {
    filter?: boolean | null
    onFilterChanged: (filter: FilterType) => void
}
const UsersSearchForm = React.memo((props: UsersSearchFormPropsType) => {
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
            {({isSubmitting}) => (
                <Form className="formik_container" >
                    <Field type="text" name="term" placeholder="type user name..." />


                    {props.filter !== undefined && ( // Conditionally render friend selection field
                        <div  className="custom-select-container">
                            <Field name="friend" as="select" className="formik-select">
                                <option value="null">All</option>
                                <option value="true">Only followed</option>
                                <option value="false">Only unfollowed</option>
                            </Field>
                        </div>

                    )}
                    <div style={{marginTop : "5px"}} >
                        <button type="submit" disabled={isSubmitting}>
                            Find
                        </button>
                    </div>

                </Form>
            )}
        </Formik>
    </div>)
})

const UsersSearchFormMemoComponent = React.memo(UsersSearchForm)
export default UsersSearchFormMemoComponent


