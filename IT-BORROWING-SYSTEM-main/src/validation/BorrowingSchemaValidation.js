import * as yup from 'yup';

export const BorrowingSchemaValidation = yup.object().shape({

    deviceId:yup.string().required('Device ID is Required..'),

    userId:yup.string().required('User ID is Required..'),

    returnDate:yup.date().required('Return Date is Required..').min(new Date(),'Return Date must be in the future..'),

    conditionBefore:yup.string().required('Device Condition Before Borrowing is Required..').min(3,'Minimum 3 characters required..'),

});

export const UpdateBorrowingSchemaValidation = yup.object().shape({

    status:yup.string().oneOf(['Pending','Active','Returned','Overdue'],'Invalid Status..'),

    conditionAfter:yup.string(),

    fine:yup.number().min(0,'Fine must be positive number..'),

    notes:yup.string(),

});

