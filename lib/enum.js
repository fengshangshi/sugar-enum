/**
 * @file 枚举类
 * @author ss
*/
import typeUtil from 'sugar-type';
import Member from './member';

import { FLAG, INIT, ERROR, REGEXP, LENGTH } from './config';

export default class Enum {
  constructor() {
    this.__enums = {};
    this.__pointer = INIT.START;

    const length = arguments.length;
    switch (length) {
      case LENGTH.ZERO:
        // 异常
        throw new Error(ERROR.NOTFOUNDPARAM);
        break;
      
      case LENGTH.ONE:
        // 数组 or 字符串 or 对象
        const props = arguments[0];
        const type = typeUtil.inspect(props);

        switch (type) {
          case 'string':
            this.__enums = Object.assign(this.__enums, this.makeSingleStringToMember(props));
            break;

          case 'array':
            this.__enums = Object.assign(this.__enums, this.makeSingleArrayToMember(props));
            break;

          case 'object':
            this.__enums = Object.assign(this.__enums, this.makeObjectToMember(props));
            break;

          default:
            throw new Error(ERROR.PARAMTYPEERROR);
        }
        break;

      case LENGTH.TWO:
        // 数组 or 字符串
        const keys = arguments[0];
        const values = arguments[1];

        var isAllArray = typeUtil.isArray(keys) && typeUtil.isArray(values);
        var isAllString = typeUtil.isString(keys) && typeUtil.isString(values);

        let flag = FLAG.ISZERO;
        if (isAllArray) flag = FLAG.ISARRAY;
        if (isAllString) flag = FLAG.ISSTRING;

        switch (flag) {
          case FLAG.ISARRAY:
            this.__enums = Object.assign(this.__enums, this.makeMultiArrayToMember(keys, values));
            break;
          
          case FLAG.ISSTRING:
            this.__enums = Object.assign(this.__enums, this.makeMultiStringToMember([keys, values]));
            break;
          
          default:
            throw new Error(ERROR.PARAMTYPEERROR);
        }

        break;
      
      default:
        // 全是字符串
        const argsToArray = Array.prototype.slice.apply(arguments);
        var isAllString= argsToArray.every(item => typeUtil.isString(item));
        if (!isAllString) throw new Error(ERROR.PARAMTYPEERROR);

        this.__enums = Object.assign(this.__enums, this.makeMultiStringToMember(argsToArray));
    }

    return this.freezeEnums(this.__enums);
  }

  validateValue(value) {
    // 存在可以转成Number的值，并且该值要大于内部指针的值
    if (!isNaN(Number(value))) {
      value = +value;
      if (this.__pointer < +value) {
        this.__pointer = +value;
      }
    }

    // 未传入值，采用内部指针的值
    if (typeUtil.isUndefined(value)) {
      value = ++this.__pointer;
    }

    return value;
  }

  makeMember(key, value) {
    return new Member(key, value).toString();
  }

  makeSingleStringToMember(props) {
    const isQualified = REGEXP.KEY2VALUE.test(props);
    if (!isQualified) throw new Error(ERROR.PARAMTYPEERROR);

    const execResult = REGEXP.KEY2VALUE.exec(props);
    const key = execResult[1];
    const value = this.validateValue(execResult[3]);

    // 字符串类型的值，不对指针做改变
    return this.makeMember(key, value);
  }

  makeMultiStringToMember(props) {
    let objects = {};
    props.forEach((item) => {
      objects = Object.assign(objects, this.makeSingleStringToMember(item));
    });

    return objects;
  }

  makeSingleArrayToMember(props) {
    let objects = {};
    props.forEach((item) => {
      objects = Object.assign(objects, this.makeSingleStringToMember(item));
    });

    return objects;
  }

  makeMultiArrayToMember(keys, values) {
    let objects = {};
    keys.forEach((item, index) => {
      objects = Object.assign(objects, this.makeMember(item, this.validateValue(values[index])));
    });
    return objects;
  }

  makeObjectToMember(props) {
    let objects = {};
    Object.keys(props).forEach((key) => {
      objects = Object.assign(objects, this.makeMember(key, this.validateValue(props[key])));
    });

    return objects;
  }

  freezeEnums(props) {
    return Object.freeze(props);
  }
}