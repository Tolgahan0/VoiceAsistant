const FormData = require ('form-data');
import {withFileUpload} from 'next-multiparty'
import { createReadStream } from 'fs';
export const config={
api: {
bodyParser:false,
},
};

