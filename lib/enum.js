/**
 * @file 枚举类
 * @desc 具体用法参阅README.md
 * @author ss
*/
import typeUtil from 'sugar-type';
import Member from './member';

import {
  FLAG,
  INIT,
  ERROR,
  REGEXP,
  LENGTH,
  EXPOSEMETHODS,
} from './config';

export default class Enum {
  constructor() {
    this.enums = {};

    this.__isLiteral = false;
    this.__isSetEnum = false;
    this.__pointer = INIT.START;

    const length = arguments.length;

    switch (length) {
      case LENGTH.ZERO:
        return this;
        break;

      default:
        return this.__dispatch(...arguments);
    }
  }

  useLiteral() {
    this.__isLiteral = true;
    return this;
  }

  // 传入枚举对象
  setEnum() {
    if (this.__isSetEnum) return this.freezeEnums();

    this.__isSetEnum = true;
    return this.__dispatch(...arguments);
  }

  // 冻结枚举对象
  freezeEnums(props) {
    return Object.freeze(props || this.enums);
  }

  __bindMethods() {
    for (let prop in Enum.prototype) {
      console.log(prop);
    }
  }

  __dispatch() {
    const length = arguments.length;

    switch (length) {
      // 抛异常
      case LENGTH.ZERO:
        this.__throwError(ERROR.NOTFOUNDPARAM);
        break;

      // 数组 or 字符串 or 对象
      case LENGTH.ONE:
        const props = arguments[0];
        const type = typeUtil.inspect(props);

        switch (type) {
          case 'string':
            this.enums = Object.assign(this.enums, this.__makeSingleStringToMember(props));
            break;

          case 'array':
            this.enums = Object.assign(this.enums, this.__makeSingleArrayToMember(props));
            break;

          case 'object':
            this.enums = Object.assign(this.enums, this.__makeObjectToMember(props));
            break;

          default:
            this.__throwError(ERROR.PARAMTYPEERROR);
        }
        break;

      // 数组 or 字符串
      case LENGTH.TWO:
        const keys = arguments[0];
        const values = arguments[1];

        var isAllArray = typeUtil.isArray(keys) && typeUtil.isArray(values);
        var isAllString = typeUtil.isString(keys) && typeUtil.isString(values);

        let flag = FLAG.ISZERO;
        if (isAllArray) flag = FLAG.ISARRAY;
        if (isAllString) flag = FLAG.ISSTRING;

        switch (flag) {
          case FLAG.ISARRAY:
            this.enums = Object.assign(this.enums, this.__makeMultiArrayToMember(keys, values));
            break;
          
          case FLAG.ISSTRING:
            this.enums = Object.assign(this.enums, this.__makeMultiStringToMember([keys, values]));
            break;
          
          default:
            this.__throwError(ERROR.PARAMTYPEERROR);
        }

        break;
      
      // 字符串
      default:
        const argsToArray = Array.prototype.slice.apply(arguments);
        var isAllString= argsToArray.every(item => typeUtil.isString(item));
        if (!isAllString) this.__throwError(ERROR.PARAMTYPEERROR);

        this.enums = Object.assign(this.enums, this.__makeMultiStringToMember(argsToArray));
    }

    // 实例化之后返回冻结后的枚举对象
    this.__isSetEnum = true;
    this.__bindMethods();
    return this.freezeEnums();
  }

  // 检查枚举值的有效性
  __validateValue(value) {
  // 传入 Symbol，直接返回
    if (typeUtil.isSymbol(value)) {
      return value;
    }

    // 存在可以转成Number的值
    if (!isNaN(Number(value))) {
      value = +value;

      // 内部指针移动的判断依据
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

  // 实例化成员
  __makeMember(key, value) {
    return new Member(key, value);
  }

  // 单个字符串转化成枚举成员对象，内部直接调用__makeMember()
  __makeSingleStringToMember(props) {
    const isQualified = REGEXP.KEYEQUALVALUE.test(props);
    if (!isQualified) this.__throwError(ERROR.PARAMTYPEERROR);

    const execResult = REGEXP.KEYEQUALVALUE.exec(props);
    const key = execResult[1];
    // const value = this.__validateValue(execResult[3]);
    const value = this.__setLiteral(execResult[3], key);
    
    // 字符串类型的值，不对指针做改变
    return this.__makeMember(key, value);
  }

  // 字符串数组转化成枚举成员对象，内部调用__makeSingleStringToMember()
  __makeMultiStringToMember(props) {
    let objects = {};
    props.forEach((item) => {
      objects = Object.assign(objects, this.__makeSingleStringToMember(item));
    });

    return objects;
  }

  // 单个数据转化成枚举成员对象，内部调用__makeSingleStringToMember()
  __makeSingleArrayToMember(props) {
    let objects = {};
    props.forEach((item) => {
      objects = Object.assign(objects, this.__makeSingleStringToMember(item));
    });

    return objects;
  }

  // 两个数组转化成枚举成员对象，枚举值经过有效性判断，并且直接调用__makeMember()
  __makeMultiArrayToMember(keys, values) {
    let objects = {};
    keys.forEach((key, index) => {
      objects = Object.assign(objects, this.__makeMember(key, this.__setLiteral(values[index], key)));
    });
    return objects;
  }

  // 单个对象转化成枚举成员对象，枚举值经过有效性判断，并且直接调用__makeMember()
  __makeObjectToMember(props) {
    let objects = {};
    Object.keys(props).forEach((key) => {
      objects = Object.assign(objects, this.__makeMember(key, this.__setLiteral(values[key], key)));
    });

    return objects;
  }

  // 根据用户设定采用是否按照字面量设置值
  __setLiteral(value, key) {
    return this.__isLiteral ? key : this.__validateValue(value);
  }

  // 抛异常
  __throwError(message) {
    this.__isSetEnum = false;

    throw new Error(message);
  }
}