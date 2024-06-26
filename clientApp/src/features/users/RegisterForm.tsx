import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import * as Yup from 'yup';
import ValidationError from "../Errors/ValidationError";

export default observer(function RegisterForm() {
    const {userStore} = useStore();
    
    return (
        <Formik
            initialValues={{ displayName:'', userName:'', email: '', password: '', error: null }}
            onSubmit={(values, {setErrors}) => {userStore.register(values).catch((error) => 
                setErrors({error}));}}
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                userName: Yup.string().required(),
                email: Yup.string().required().email(),
                password: Yup.string()
                    .required('Password must be complex')
                    .min(6, 'Password must be at least 6 characters')
                    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, 'Password must have One Uppercase, One Lowercase, One Number character')
            })}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Sign up to Dairy' color='teal' textAlign='center' />
                    <MyTextInput placeholder='Display Name' name='displayName' />
                    <MyTextInput placeholder='User Name' name='userName' />
                    <MyTextInput placeholder='Email' name='email' />
                    <MyTextInput placeholder='Password' name='password' type='password' />    
                    <ErrorMessage name='error' render={() => 
                            <ValidationError errors={errors.error as unknown as string[]}/>
                        }
                    />
                    <Button 
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting} 
                        positive type="submit" 
                        content='Register' fluid />
                </Form>
            )}
        </Formik>
)})