/**
 * @file 成员类
 * @author ss
 */

export default class Member {
  constructor(key, value) {
    this.__key = key;
    this.__value = value;

    return this.toString();
  }

  toString() {
    const key = this.__key.toUpperCase();
    return {
      [key]: this.__value,
    };
  }
}
