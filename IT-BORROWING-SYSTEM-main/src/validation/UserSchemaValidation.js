import * as yup from 'yup';

export const UserSchemaValidation = yup.object().shape({

    email:yup.string().email('Not a Valid Email Format!!').required('Email is Required..'),

    password:yup.string()
        .required('Password is Required..')
        .test('min-length', 'Password should be at least 8 characters..', function(value) {
            // Skip min validation if value is empty/null/undefined (let required handle it)
            if (!value || value.trim().length === 0) {
                return true;
            }
            return value.length >= 8;
        }),

});

export const RegisterSchemaValidation = yup.object().shape({

    username:yup.string().required('Username is Required..').min(3,'Minimum 3 characters required..'),

    email:yup.string().email('Not a Valid Email Format!!').required('Email is Required..'),

    password:yup.string()
        .required('Password is Required..')
        .test('min-length', 'Password should be at least 8 characters..', function(value) {
            // Skip min validation if value is empty/null/undefined (let required handle it)
            if (!value || value.trim().length === 0) {
                return true;
            }
            return value.length >= 8;
        }),

    confirmPassword:yup.string().required('Password Confirmation is Required..').oneOf([yup.ref('password')],'Passwords do not match..'),

    role:yup.string().oneOf(['Staff','Student','Admin'],'Invalid Role..'),

});

export const UpdateUserSchemaValidation = yup.object().shape({

    username:yup.string().min(3,'Minimum 3 characters required..'),

    email:yup.string().email('Not a Valid Email Format!!'),

    role:yup.string().oneOf(['Staff','Student','Admin'],'Invalid Role..'),

    status:yup.string().oneOf(['Active','Suspended'],'Invalid Status..'),

});

