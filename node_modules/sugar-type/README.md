# sugar-type
sugar2.0框架的对象类型检测类库

## API
### inspect(target)
* target - 对象，任何类型的对象
* 返回 - 该对象的类型，字符串表示，如"string"，"number"，"error"，"map"等

用例如下:

```
const type = require('sugar-type');

type.inspect([]); //'array'
type.inspect({test: 1}); //'object'
type.inspect('123'); //'string'
type.inspect(123); //'number'
type.inspect(NaN); //'number'
type.inspect(function(){}); //'function'
type.inspect(new Date()); //'date'
type.inspect(new Error()); //'error'
type.inspect(new Map()); //'map'

```

还有更加快捷的判断，返回布尔值，如下：

### isEmpty(target)
检查Array、Object、Map、Set4个对象是否为空，其他类型会返回true。

```
type.isEmpty({}); // true
type.isEmpty({a: 1}); // false
type.isEmpty(123); // true
```

### isObject(target)
返回是否为对象类型，用法如下：

```
type.isObject({}); // true
type.isObject(123); // false
```
### isArray(target)
返回是否为数组类型，用法如下：

```
type.isArray([1, 2, 3]); // true
type.isArray('string'); // false
```

### isFunction(target)
返回是否为函数类型，用法如下：

```
type.isFunction(function(){}); // true
type.isFunction('string'); // false
```

### isRegExp(target)
返回是否为正则类型，用法如下：

```
type.isRegExp(/^abc/g); // true
type.isRegExp(true); // false
```

### isDate(target)
返回是否为日期类型，用法如下：

```
type.isDate(new Date()); // true
type.isDate(true); // false
```

### isMath(target)
返回是否为数学类型，用法如下：

```
type.isMath(Math); // true
type.isMath(123); // false
```

### isError(target)
返回是否为错误类型，用法如下：

```
type.isError(new Error('这里有问题')); // true
type.isError(true); // false
```


### isJSON(target)
返回是否为JSON类型，用法如下：

```
type.isJSON(JSON); // true
type.isJSON(true); // false
```



### isArguments(target)
返回是否为参数类型，用在函数里的参数数组判断，用法如下：

```
function fn(param) {
	console.log(type.isArguments(arguments)); // true
	console.log(type.isArguments(true)); // false
}
fn('param');
```



### isMap(target)
返回是否为map类型，用法如下：

```
let map = new Map();
map.set(1, '我是小1');
map.set(2, '我是小二');
map.set(3, '我是小三');
type.isMap(map); // true
type.isMap(true); // false
```


### isSet(target)
返回是否为set类型，用法如下：

```
let set = new Set();
set.add(1);
set.add(2);
set.add(3);
type.isMap(set); // true
type.isMap(true); // false
```



### isString(target)
返回是否为字符串类型





### isNumber(target)
返回是否为数字类型




### isBoolean(target)
返回是否为布尔类型




### isNull(target)
返回是否为null类型




### isUndefined(target)
返回是否为undefined类型
