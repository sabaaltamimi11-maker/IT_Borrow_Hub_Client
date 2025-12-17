import * as yup from 'yup';

export const DeviceSchemaValidation = yup.object().shape({

    name:yup.string().required('Device Name is Required..').min(2,'Minimum 2 characters required..'),

    serialNumber:yup.string().required('Serial Number is Required..').min(3,'Minimum 3 characters required..'),

    category:yup.string().required('Category is Required..'),

    status:yup.string().oneOf(['Available','Borrowed','Damaged'],'Invalid Status..'),

    condition:yup.string().oneOf(['Before','After'],'Invalid Condition..'),

    location:yup.string(),

    description:yup.string(),

    image:yup.string(),

});

