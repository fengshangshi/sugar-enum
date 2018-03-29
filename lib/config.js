/**
 * @file 配置文件
 * @authro ss
 */

/**
 * @desc ERROR 表示参数异常的枚举
 * ZERO: 没有传入参数
 * ONE: 传入1个参数
 * TWO: 传入2个参数
 */
export const ERROR = {
  NOTFOUNDPARAM: '未传参数',
  PARAMTYPEERROR: '参数类型异常',
};

/**
 * @desc LENGTH 表示参数个数的枚举
 * ZERO: 没有传入参数
 * ONE: 传入1个参数
 * TWO: 传入2个参数
 */
export const LENGTH = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
};

/**
 * @desc FLAG 表示旗标的枚举
 * ISARRAY: 两个都是数组
 * ISSTRING: 两个都是字符串
 */
export const FLAG = {
  ISZERO: 0,
  ISARRAY: 1,
  ISSTRING: 2,
};

export const REGEXP = {
  'KEYEQUALVALUE': /^(\w+)(\s*=\s*([^\s]+))?$/i,
};

export const INIT = {
  START: 0,
};
