import * as Unique from './unique/index.js';
import * as Validation from './validation/index.js';
import * as StringUtil from './string/index.js';
import * as Time from './time/index.js';
import * as Random from './random/index.js';
import * as Array from './array/index.js';
import * as Object from './object/index.js';
import * as Result from './result/index.js';

export class Tool {
    static unique = Unique;
    static validate = Validation.validate;
    static string = StringUtil;
    static time = Time;
    static random = Random;
    static array = Array;
    static object = Object;
    static result = Result;
}
