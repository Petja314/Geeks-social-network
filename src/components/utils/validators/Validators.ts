

export const requiredField = (values  : any )   => {
    if (!values) {
        return 'Field is required';
    }
    return undefined; // No error message when validation passes

};

export const maxLengthCreator = (maxLength : number) => (values : string) => {
    if (values && values.length > maxLength) {
        return `Max length is ${maxLength} symbols`;
    }
    return undefined; // No error message when validation passes
}

