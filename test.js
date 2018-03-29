

/**
 * 测试case
 * new Enum('name)
 */
new Enum('name=冯尚实', 'age=25', 'tail=175');
new Enum('name = 冯尚实', 'age=25', 'tail=175');
new Enum(['name=冯尚实', 'age=25', 'tail=175']);
new Enum(['name', 'age', 'tail'], ['冯尚实', '25', 175]);
new Enum({
  name: '冯尚实',
  tial: 175,
  age: 25,
});

new Enum('name=冯尚实');
new Enum('buhuo', 'puhuo', 'chehuo');
new Enum('name=冯尚实', 'age');

//wrong
new Enum(['name', 'age', 'tail'], ['冯尚实', '25', 175], ['a', 'b', 'c'], ['1', '2', 3]);
new Enum(['name=', 'age', 'tail']);
new Enum({
  name: '冯尚实',
  tial: 175,
  age: 25,
}, ['a']);

