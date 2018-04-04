/**
 * @file 枚举类
 * @desc 具体用法参阅README.md
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
      // 抛异常
      case LENGTH.ZERO:
        throw new Error(ERROR.NOTFOUNDPARAM);
        break;
      
      // 数组 or 字符串 or 对象
      case LENGTH.ONE:
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
            this.__enums = Object.assign(this.__enums, this.makeMultiArrayToMember(keys, values));
            break;
          
          case FLAG.ISSTRING:
            this.__enums = Object.assign(this.__enums, this.makeMultiStringToMember([keys, values]));
            break;
          
          default:
            throw new Error(ERROR.PARAMTYPEERROR);
        }

        break;
      
      // 字符串
      default:
        const argsToArray = Array.prototype.slice.apply(arguments);
        var isAllString= argsToArray.every(item => typeUtil.isString(item));
        if (!isAllString) throw new Error(ERROR.PARAMTYPEERROR);

        this.__enums = Object.assign(this.__enums, this.makeMultiStringToMember(argsToArray));
    }

    // 实例化之后返回冻结后的枚举对象
    return this.freezeEnums(this.__enums);
  }

  // 检查枚举值的有效性
  validateValue(value) {
    // 传入 Symbol，直接返回
    if (typeof value === 'symbol') {
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
  makeMember(key, value) {
    return new Member(key, value).toString();
  }

  // 单个字符串转化成枚举成员对象，内部直接调用makeMember()
  makeSingleStringToMember(props) {
    const isQualified = REGEXP.KEYEQUALVALUE.test(props);
    if (!isQualified) throw new Error(ERROR.PARAMTYPEERROR);

    const execResult = REGEXP.KEYEQUALVALUE.exec(props);
    const key = execResult[1];
    const value = this.validateValue(execResult[3]);

    // 字符串类型的值，不对指针做改变
    return this.makeMember(key, value);
  }

  // 字符串数组转化成枚举成员对象，内部调用makeSingleStringToMember()
  makeMultiStringToMember(props) {
    let objects = {};
    props.forEach((item) => {
      objects = Object.assign(objects, this.makeSingleStringToMember(item));
    });

    return objects;
  }

  // 单个数据转化成枚举成员对象，内部调用makeSingleStringToMember()
  makeSingleArrayToMember(props) {
    let objects = {};
    props.forEach((item) => {
      objects = Object.assign(objects, this.makeSingleStringToMember(item));
    });

    return objects;
  }

  // 两个数组转化成枚举成员对象，枚举值经过有效性判断，并且直接调用makeMember()
  makeMultiArrayToMember(keys, values) {
    let objects = {};
    keys.forEach((item, index) => {
      objects = Object.assign(objects, this.makeMember(item, this.validateValue(values[index])));
    });
    return objects;
  }

  // 单个对象转化成枚举成员对象，枚举值经过有效性判断，并且直接调用makeMember()
  makeObjectToMember(props) {
    let objects = {};
    Object.keys(props).forEach((key) => {
      objects = Object.assign(objects, this.makeMember(key, this.validateValue(props[key])));
    });

    return objects;
  }

  // 冻结枚举对象
  freezeEnums(props) {
    return Object.freeze(props);
  }
}