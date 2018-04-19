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
 * @desc 正则表达式
 * /^(\w+)(\s*=\s*([^\s]+))?$/i
 * 形如：
 * name=shagnshi.feng,
 * name=
 * name
 */
export const REGEXP = {
  'KEYEQUALVALUE': /^(\w+)(\s*=\s*([^\s]+))?$/i,
};

/**
 * @desc 指针初始化
 */
export const POINTER = {
  START: 0,
};
