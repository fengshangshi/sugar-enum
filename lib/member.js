/**
 * @file 成员类
 * @author ss
 */
import typeUtil from 'sugar-type';

export default class Member {
  constructor(key, value) {
    this.__key = key;
    this.__value = value;
  }

  toObject() {
    return { [this.__key.toUpperCase()]: this.__value };
  }

  toExchangeObject() {
    return { [this.__value] : this.__key };
  }
}
