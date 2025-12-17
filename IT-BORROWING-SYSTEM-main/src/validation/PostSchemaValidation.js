import * as yup from 'yup';

export const PostSchemaValidation = yup.object().shape({

    deviceId:yup.string().required('Device ID is Required..'),

    userId:yup.string().required('User ID is Required..'),

    text:yup.string().required('Review Text is Required..').min(10,'Minimum 10 characters required..'),

    rating:yup.number().required('Rating is Required..').min(1,'Minimum rating is 1..').max(5,'Maximum rating is 5..'),

    image:yup.string(),

});

export const UpdatePostSchemaValidation = yup.object().shape({

    text:yup.string().min(10,'Minimum 10 characters required..'),

    rating:yup.number().min(1,'Minimum rating is 1..').max(5,'Maximum rating is 5..'),

    image:yup.string(),

});

