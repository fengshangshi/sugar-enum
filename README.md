# sugar-enum
枚举

## 如何使用
```js
import Enum from 'sugar-enum';

const types = new Enum({
  supply: 1,
  setUp: 2,
  undo: 3,
}); 
console.log(types.enums) // {SUPPLY: 1, SETUP: 2, UNDO: 3, 1: "supply", 2: "setUp", 3: "undo"}

console.log(types.SUPPLY) // also OK, return 1
```


## 参数
### 字符串
* new Enum(String[, String, ...]);
```js
new Enum('name'); // return {NAME: 1}
new Enum('name=冯尚实', 'age', 'tail = 178'); // {NAME: "冯尚实", AGE: 1, TAIL: 178}
```

### 数组
* new Enum(Array[, Array]);
```js
// 单个数组
new Enum(['a', 'b', 'c=8', 'd', 'e=5']); // {A: 1, B: 2, C: 8, D: 9, E: 5}
new Enum(['a=10', 'b', 'a=8', 'd', 'e=5']); // {A: 8, B: 11, D: 12, E: 5}

// [keys], [values]数组
new Enum(['a', 'b', 'c'], [1]); // {A: 1, B: 2, C: 3}
new Enum(['a', 'b', 'c=8'], [1, 2, 3, 4]); // {A: 1, B: 2, C=8: 3}

// 三个及以上数组
new Enum(['a', 'b', 'c'], [1, 2, 3], [4, 5, 6]); 
/** 
Uncaught Error: 参数类型异常
    at new Enum (enum.js?31d3:76)
    at <anonymous>:1:1 
*/
```

### 对象
```js
// 单个对象
new Enum({
  name: 'shangshi.feng',
  age: '20',
  tail: '178',
}); // {NAME: "shangshi.feng", AGE: 20, TAIL: 178}

// 两个及以上对象
const a = {
  name: 'shangshi.feng',
  age: '20',
  tail: '178',
};
const b = {
  name: 'sugar.feng',
  age: '6',
  tail: '125',
}
new Enum(a, b);
/** 
Uncaught Error: 参数类型异常
    at new Enum (enum.js?31d3:76)
    at <anonymous>:1:1 
*/
```

## 属性
### enums
+ value反转为key的枚举成员不可被遍历
```js
const types = new Enum({
  supply: 1,
  setUp: 2,
  undo: 3,
}); 

console.log(types.enums)
// {SUPPLY: 1, SETUP: 2, UNDO: 3, 1: "supply", 2: "setUp", 3: "undo"}
// 其中成员{1: "supply", 2: "setUp", 3: "undo"}的enumerable为false，不可被遍历
```


## 方法
### contains()
```js
const types = new Enum({
  supply: 1,
  setUp: 2,
  undo: 3,
}); 

types.contains(types.SUPPLY); // true
types.contains([types.SUPPLY, types.SETUP]); // true
types.contains('A'); // false
```




## 更新记录
+ (0.1.0)20180419：支持contains方法，以及enums属性
+ (0.0.2)20180404：增加对symbol类型值得支持
