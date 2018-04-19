/**
 * @file 枚举类
 * @desc 具体用法参阅README.md
 * @author ss
 */
import typeUtil from 'sugar-type';
import Member from './member';

import {
  ERROR,
  REGEXP,
  POINTER,
} from './config';

export default class Enum {
  constructor() {
    this.__enums = {};
    this.__exchangeEnums = {};
    this.__pointer = POINTER.START;

    this.__dispatch(...arguments);
    this.__scattering();
  }

  get enums() {
    const exchangeEnums = this.__exchangeEnums;
    const enums = Object.assign({}, this.__enums);

    Object.keys(exchangeEnums).forEach((key) => {
      Object.defineProperty(enums, key, { value: exchangeEnums[key] });
    });

    return Object.freeze(enums);
  }

  // 是否包含在内
  contains(member) {
    const members = typeUtil.isArray(member) ? member : [member];
    return members.every(item => !!this.enums[item]);
  }

  // 将枚举成员挂在到实例上
  __scattering() {
    Object.keys(this.enums).forEach((key) => {
      Object.defineProperty(this, key, {
        value: this.enums[key],
        enumerable: true,
      });
    });
  }

  __dispatch() {
    const raw = [].concat(...arguments);
    const length = raw.length;

    switch (length) {
      // 数组 or 字符串 or 对象
      case 1:
        const props = raw[0];
        const type = typeUtil.inspect(props);

        switch (type) {
          case 'string':
            this.__makeSingleStringToMember(props);
            break;
          
          case 'array':
            this.__makeSingleArrayToMember(props);
            break;

          case 'object':
            this.__makeObjectToMember(props);
            break;

          default:
            this.__throwError(ERROR.PARAMTYPEERROR);
        }
        break;

      // 数组 or 字符串
      case 2:
        const keys = raw[0];
        const values = raw[1];

        var isAllArray = typeUtil.isArray(keys) && typeUtil.isArray(values);
        var isAllString = typeUtil.isString(keys) && typeUtil.isString(values);

        // 两个都是数组类型的数据
        if (isAllArray) {
          return this.__makeMultiArrayToMember(keys, values);
        }

        // 两个是字符串类型的数据
        if (isAllString) {
          return this.__makeMultiStringToMember([keys, values]);
        }

        // 否则就报错
        this.__throwError(ERROR.PARAMTYPEERROR);

        break;
      
      default:
        var isAllString = raw.every(item => typeUtil.isString(item));
        if (!isAllString) return this.__throwError(ERROR.PARAMTYPEERROR);

        this.__makeMultiStringToMember(raw);
    }
  }

  __validateValue(value) {
    // 传入symbol，直接返回
    if (typeUtil.isSymbol(value)) {
      return value;
    }

    // 存在可以转成Number的值
    if (!isNaN(Number(value))) {
      value = +value;
      // 内部指针移动的判断依据
      if (this.__pointer < value) {
        this.__pointer = value;
      }
    }

    // 未传值，采用内部指针
    if (typeUtil.isUndefined(value)) {
      value = ++this.__pointer;
    }

    return value;
  }

  __makeMember(key, value) {
    const member = new Member(key, value);
    this.__enums = Object.assign(this.__enums, member.toObject());
    this.__exchangeEnums = Object.assign(this.__exchangeEnums, member.toExchangeObject());
  }

  // 单个字符串转化成枚举成员对象，内部直接调用__makeMember()
  __makeSingleStringToMember(props) {
    const isQualified = REGEXP.KEYEQUALVALUE.test(props);
    if (!isQualified) return this.__throwError(ERROR.PARAMTYPEERROR);

    const execResult = REGEXP.KEYEQUALVALUE.exec(props);
    const key = execResult[1];
    const value = this.__validateValue(execResult[3]);

    this.__makeMember(key, value);
  }

  // 字符串数组转化成枚举成员对象，内部调用__makeSingleStringToMember()
  __makeMultiStringToMember(props) {
    props.forEach((item) => {
      this.__makeSingleStringToMember(item);
    });
  }

  // 单个数组转化成枚举成员对象，内部调用__makeSingleStringToMember()
  __makeSingleArrayToMember(props) {
    props.forEach((item) => {
      this.__makeSingleStringToMember(item);
    });
  }

  // 两个数组转化成枚举成员对象，枚举值经过有效性判断，并且直接调用__makeMember()
  __makeMultiArrayToMember(keys, values) {
    keys.forEach((key, index) => {
      this.__makeMember(key, this.__validateValue(values[index]));
    });
  }

  // 单个对象转化成枚举成员对象，枚举值经过有效性判断，并且直接调用__makeMember()
  __makeObjectToMember(props) {
    Object.keys(props).forEach((key) => {
      this.__makeMember(key, this.__validateValue(props[key]));
    });
  }

  __throwError(message) {
    throw new Error(message);
  }
};
