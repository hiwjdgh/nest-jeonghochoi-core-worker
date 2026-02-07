import { REGEX } from './regex.js';

export const validate = {
    email: (v: string) => REGEX.email.test(v),
    phoneKR: (v: string) => REGEX.phoneKR.test(v),
    uuid: (v: string) => REGEX.uuidV4.test(v),
    transactionId: (v: string) => REGEX.transactionId.test(v),
};
