import React from "react";
import styles from "./FormsControls.module.css"
interface CommonInputProps {
    name?: string;
    onBlur?: (event: React.FocusEvent) => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface TextareaProps {
    input: CommonInputProps;
    meta: {
        touched?: boolean;
        active?: boolean;
        error?: any;
    };
    placeholder?: string;
    children? : any
}
export const FormControl : React.FC<Partial<TextareaProps>> = ({input, meta,...props}) => {
    const hasError =  meta?.touched && meta.error
    return (

        <div  className={styles.formControl + " " + ( hasError ? styles.error : "")} >
            <div>
                {props.children}
            </div>
            { hasError && <span>{meta.error}</span> }
        </div>
    )
}

export const Input = (props : any) => {
   const {input, meta, child,  ...restProps} = props;
    return <FormControl  {...props} > <input {...input} {...restProps}/> </FormControl>
}
export const Textarea = (props : any) => {
   const {input, meta, child,  ...restProps} = props;
    return <FormControl  {...props} > <textarea {...input} {...restProps}/> </FormControl>
}

type FormikTypes = {
    field: any, form: any
}
export const MyInput = ({field, form, ...props}: FormikTypes) => {
    return <input {...field}
                  {...props}
    />;
};

